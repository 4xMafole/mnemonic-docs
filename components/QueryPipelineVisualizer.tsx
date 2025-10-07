import React, { useState, useEffect } from 'react';

const stages = [
    { name: 'Parse', description: 'The raw query string is converted into a structured Abstract Syntax Tree (AST).' },
    { name: 'Optimize', description: 'The engine reorders operations and uses indices to create an efficient execution plan.' },
    { name: 'Execute', description: 'The optimized plan is run against the graph, traversing concepts and relationships.' },
    { name: 'Cache', description: 'Results are stored in a cache for faster access on subsequent identical queries.' },
    { name: 'Result', description: 'The final, compiled result set is returned to the client.' },
];

const TRAVEL_DURATION_MS = 3000;
const PAUSE_DURATION_MS = 2000;

export const QueryPipelineVisualizer: React.FC = () => {
    const [activeStageIndex, setActiveStageIndex] = useState(0);
    const [displayedStage, setDisplayedStage] = useState(stages[0]);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeStageIndex + 1) % stages.length;
            
            // Start moving the packet
            setActiveStageIndex(nextIndex);

            // Time the text change to when the packet arrives
            setIsFading(true);
            setTimeout(() => {
                setDisplayedStage(stages[nextIndex]);
                setIsFading(false);
            }, TRAVEL_DURATION_MS);

        }, TRAVEL_DURATION_MS + PAUSE_DURATION_MS);

        return () => clearInterval(interval);
    }, [activeStageIndex]);

    return (
        <div className="my-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="relative w-full h-24 flex items-center px-3 md:px-6">
                {/* Track */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-700/50 rounded-full" style={{ transform: 'translateY(-50%)' }} />
                <div className="absolute top-1/2 left-0 w-full h-4 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0 opacity-50 blur-lg" style={{ transform: 'translateY(-50%)' }} />

                {/* Stages */}
                <div className="w-full flex justify-between">
                    {stages.map((stage, i) => {
                        const isActive = activeStageIndex === i;
                        return (
                            <div key={stage.name} className="z-10 flex flex-col items-center">
                                <div className={`relative w-8 h-8 rounded-full border-2 transition-all duration-500 flex items-center justify-center
                                    ${isActive ? 'bg-sky-500/30 border-sky-400 shadow-glowing-sky' : 'bg-slate-800 border-slate-600'}`}>
                                    {isActive && <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />}
                                </div>
                                <p className={`mt-2 text-xs text-center font-semibold transition-colors duration-500 ${isActive ? 'text-sky-300' : 'text-slate-500'}`}>
                                    {stage.name}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Animated Query Packet */}
                <div className="absolute top-1/2 -translate-y-1/2" style={{
                    left: `${activeStageIndex * (100 / (stages.length - 1))}%`,
                    transform: `translateX(-50%) translateY(-50%)`,
                    transition: `left ${TRAVEL_DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
                }}>
                    <div className="relative w-7 h-7">
                        <div className="absolute inset-0 bg-sky-400 rounded-full blur-md animate-pulse opacity-80" />
                        <div className="absolute inset-1.5 bg-sky-300 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-slate-800 rounded-lg text-center min-h-[60px] flex items-center justify-center">
                <p 
                  key={displayedStage.name} 
                  className={`text-sm text-slate-300 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
                >
                    <strong className="font-semibold text-sky-400">{displayedStage.name}:</strong> {displayedStage.description}
                </p>
            </div>
            <style>{`
                .shadow-glowing-sky {
                    box-shadow: 0 0 15px 3px rgba(56, 189, 248, 0.4);
                }
            `}</style>
        </div>
    );
};