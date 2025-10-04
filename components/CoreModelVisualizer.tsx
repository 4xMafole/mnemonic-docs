import React, { useState } from 'react';

const steps = [
    { desc: 'Start with an empty graph canvas.', nodes: [], edges: [] },
    { desc: "Execute: STORE('Alice'). A new concept node is created.", nodes: [{ id: 'a', label: 'Alice' }], edges: [] },
    { desc: "Execute: STORE('Mnemonic'). Another concept node appears.", nodes: [{ id: 'a', label: 'Alice' }, { id: 'b', label: 'Mnemonic' }], edges: [] },
    { desc: "Execute: RELATE('Alice', 'likes', 'Mnemonic'). A directed relationship is formed.", nodes: [{ id: 'a', label: 'Alice' }, { id: 'b', label: 'Mnemonic' }], edges: [{ from: 'a', to: 'b', label: 'likes' }] },
];

export const CoreModelVisualizer: React.FC = () => {
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(prev => (prev + 1) % steps.length);
    const handleReset = () => setStep(0);
    
    const currentStep = steps[step];
    const nodePositions: { [key: string]: { x: number, y: number } } = {
        a: { x: 100, y: 100 },
        b: { x: 300, y: 100 },
    };

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="w-full h-48 bg-slate-800/50 rounded-lg relative">
                <svg width="100%" height="100%" viewBox="0 0 400 200">
                    <defs>
                        <marker id="arrow-core" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-500" />
                        </marker>
                    </defs>
                    {currentStep.edges.map(edge => {
                         const sourcePos = nodePositions[edge.from];
                         const targetPos = nodePositions[edge.to];
                         const dx = targetPos.x - sourcePos.x;
                         const dy = targetPos.y - sourcePos.y;
                         const mag = Math.sqrt(dx*dx + dy*dy);
                         const endX = targetPos.x - (dx / mag) * 20;
                         const endY = targetPos.y - (dy / mag) * 20;
                        return (
                             <g key={`${edge.from}-${edge.to}`} className="animate-fade-in">
                                <path d={`M ${sourcePos.x} ${sourcePos.y} L ${endX} ${endY}`} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow-core)" />
                                <text x={(sourcePos.x + targetPos.x) / 2} y={(sourcePos.y + targetPos.y) / 2 - 8} fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-mono">{edge.label}</text>
                            </g>
                        )
                    })}
                     {currentStep.nodes.map(node => (
                        <g key={node.id} className="animate-fade-in">
                            <circle cx={nodePositions[node.id].x} cy={nodePositions[node.id].y} r="15" className="fill-sky-500" />
                            <text x={nodePositions[node.id].x} y={nodePositions[node.id].y + 28} textAnchor="middle" fontSize="10" className="fill-slate-300">{node.label}</text>
                        </g>
                    ))}
                </svg>
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-md text-sm">
                 <p className="font-semibold">Step {step}: <span className="text-slate-300 font-normal">{currentStep.desc}</span></p>
            </div>
             <div className="mt-4 flex gap-4 justify-center">
                 <button onClick={handleNext} className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-500">
                    {step === steps.length - 1 ? 'Restart' : 'Next Step'}
                </button>
                {step > 0 && (
                    <button onClick={handleReset} className="bg-slate-600 text-slate-200 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-500">
                        Reset
                    </button>
                )}
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};
