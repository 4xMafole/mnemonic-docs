import React, { useState, useEffect } from 'react';

const nodes = [
    { id: 'alice', label: 'Alice', type: 'user', pos: { x: 50, y: 100 } },
    { id: 'analysts', label: 'Analysts', type: 'group', pos: { x: 200, y: 100 } },
    { id: 'data', label: 'Financial Data', type: 'resource', pos: { x: 350, y: 100 } },
];

const edges = [
    { from: 'alice', to: 'analysts', label: 'member_of' },
    { from: 'analysts', to: 'data', label: 'has_permission' },
];

export const InheritanceVisualizer: React.FC = () => {
    const [isChecking, setIsChecking] = useState(false);
    const [highlighted, setHighlighted] = useState<string[]>([]);
    
    useEffect(() => {
        let timer: number;
        if (isChecking) {
            const path = ['alice', 'alice-analysts', 'analysts', 'analysts-data', 'data'];
            for (let i = 0; i < path.length; i++) {
                setTimeout(() => {
                    setHighlighted(prev => [...prev, path[i]]);
                }, i * 400);
            }
            timer = window.setTimeout(() => setIsChecking(false), path.length * 400 + 1000);
        } else {
            setHighlighted([]);
        }
        return () => clearTimeout(timer);
    }, [isChecking]);

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="w-full h-48 bg-slate-800/50 rounded-lg relative">
                <svg width="100%" height="100%" viewBox="0 0 400 200">
                     <defs>
                        <marker id="arrow-inherit" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500 transition-colors duration-300" />
                        </marker>
                    </defs>
                    {edges.map(edge => {
                        const sourceNode = nodes.find(n => n.id === edge.from)!;
                        const targetNode = nodes.find(n => n.id === edge.to)!;
                        const edgeId = `${edge.from}-${edge.to}`;
                        const isHighlighted = highlighted.includes(edgeId);

                         const dx = targetNode.pos.x - sourceNode.pos.x;
                         const dy = targetNode.pos.y - sourceNode.pos.y;
                         const mag = Math.sqrt(dx*dx + dy*dy);
                         const endX = targetNode.pos.x - (dx / mag) * 20;
                         const endY = targetNode.pos.y - (dy / mag) * 20;

                        return (
                             <g key={edgeId}>
                                <path d={`M ${sourceNode.pos.x} ${sourceNode.pos.y} L ${endX} ${endY}`} stroke={isHighlighted ? '#22c55e' : '#64748b'} strokeWidth="1.5" markerEnd="url(#arrow-inherit)" className="transition-all duration-300" />
                                <text x={(sourceNode.pos.x + targetNode.pos.x) / 2} y={(sourceNode.pos.y + targetNode.pos.y) / 2 - 8} fill={isHighlighted ? '#86efac' : '#94a3b8'} fontSize="10" textAnchor="middle" className="font-mono transition-colors duration-300">{edge.label}</text>
                            </g>
                        )
                    })}
                    {nodes.map(node => (
                        <g key={node.id} className="transition-all duration-300" style={{ filter: highlighted.includes(node.id) ? 'drop-shadow(0 0 5px #22c55e)' : '' }}>
                            <circle cx={node.pos.x} cy={node.pos.y} r="15" fill={node.type === 'user' ? '#f472b6' : node.type === 'group' ? '#60a5fa' : '#4ade80'} />
                            <text x={node.pos.x} y={node.pos.y + 28} textAnchor="middle" fontSize="10" className="fill-slate-300">{node.label}</text>
                        </g>
                    ))}
                </svg>
            </div>
             <div className="mt-4 text-center">
                 <button onClick={() => setIsChecking(true)} disabled={isChecking} className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-500 disabled:bg-slate-600">
                    Check Alice's access to Financial Data
                </button>
             </div>
             <div className="mt-2 text-center text-xs text-slate-400 min-h-[16px]">
                {highlighted.includes('data') && <p className="animate-fade-in font-semibold text-green-400">Access Granted (via membership in 'Analysts')</p>}
             </div>
        </div>
    );
};
