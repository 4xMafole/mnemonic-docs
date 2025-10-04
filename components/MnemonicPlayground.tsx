import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GraphVisualizer } from './GraphVisualizer';
import { GraphNode, GraphEdge } from '../types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const initialNodes: GraphNode[] = [
    { id: 'n1', label: 'Dr. Aris Thorne', type: 'person' },
    { id: 'n2', label: 'Jaxon "Jax" Vance', type: 'person' },
    { id: 'n3', label: 'Lyra Kaelen', type: 'person' },
    { id: 'n4', label: 'Cygnus Corp', type: 'corporation' },
    { id: 'n5', label: 'Orion Syndicate', type: 'corporation' },
    { id: 'n6', label: 'Titan Prime', type: 'location' },
    { id: 'n7', label: 'The Citadel', type: 'location' },
    { id: 'n8', label: 'Mnemonic Core', type: 'technology' },
    { id: 'n9', label: 'The Starstrider', type: 'ship' },
    { id: 'n10', label: 'Project Chimera', type: 'project' },
    { id: 'n11', label: 'The Titan Incident', type: 'event' },
];
const initialEdges: GraphEdge[] = [
    { id: 'e1', source: 'n1', target: 'n4', label: 'works_for' },
    { id: 'e2', source: 'n3', target: 'n5', label: 'works_for' },
    { id: 'e3', source: 'n1', target: 'n8', label: 'invented' },
    { id: 'e4', source: 'n4', target: 'n6', label: 'located_on' },
    { id: 'e5', source: 'n5', target: 'n7', label: 'operates_from' },
    { id: 'e6', source: 'n2', target: 'n9', label: 'pilots' },
    { id: 'e7', source: 'n3', target: 'n2', label: 'knows' },
    { id: 'e8', source: 'n7', target: 'n6', label: 'orbits' },
    { id: 'e9', source: 'n1', target: 'n10', label: 'leads' },
    { id: 'e10', source: 'n4', target: 'n10', label: 'funds' },
    { id: 'e11', source: 'n10', target: 'n11', label: 'related_to' },
];

type Message = {
    text: string;
    type: 'success' | 'error' | 'info';
}

