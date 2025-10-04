import React, { useState, useMemo, useEffect } from 'react';
import { RebacVisualizerElement } from '../types';

type AuthResult = {
    decision: 'Granted' | 'Denied';
    reason: string;
    path: string[];
}

const UserIcon = () => <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />;
const GroupIcon = () => <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-.31 0-.61.05-.9.14C15.45 4.4 16.17 4 17 4c1.66 0 3 1.34 3 3s-1.34 3-3 3c-1.66 0-3-1.34-3-3 0-.46.1-.9.27-1.31-.09.01-.18.01-.27.01zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>;
const ResourceIcon = () => <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/>;


export const RebacVisualizer: React.FC<Omit<RebacVisualizerElement, 'type'>> = ({ scenario }) => {
    const { nodes: initialNodes, edges, policies, principals, resources } = scenario;

    const [selectedPrincipal, setSelectedPrincipal] = useState(principals[0]);
    const [selectedResource, setSelectedResource] = useState(resources[1]);
    const [authResult, setAuthResult] = useState<AuthResult | null>(null);
    const [animatedPath, setAnimatedPath] = useState<string[]>([]);
    
    // Calculated, stable layout instead of hardcoded or physics-based
    const nodes = useMemo(() => {
        const columns: { [key: string]: string[] } = { user: [], group: [], resource: [] };
        initialNodes.forEach(n => columns[n.type].push(n.id));
        
        const positions: { [key: string]: { x: number, y: number } } = {};
        const columnX: { [key: string]: number } = { user: 75, group: 250, resource: 425 };
        
        Object.keys(columns).forEach(colType => {
            columns[colType].forEach((nodeId, index) => {
                const totalHeight = 250;
                const y = (totalHeight / (columns[colType].length + 1)) * (index + 1);
                positions[nodeId] = { x: columnX[colType], y: y + 25 };
            });
        });
        
        return initialNodes.map(n => ({...n, ...positions[n.id]}));
    }, [initialNodes]);

    const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

    useEffect(() => {
        if (!authResult) {
            setAnimatedPath([]);
            return;
        }

        const pathWithEdges = [...authResult.path];
        // add edge ids to path
        for(let i=0; i<authResult.path.length-1; i++){
            pathWithEdges.push(`${authResult.path[i]}-${authResult.path[i+1]}`);
        }

        setAnimatedPath([]);
        const timer = setTimeout(() => {
            for (let i = 0; i < pathWithEdges.length; i++) {
                setTimeout(() => {
                    setAnimatedPath(prev => [...prev, pathWithEdges[i]]);
                }, i * 300);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [authResult]);

    const handleCheckAccess = () => {
        setAuthResult(null); // Clear previous result to trigger animation
        const principalNode = nodes.find(n => n.label === selectedPrincipal);
        const resourceNode = nodes.find(n => n.label === selectedResource);

        if (!principalNode || !resourceNode) {
            setTimeout(() => setAuthResult({ decision: 'Denied', reason: 'Invalid principal or resource.', path: [] }), 50);
            return;
        }
        
        let result: AuthResult;

        // Hardcoded logic for the healthcare demo scenario
        if (resourceNode.id === 'records') {
            const isMemberOfCardiology = edges.some(e => e.source === principalNode.id && e.target === 'cardiology' && e.label === 'member_of');
            const deptHasAccess = edges.some(e => e.source === 'cardiology' && e.target === 'records' && e.label === 'has_access');
            
            if (isMemberOfCardiology && deptHasAccess) {
                 result = {
                    decision: 'Granted',
                    reason: `${principalNode.label} is a member of Cardiology, which has access to the records.`,
                    path: [principalNode.id, 'cardiology', 'records'],
                };
            } else {
                 result = {
                    decision: 'Denied',
                    reason: `${principalNode.label} does not have a relationship path to ${resourceNode.label}.`,
                    path: [principalNode.id, resourceNode.id],
                };
            }
        } else if (resourceNode.id === 'john') {
             const isTreating = edges.some(e => e.source === principalNode.id && e.target === 'john' && e.label === 'treated_by');
             if (isTreating) {
                 result = {
                    decision: 'Granted',
                    reason: `${principalNode.label} is directly treating ${resourceNode.label}.`,
                    path: [principalNode.id, 'john'],
                };
             } else {
                 result = {
                    decision: 'Denied',
                    reason: `${principalNode.label} does not have a "treated_by" relationship with ${resourceNode.label}.`,
                    path: [principalNode.id, resourceNode.id],
                };
             }
        } else {
            result = { decision: 'Denied', reason: "Policy for this resource is not defined in the demo.", path: [] };
        }
        setTimeout(() => setAuthResult(result), 50);
    };
    
    const colors = {
        user: '#f472b6', // pink-400
        group: '#60a5fa', // blue-400
        resource: '#4ade80', // green-400
        defaultStroke: '#475569', // slate-600
        highlight: '#facc15', // yellow-400
    };
    
    const icons = {
        user: <UserIcon />,
        group: <GroupIcon />,
        resource: <ResourceIcon />
    }

    return (
        <div className="my-6 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="md:col-span-2 h-[350px] bg-slate-800/50 rounded-t-lg relative">
                <svg width="100%" height="100%" viewBox="0 0 500 300">
                    <defs><marker id="arrowhead-sec" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-600" /></marker></defs>
                    {edges.map(edge => {
                        const sourceNode = nodeMap.get(edge.source);
                        const targetNode = nodeMap.get(edge.target);
                        if (!sourceNode || !targetNode) return null;
                        
                        const edgeId = `${edge.source}-${edge.target}`;
                        const isHighlighted = animatedPath.includes(edgeId);

                        const dx = targetNode.x - sourceNode.x;
                        const dy = targetNode.y - sourceNode.y;
                        const mag = Math.sqrt(dx*dx + dy*dy);
                        const endX = targetNode.x - (dx / mag) * 28;
                        const endY = targetNode.y - (dy / mag) * 28;


                        return (
                            <g key={edgeId}>
                                <path d={`M ${sourceNode.x} ${sourceNode.y} L ${endX} ${endY}`} stroke={colors.defaultStroke} strokeWidth="1.5" markerEnd="url(#arrowhead-sec)" className="transition-all duration-300" style={{ stroke: isHighlighted ? colors.highlight : '' }} />
                                <text x={(sourceNode.x + targetNode.x) / 2} y={(sourceNode.y + targetNode.y) / 2 - 8} fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-mono">{edge.label}</text>
                            </g>
                        );
                    })}
                    {nodes.map(node => {
                         const isHighlighted = animatedPath.includes(node.id);
                         return (
                            <g key={node.id} transform={`translate(${node.x},${node.y})`} className="transition-all duration-300" style={{ filter: isHighlighted ? `drop-shadow(0 0 8px ${colors.highlight})` : ''}}>
                                <circle cx="0" cy="0" r="25" fill={colors[node.type]} stroke="#0f172a" strokeWidth={4} />
                                <svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24" fill="#0f172a">
                                    {icons[node.type]}
                                </svg>
                                <text x="0" y="40" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">{node.label}</text>
                            </g>
                        )
                    })}
                </svg>
            </div>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="principal" className="block text-sm font-medium text-slate-300">Principal (User)</label>
                        <select id="principal" value={selectedPrincipal} onChange={e => setSelectedPrincipal(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-800 border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-slate-200">
                           {principals.map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="resource" className="block text-sm font-medium text-slate-300">Resource</label>
                        <select id="resource" value={selectedResource} onChange={e => setSelectedResource(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-800 border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-slate-200">
                           {resources.map(r => <option key={r}>{r}</option>)}
                        </select>
                    </div>
                    <button onClick={handleCheckAccess} className="w-full bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-500">Check Access</button>
                </div>
                 {authResult && (
                    <div className={`p-3 rounded-md transition-all duration-300 ${authResult.decision === 'Granted' ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'} border`}>
                        <h4 className={`font-bold ${authResult.decision === 'Granted' ? 'text-green-400' : 'text-red-400'}`}>Access {authResult.decision}</h4>
                        <p className="text-xs text-slate-400 mt-1">{authResult.reason}</p>
                    </div>
                )}
                 <p className="text-xs text-slate-500 italic text-center">{policies.description}</p>
            </div>
        </div>
    );
};
