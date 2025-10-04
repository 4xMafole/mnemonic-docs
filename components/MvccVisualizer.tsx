import React, { useState } from 'react';

const scenario = [
    { step: 0, desc: "Initial State: Data 'x' has a value of 10." },
    { step: 1, desc: "Transaction A (T_A) starts and creates a snapshot of the database. It sees x = 10.", tx: 'A', action: 'START' },
    { step: 2, desc: "Transaction B (T_B) starts and also creates its own snapshot. It also sees x = 10.", tx: 'B', action: 'START' },
    { step: 3, desc: "T_A reads the value of x from its snapshot.", tx: 'A', action: 'READ', value: 10 },
    { step: 4, desc: "T_B reads the value of x from its own snapshot.", tx: 'B', action: 'READ', value: 10 },
    { step: 5, desc: "T_B writes a new value for x (x=20) and commits. A new version of x is created.", tx: 'B', action: 'WRITE_COMMIT', value: 20 },
    { step: 6, desc: "T_A still operates on its original snapshot and sees the old value (x=10).", tx: 'A', action: 'READ_AGAIN', value: 10 },
    { step: 7, desc: "T_A attempts to write its own value (x=30). At commit, the system detects a write-write conflict because the data has changed since T_A's snapshot was created.", tx: 'A', action: 'WRITE_FAIL', value: 30 },
    { step: 8, desc: "T_A is aborted to maintain data consistency. It must be retried.", tx: 'A', action: 'ABORT' },
];

export const MvccVisualizer: React.FC = () => {
    const [step, setStep] = useState(0);

    const handleNext = () => setStep(prev => (prev + 1) % scenario.length);
    const handleReset = () => setStep(0);

    const currentStep = scenario[step];
    
    const getTxState = (tx: 'A' | 'B') => {
        const relevantSteps = scenario.slice(0, step + 1).filter(s => s.tx === tx);
        if (relevantSteps.length === 0) return { status: 'Idle', reads: null, writes: null };
        const lastAction = relevantSteps[relevantSteps.length-1].action;
        
        const reads = relevantSteps.filter(s => s.action === 'READ' || s.action === 'READ_AGAIN').map(s => s.value).join(', ');

        switch (lastAction) {
            case 'START': return { status: 'Active (Snapshot created)', reads: null, writes: null };
            case 'READ':
            case 'READ_AGAIN': return { status: 'Active', reads, writes: null };
            case 'WRITE_COMMIT': return { status: 'Committed', reads, writes: 'x = 20' };
            case 'WRITE_FAIL': return { status: 'Conflict Detected', reads, writes: 'Tries x = 30' };
            case 'ABORT': return { status: 'Aborted', reads, writes: 'Tries x = 30' };
            default: return { status: 'Idle', reads: null, writes: null };
        }
    };

    const getDataState = () => {
        const committedWrites = scenario.slice(0, step + 1).filter(s => s.action === 'WRITE_COMMIT');
        if (committedWrites.length === 0) return [{ version: 1, value: 10, by: 'Initial' }];
        
        return [
            { version: 1, value: 10, by: 'Initial' },
            ...committedWrites.map((s, i) => ({ version: i+2, value: s.value, by: `T_${s.tx}` }))
        ];
    }
    
    const txA = getTxState('A');
    const txB = getTxState('B');
    const dataVersions = getDataState();

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Data Store */}
                <div>
                    <h4 className="font-bold text-slate-200 mb-2">Data Store (Versions of 'x')</h4>
                    <div className="space-y-2 p-2 bg-slate-800 rounded-md min-h-[120px]">
                        {dataVersions.map(v => (
                            <div key={v.version} className="bg-slate-700 p-1 rounded">
                                <span className="font-mono text-sky-400">v{v.version}: {v.value}</span>
                                <span className="text-xs text-slate-400"> (by {v.by})</span>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Transaction A */}
                <div>
                    <h4 className="font-bold text-slate-200 mb-2">Transaction A</h4>
                    <div className="space-y-1 p-2 bg-slate-800 rounded-md min-h-[120px]">
                        <p>Status: <span className="font-semibold text-amber-400">{txA.status}</span></p>
                        {txA.reads && <p>Sees: <span className="font-mono">x = {txA.reads}</span></p>}
                        {txA.writes && <p>Writes: <span className="font-mono">{txA.writes}</span></p>}
                    </div>
                </div>
                {/* Transaction B */}
                <div>
                    <h4 className="font-bold text-slate-200 mb-2">Transaction B</h4>
                    <div className="space-y-1 p-2 bg-slate-800 rounded-md min-h-[120px]">
                        <p>Status: <span className="font-semibold text-green-400">{txB.status}</span></p>
                        {txB.reads && <p>Sees: <span className="font-mono">x = {txB.reads}</span></p>}
                        {txB.writes && <p>Writes: <span className="font-mono">{txB.writes}</span></p>}
                    </div>
                </div>
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-md">
                <p className="font-semibold">Step {step}: <span className="text-slate-300 font-normal">{currentStep.desc}</span></p>
            </div>
            <div className="mt-4 flex gap-4 justify-center">
                 <button onClick={handleNext} className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-500">
                    {step === scenario.length - 1 ? 'Restart' : 'Next Step'}
                </button>
                {step > 0 && (
                    <button onClick={handleReset} className="bg-slate-600 text-slate-200 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-500">
                        Reset
                    </button>
                )}
            </div>
        </div>
    )
}
