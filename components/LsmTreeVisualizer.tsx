import React, { useState, useEffect, useMemo } from 'react';

const steps = [
    { phase: 'init', desc: 'The system is ready to accept writes.' },
    { phase: 'write', value: 8, desc: 'A write for key "8" arrives and is added to the in-memory MemTable.' },
    { phase: 'write', value: 3, desc: 'Write(3) arrives and is sorted into the MemTable.' },
    { phase: 'write', value: 6, desc: 'Write(6) arrives and is sorted into the MemTable.' },
    { phase: 'flush', desc: 'The MemTable is now full. It will be flushed to a persistent SSTable on disk.' },
    { phase: 'write', value: 9, desc: 'A new MemTable is created to handle incoming writes. Write(9) arrives.' },
    { phase: 'write', value: 1, desc: 'Write(1) is added to the new MemTable and sorted.' },
    { phase: 'flush', desc: 'This MemTable is also full now and will be flushed to a second SSTable.' },
    { phase: 'compact_start', desc: 'A background compaction process begins to merge smaller SSTables to improve read performance.' },
    { phase: 'compact_end', desc: 'The two SSTables are merged into a single, larger, more efficient SSTable on disk.' },
];

const ValueBlock: React.FC<{ value: number; type: 'mem' | 'disk' | 'flushing' }> = ({ value, type }) => {
    const baseClass = "w-10 h-10 flex items-center justify-center font-bold rounded text-slate-900 transition-all duration-500";
    const typeClass = {
        mem: "bg-sky-400",
        disk: "bg-amber-400",
        flushing: "bg-sky-400 scale-90 opacity-50",
    }[type];
    return <div className={`${baseClass} ${typeClass}`}>{value}</div>;
};

export const LsmTreeVisualizer: React.FC = () => {
    const [step, setStep] = useState(0);
    const [memTable, setMemTable] = useState<number[]>([]);
    const [flushingMemTable, setFlushingMemTable] = useState<number[]>([]);
    const [ssTables, setSsTables] = useState<number[][]>([]);
    const [isCompacting, setIsCompacting] = useState(false);

    const currentStepData = useMemo(() => steps[step], [step]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => {
                const nextStepIndex = (prev + 1) % steps.length;
                const nextStep = steps[nextStepIndex];

                if (nextStepIndex === 0) { // Reset
                    setMemTable([]);
                    setSsTables([]);
                    setIsCompacting(false);
                    setFlushingMemTable([]);
                    return 0;
                }

                switch (nextStep.phase) {
                    case 'write':
                        setMemTable(prev => [...prev, nextStep.value!].sort((a, b) => a - b));
                        break;
                    case 'flush':
                        setFlushingMemTable(memTable);
                        setMemTable([]);
                        setTimeout(() => {
                            setSsTables(prev => [...prev, flushingMemTable].sort((a,b) => a[0] - b[0]));
                            setFlushingMemTable([]);
                        }, 1500); // Animation duration
                        break;
                    case 'compact_start':
                        setIsCompacting(true);
                        break;
                    case 'compact_end':
                        if (ssTables.length >= 2) {
                             const merged = [...ssTables[0], ...ssTables[1]].sort((a, b) => a - b);
                             setSsTables([merged]);
                        }
                        setIsCompacting(false);
                        break;
                }
                
                return nextStepIndex;
            });
        }, 4000); // Slowed down to 4 seconds

        return () => clearInterval(interval);
    }, [memTable, flushingMemTable, ssTables]);

    const compactingTables = isCompacting ? ssTables.slice(0, 2) : [];
    const stableTables = isCompacting ? ssTables.slice(2) : ssTables;

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            <div className="relative flex flex-col space-y-4">
                {/* Memory Zone */}
                <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <h4 className="font-bold text-sky-400 mb-2">Memory (Fast, Volatile)</h4>
                    <div className="relative flex justify-center items-center gap-2 p-2 h-20 rounded-md">
                        <span className="absolute top-0 left-2 text-xs text-slate-500">MemTable</span>
                        {memTable.map(d => <ValueBlock key={d} value={d} type="mem" />)}
                        
                        {/* Flushing animation container */}
                        {flushingMemTable.map((d, i) => (
                           <div key={d} className="absolute transition-transform duration-1000" style={{ transform: 'translateY(150px)', left: `${(i*2.75)+4}rem`}}>
                                <ValueBlock value={d} type="flushing" />
                           </div>
                        ))}
                    </div>
                </div>

                {/* Disk Zone */}
                <div className="text-center p-4 rounded-lg bg-slate-800/50 border border-slate-700 min-h-[15rem]">
                    <h4 className="font-bold text-amber-400 mb-2">Disk (Slower, Persistent)</h4>
                    <div className="relative flex flex-col items-center gap-2 p-2 min-h-[12rem] rounded-md">
                         <span className="absolute top-0 left-2 text-xs text-slate-500">SSTables</span>
                         {stableTables.map((tableData, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-md">
                                {tableData.map(d => <ValueBlock key={d} value={d} type="disk" />)}
                            </div>
                        ))}
                        {isCompacting && (
                            <div className="absolute bottom-0 w-full flex flex-col items-center">
                                <div className="text-xs text-green-400 mb-2 animate-pulse">Compaction Process</div>
                                <div className="flex gap-2 transition-opacity duration-500">
                                   {compactingTables.map((tableData, i) => (
                                       <div key={i} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-md opacity-30">
                                           {tableData.map(d => <ValueBlock key={d} value={d} type="disk" />)}
                                       </div>
                                   ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-md min-h-[40px] text-center">
                <p className="font-semibold">Current Action: <span className="text-slate-300 font-normal">{currentStepData.desc}</span></p>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
             `}</style>
        </div>
    );
};
