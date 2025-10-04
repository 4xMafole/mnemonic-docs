import React, { useState } from 'react';

const scenario = [
    {
        step: 0,
        desc: "Start: The system is ready to execute the query `RETRIEVE((?person, \"friend\", ?friend))`.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: {},
        kappa: ['RETRIEVE(...)'],
    },
    {
        step: 1,
        desc: "The `RETRIEVE` operation is pushed onto the stack. The engine begins by finding the first pattern `(?person, \"friend\", ?friend)`.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: {},
        kappa: ['MATCH((?person, "friend", ?friend))'],
    },
    {
        step: 2,
        desc: "The engine finds a match for the pattern: `(A, \"friend\", B)`. It binds `?person` to `A` and `?friend` to `B`.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: { '?person': 'A', '?friend': 'B' },
        kappa: ['YIELD(1)'],
    },
     {
        step: 3,
        desc: "The first result is yielded. The engine backtracks to find more matches.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: {},
        kappa: ['MATCH((?person, \"friend\", ?friend))'],
    },
    {
        step: 4,
        desc: "The engine finds another match: `(B, \"friend\", C)`. It binds `?person` to `B` and `?friend` to `C`.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: { '?person': 'B', '?friend': 'C' },
        kappa: ['YIELD(2)'],
    },
    {
        step: 5,
        desc: "The second result is yielded. The engine backtracks again but finds no more matches.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: {},
        kappa: ['MATCH((?person, \"friend\", ?friend))'],
    },
    {
        step: 6,
        desc: "The `MATCH` operation completes. The stack is now empty.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: {},
        kappa: [],
    },
    {
        step: 7,
        desc: "Execution finished. Two results were found.",
        G: { nodes: ['A', 'B', 'C'], edges: ['A-B', 'B-C'] },
        sigma: {},
        kappa: [],
    }
];

const StateBox: React.FC<{ title: string; content: any; color: string }> = ({ title, content, color }) => (
    <div>
        <h4 className={`font-bold mb-2 text-center text-${color}-400`}>{title}</h4>
        <div className="p-3 bg-slate-800 rounded-md min-h-[100px] text-xs font-mono">
            <pre className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>
        </div>
    </div>
);

export const SemanticsVisualizer: React.FC = () => {
    const [step, setStep] = useState(0);
    const currentStep = scenario[step];

    const handleNext = () => setStep(prev => (prev + 1) % scenario.length);
    const handleReset = () => setStep(0);

    return (
         <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StateBox title="G (Graph State)" content={currentStep.G} color="sky" />
                <StateBox title="σ (Variable Bindings)" content={currentStep.sigma} color="amber" />
                <StateBox title="κ (Continuation Stack)" content={currentStep.kappa} color="green" />
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