export const MnemonicPlayground: React.FC = () => {
    const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
    const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
    const [command, setCommand] = useState('');
    const [message, setMessage] = useState<Message | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [highlighted, setHighlighted] = useState<{nodes: string[], edges: string[]}>({ nodes: [], edges: [] });
    
    const inputRef = useRef<HTMLInputElement>(null);
    let nodeIdCounter = useRef(nodes.length);
    let edgeIdCounter = useRef(edges.length);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    useEffect(() => {
        if (highlighted.nodes.length > 0 || highlighted.edges.length > 0) {
            const timer = setTimeout(() => setHighlighted({ nodes: [], edges: [] }), 5000);
            return () => clearTimeout(timer);
        }
    }, [highlighted]);

    const findNodeByLabel = useCallback((label: string) => nodes.find(n => n.label.toLowerCase() === label.toLowerCase()), [nodes]);
    const getNodeLabel = useCallback((id: string) => nodes.find(n => n.id === id)?.label || '', [nodes]);
    
    const getGraphStateForPrompt = useCallback(() => {
        const concepts = nodes.map(n => `  - ${n.label} (id: ${n.id}, type: ${n.type || 'unknown'})`).join('\n');
        const relations = edges.map(e => {
            const sourceLabel = getNodeLabel(e.source);
            const targetLabel = getNodeLabel(e.target);
            return `  - ${sourceLabel} -[${e.label}]-> ${targetLabel}`;
        }).join('\n');
        return `Current Graph State:\nConcepts:\n${concepts}\nRelationships:\n${relations}`;
    }, [nodes, edges, getNodeLabel]);

    const executeCommand = async (commandToExecute: string) => {
        if (!commandToExecute.trim()) return;

        setIsLoading(true);
        setMessage({ text: 'Thinking...', type: 'info' });
        setCommand('');
        setHighlighted({ nodes: [], edges: [] });

        const systemInstruction = `You are an AI assistant for the Mnemonic Workbench. Your goal is to translate natural language commands into one of the four Mnemonic operations: STORE, RELATE, RETRIEVE, or UNRELATE. You MUST respond with a function call. Do not respond with plain text. Available functions: storeConcept, relateConcepts, retrieveFromGraph. When storing, try to infer a type from this list: 'person', 'corporation', 'location', 'technology', 'ship', 'project', 'event'.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${getGraphStateForPrompt()}\n\nUser command: "${commandToExecute}"`,
                config: {
                    systemInstruction,
                    tools: [{ functionDeclarations: [
                        { name: 'storeConcept', parameters: { type: 'OBJECT', properties: { label: { type: 'STRING' }, type: { type: 'STRING' } }, required: ['label'] } },
                        { name: 'relateConcepts', parameters: { type: 'OBJECT', properties: { sourceLabel: { type: 'STRING' }, relation: { type: 'STRING' }, targetLabel: { type: 'STRING' } }, required: ['sourceLabel', 'relation', 'targetLabel'] } },
                        { name: 'retrieveFromGraph', parameters: { type: 'OBJECT', properties: { sourceLabel: { type: 'STRING' }, relation: { type: 'STRING' } }, required: ['sourceLabel', 'relation'] } },
                        { name: 'error', parameters: {type: 'OBJECT', properties: { message: {type: 'STRING'}}, required: ['message']}}
                    ]}]
                }
            });

            const call = response.functionCalls?.[0];
            if (!call) throw new Error("I couldn't understand that command.");
            if(call.name === 'error') throw new Error(call.args.message);

            if (call.name === 'storeConcept') {
                const { label, type } = call.args;
                if (findNodeByLabel(label)) {
                    throw new Error(`Concept '${label}' already exists.`);
                }
                nodeIdCounter.current++;
                const newNode: GraphNode = { id: `n${nodeIdCounter.current}`, label, type };
                setNodes(prev => [...prev, newNode]);
                setMessage({ text: `✔ Concept '${label}' created.`, type: 'success' });
            } else if (call.name === 'relateConcepts') {
                const { sourceLabel, relation, targetLabel } = call.args;
                const sourceNode = findNodeByLabel(sourceLabel);
                const targetNode = findNodeByLabel(targetLabel);
                if (!sourceNode || !targetNode) {
                   throw new Error("Could not find one or both concepts to relate.");
                }
                edgeIdCounter.current++;
                const newEdge: GraphEdge = { id: `e${edgeIdCounter.current}`, source: sourceNode.id, target: targetNode.id, label: relation };
                setEdges(prev => [...prev, newEdge]);
                setMessage({ text: `✔ Related ${sourceNode.label} to ${targetLabel}.`, type: 'success' });
            } else if (call.name === 'retrieveFromGraph') {
                const source = findNodeByLabel(call.args.sourceLabel);
                if (!source) throw new Error("Concept not found for query.");
                const relation = call.args.relation;

                const results = edges.filter(e => e.source === source.id && e.label.toLowerCase().includes(relation.toLowerCase())).map(e => ({ node: nodes.find(n => n.id === e.target)!, edge: e }));
                
                setHighlighted({
                    nodes: [source.id, ...results.map(r => r.node.id)],
                    edges: results.map(r => r.edge.id)
                });
                const resultLabels = results.map(r => r.node.label);
                setMessage({ text: `✔ Found: ${resultLabels.length > 0 ? resultLabels.join(', ') : 'None'}.`, type: 'success' });
            }

        } catch (e: any) {
            setMessage({ text: `❌ ${e.message}`, type: 'error' });
        }
        setIsLoading(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(command);
    };

    const exampleCommands = [
      'Who leads Project Chimera?',
      'What is The Titan Incident related to?',
      'Who works for Cygnus Corp?',
      'What does Jax pilot?',
    ];
    
    return (
        <div className="my-8 h-[600px] relative bg-slate-800/50 rounded-lg border border-slate-700/50 flex flex-col overflow-hidden">
            <div className="flex-1 relative">
                <GraphVisualizer 
                    nodes={nodes} 
                    edges={edges} 
                    highlightedNodeIds={highlighted.nodes} 
                    highlightedEdgeIds={highlighted.edges} 
                />
            </div>
             <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="w-full max-w-2xl mx-auto">
                     {message && (
                        <div className={`mb-2 px-4 py-2 rounded-lg text-sm font-medium text-white shadow-lg
                            ${message.type === 'success' && 'bg-green-600/90'}
                            ${message.type === 'error' && 'bg-red-600/90'}
                            ${message.type === 'info' && 'bg-sky-600/90'}
                        `}>
                            {message.text}
                        </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="Use natural language to command the graph..."
                            className="w-full pl-10 pr-20 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            disabled={isLoading}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657L13.414 14.414m2.828-2.828a6 6 0 11-8.484-8.484 6 6 0 018.484 8.484z" /></svg>
                        </div>
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-full disabled:bg-slate-600" disabled={isLoading}>
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </form>
                     <div className="text-center mt-2">
                        {exampleCommands.map(ex => (
                            <button 
                                key={ex}
                                onClick={() => executeCommand(ex)}
                                className="text-xs text-slate-500 hover:text-sky-400 px-2 py-1 rounded-full transition-colors"
                            >
                               "{ex}"
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};