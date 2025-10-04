import React, { useState, useEffect } from 'react';

const steps = [
  { action: 'START', desc: 'A new transaction (T1) begins.' },
  { action: 'WRITE', tx: 1, op: 'STORE(Cat)', desc: 'T1 writes a STORE operation to the log.' },
  { action: 'WRITE', tx: 1, op: 'STORE(Dog)', desc: 'T1 writes another operation.' },
  { action: 'COMMIT', tx: 1, desc: 'T1 commits. The log entries are now durable.' },
  { action: 'INDEX', op: 'Cat', desc: 'The index is updated asynchronously for the "Cat" concept.' },
  { action: 'INDEX', op: 'Dog', desc: 'The index is updated for the "Dog" concept.' },
  { action: 'START', tx: 2, desc: 'A new transaction (T2) begins.' },
  { action: 'WRITE', tx: 2, op: 'RELATE(Cat, chases, Dog)', desc: 'T2 writes a RELATE operation.' },
  { action: 'COMMIT', tx: 2, desc: 'T2 commits its changes.' },
  { action: 'INDEX', op: 'Cat-chases-Dog', desc: 'The relationship index is now updated.' },
  { action: 'SNAPSHOT', desc: 'A snapshot is created, freezing the state for point-in-time recovery.' },
];

const LogEntry: React.FC<{ entry: any }> = ({ entry }) => {
    const isPending = entry.status === 'pending';
    const baseClasses = 'p-2 rounded transition-all duration-500';
    const pendingClasses = 'bg-amber-500/20 pending-stripes';
    const committedClasses = 'bg-sky-500/20';

    return (
        <div className={`${baseClasses} ${isPending ? pendingClasses : committedClasses}`}>
            <span className="font-mono text-xs">
                {entry.tx && <span className={isPending ? 'text-amber-300' : 'text-sky-300'}>T{entry.tx}: </span>}
                <span className="text-slate-300">{entry.op}</span>
                {isPending && <span className="text-amber-400 text-xs italic"> (Pending)</span>}
            </span>
        </div>
    );
};


export const PersistenceVisualizer: React.FC = () => {
    const [step, setStep] = useState(0);
    const [log, setLog] = useState<any[]>([]);
    const [index, setIndex] = useState<string[]>([]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => {
                const nextStepIndex = (prev + 1) % steps.length;
                const currentStep = steps[nextStepIndex];

                if (nextStepIndex === 0) {
                     setLog([]);
                     setIndex([]);
                }

                if (currentStep.action === 'WRITE') {
                    setLog(prevLog => [...prevLog, { ...currentStep, status: 'pending' }]);
                } else if (currentStep.action === 'COMMIT') {
                    setLog(prevLog => prevLog.map(entry => 
                        entry.tx === currentStep.tx ? { ...entry, status: 'committed' } : entry
                    ));
                } else if (currentStep.action === 'INDEX') {
                    setIndex(prevIndex => [...prevIndex, currentStep.op]);
                }
                return nextStepIndex;
            });
        }, 3000); // Slowed down to 3 seconds

        return () => clearInterval(interval);
    }, []);

    const currentStepData = steps[step];

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Append-Only Log */}
                <div>
                    <h4 className="font-bold text-slate-200 mb-2">Append-Only Log</h4>
                    <div className="p-2 bg-slate-800 rounded-md h-64 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent">
                       {log.map((entry, i) => (
                           <LogEntry key={i} entry={entry} />
                       ))}
                    </div>
                </div>
                 {/* Index */}
                <div>
                    <h4 className="font-bold text-slate-200 mb-2">In-Memory Index</h4>
                    <div className="p-2 bg-slate-800 rounded-md h-64 space-y-2">
                        {index.map((item, i) => (
                            <div key={i} className="bg-slate-700 p-2 rounded animate-fade-in">
                                <span className="font-mono text-xs text-green-400">"{item}"</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-md">
                <p className="font-semibold">Current Action: <span className="text-slate-300 font-normal">{currentStepData.desc}</span></p>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                .pending-stripes {
                    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent);
                    background-size: 20px 20px;
                    animation: stripes 1s linear infinite;
                }
                @keyframes stripes {
                    from { background-position: 0 0; }
                    to { background-position: 20px 0; }
                }
                .scrollbar-thin { scrollbar-width: thin; }
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 2px; }
             `}</style>
        </div>
    );
};