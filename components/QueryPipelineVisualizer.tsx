import React, { useState, useEffect } from 'react';

const stages = ['Parse', 'Optimize', 'Execute', 'Cache', 'Result'];

const stageDescriptions = {
    'Parse': 'The raw query string is converted into an Abstract Syntax Tree (AST).',
    'Optimize': 'The engine determines the most efficient way to run the query, perhaps by using an index.',
    'Execute': 'The optimized plan is run against the graph data.',
    'Cache': 'The result is stored in a cache for faster access next time.',
    'Result': 'The final result is returned to the user.',
};

export const QueryPipelineVisualizer: React.FC = () => {
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStage(prev => (prev + 1) % stages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    
    const queryPosition = `${(currentStage * 25)}%`;

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="relative h-24 p-4">
                {/* Pipeline Track */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700" />
                
                {/* Stages */}
                <div className="relative flex justify-between items-center">
                    {stages.slice(0, -1).map((stage, i) => (
                        <div key={stage} className="flex flex-col items-center">
                             <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-500 ${currentStage >= i ? 'bg-sky-500 border-sky-400' : 'bg-slate-600 border-slate-500'}`} />
                             <p className={`text-xs mt-2 transition-colors duration-500 ${currentStage >= i ? 'text-sky-400' : 'text-slate-500'}`}>{stage}</p>
                        </div>
                    ))}
                </div>
                
                 {/* Animated Query Packet */}
                <div 
                    className="absolute top-1/2 w-48 -translate-y-1/2 transition-all duration-500 ease-in-out" 
                    style={{ left: `calc(${queryPosition} - 3.5rem)` }}
                >
                    <div className="bg-amber-400 p-2 rounded-md shadow-lg text-center font-mono text-xs text-slate-900">
                        RETRIEVE(...)
                    </div>
                </div>
            </div>
             <div className="mt-4 p-3 bg-slate-800 rounded-md text-sm min-h-[56px]">
                <p className="font-semibold text-center">{stages[currentStage]}: <span className="text-slate-300 font-normal">{stageDescriptions[stages[currentStage] as keyof typeof stageDescriptions]}</span></p>
            </div>
        </div>
    );
};
