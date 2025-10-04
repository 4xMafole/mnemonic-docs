import React, { useState, useEffect } from 'react';

const traditionalSteps = [
  { text: 'Start Query...', codeLine: 0 },
  { text: 'Find "Alice" in the Employees table...', codeLine: 3, table: 'employees', row: 0 },
  { text: 'Use Employee ID to find her assignments...', codeLine: 4, table: 'assignments', row: 0 },
  { text: 'Use Project ID to find the project name...', codeLine: 5, table: 'projects', row: 0 },
  { text: 'Use Project ID again to find all assignments...', codeLine: 6, table: 'assignments', row: 1 },
  { text: 'Use Employee IDs from assignments to find colleagues...', codeLine: 7, table: 'employees', row: 1 },
  { text: 'Query Complete.', codeLine: 8 },
];

const mnemonicSteps = [
    { text: 'Start Traversal...', codeLine: 0 },
    { text: 'Find "Alice" concept...', codeLine: 1, element: 'n1' },
    { text: 'Traverse "works_on" relationship...', codeLine: 1, element: 'e1' },
    { text: 'Arrive at "Project X" concept...', codeLine: 1, element: 'n3' },
    { text: 'Traverse back along "works_on" relationships...', codeLine: 2, element: 'e2' },
    { text: 'Arrive at colleague "Bob"...', codeLine: 2, element: 'n2' },
    { text: 'Traversal Complete.', codeLine: 3 },
];

const traditionalSQL = `
SELECT
  colleague.name,
  project.name
FROM Employees AS employee
JOIN Assignments AS assignment
  ON employee.id = assignment.employee_id
JOIN Projects AS project
  ON assignment.project_id = project.id
JOIN Assignments AS colleague_assignment
  ON project.id = colleague_assignment.project_id
JOIN Employees AS colleague
  ON colleague_assignment.employee_id = colleague.id
WHERE employee.name = 'Alice'
  AND colleague.name != 'Alice';
`.trim().split('\n');

const mnemonicQuery = `
RETRIEVE (
  ("Alice", "works_on", ?project),
  (?colleague, "works_on", ?project)
)
`.trim().split('\n');


export const ParadigmVisualizer: React.FC = () => {
    const [view, setView] = useState<'idle' | 'traditional' | 'mnemonic'>('idle');
    const [traditionalStep, setTraditionalStep] = useState(0);
    const [mnemonicStep, setMnemonicStep] = useState(0);

    useEffect(() => {
        let interval: number;
        if (view === 'traditional') {
            setTraditionalStep(0);
            interval = window.setInterval(() => {
                setTraditionalStep(prev => (prev + 1) % (traditionalSteps.length));
            }, 1800);
        }
        if (view === 'mnemonic') {
            setMnemonicStep(0);
            interval = window.setInterval(() => {
                setMnemonicStep(prev => (prev + 1) % (mnemonicSteps.length));
            }, 1800);
        }
        return () => clearInterval(interval);
    }, [view]);

    const currentTradStep = traditionalSteps[traditionalStep];
    const currentMnemStep = mnemonicSteps[mnemonicStep];

    const CodeDisplay: React.FC<{ lines: string[], highlightLine: number }> = ({ lines, highlightLine }) => (
        <pre className="bg-slate-800/80 p-3 rounded-md text-xs font-mono text-slate-400 mt-4 h-48 overflow-auto">
            {lines.map((line, i) => (
                <div key={i} className={`transition-all duration-300 ${highlightLine === i + 1 ? 'bg-sky-500/20 text-sky-300' : ''}`}>
                    {line}
                </div>
            ))}
        </pre>
    );

    return (
        <div className="my-8 w-full p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-200">The Paradigm Shift: A Visual Comparison</h3>
                <p className="text-sm text-slate-400 mt-1">Task: "Retrieve Alice's projects and her colleagues."</p>
            </div>

            {view === 'idle' && (
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button onClick={() => setView('traditional')} className="flex-1 bg-rose-600/20 border border-rose-500/50 text-rose-300 px-4 py-3 rounded-md font-semibold hover:bg-rose-600/40 transition-colors">Show Traditional Approach</button>
                    <button onClick={() => setView('mnemonic')} className="flex-1 bg-sky-600/20 border border-sky-500/50 text-sky-300 px-4 py-3 rounded-md font-semibold hover:bg-sky-600/40 transition-colors">Show Mnemonic Approach</button>
                </div>
            )}
            
            {view !== 'idle' && (
                 <div className="w-full text-center mb-4">
                    <button onClick={() => setView('idle')} className="text-xs text-slate-400 hover:text-white">← Back to selection</button>
                </div>
            )}

            {view === 'traditional' && (
                <div className="animate-fade-in">
                    <div className="w-full h-64 bg-slate-800/50 rounded-lg p-2 relative">
                        {/* Silos */}
                        <div className="absolute top-4 left-4 w-28 h-56 bg-slate-700/50 rounded p-1">
                            <h4 className="text-xs text-center font-bold text-slate-300">Employees</h4>
                            <div className={`mt-1 p-1 rounded text-xs transition-all duration-300 ${currentTradStep.table === 'employees' && currentTradStep.row === 0 ? 'bg-sky-500/30' : ''}`}>Alice</div>
                            <div className={`mt-1 p-1 rounded text-xs transition-all duration-300 ${currentTradStep.table === 'employees' && currentTradStep.row === 1 ? 'bg-sky-500/30' : ''}`}>Bob</div>
                        </div>
                         <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-56 bg-slate-700/50 rounded p-1">
                            <h4 className="text-xs text-center font-bold text-slate-300">Assignments</h4>
                            <div className={`mt-1 p-1 rounded text-xs transition-all duration-300 ${currentTradStep.table === 'assignments' && currentTradStep.row === 0 ? 'bg-sky-500/30' : ''}`}>Alice → Proj X</div>
                            <div className={`mt-1 p-1 rounded text-xs transition-all duration-300 ${currentTradStep.table === 'assignments' && currentTradStep.row === 1 ? 'bg-sky-500/30' : ''}`}>Bob → Proj X</div>
                        </div>
                         <div className="absolute top-4 right-4 w-28 h-56 bg-slate-700/50 rounded p-1">
                            <h4 className="text-xs text-center font-bold text-slate-300">Projects</h4>
                            <div className={`mt-1 p-1 rounded text-xs transition-all duration-300 ${currentTradStep.table === 'projects' && currentTradStep.row === 0 ? 'bg-sky-500/30' : ''}`}>Project X</div>
                        </div>
                    </div>
                    <p className="text-center text-sm text-slate-300 font-semibold mt-2 min-h-[20px]">{currentTradStep.text}</p>
                    <CodeDisplay lines={traditionalSQL} highlightLine={currentTradStep.codeLine} />
                </div>
            )}

             {view === 'mnemonic' && (
                 <div className="animate-fade-in">
                    <div className="w-full h-64 bg-slate-800/50 rounded-lg p-2 relative">
                        <svg width="100%" height="100%" viewBox="0 0 300 150">
                            {/* Edges */}
                            <path id="e1_path" d="M 65 75 C 100 50, 150 50, 150 75" strokeWidth="2" fill="none" className={`transition-all duration-300 ${currentMnemStep.element === 'e1' ? 'stroke-sky-400' : 'stroke-slate-600'}`} />
                            <path id="e2_path" d="M 235 75 C 200 100, 150 100, 150 75" strokeWidth="2" fill="none" className={`transition-all duration-300 ${currentMnemStep.element === 'e2' ? 'stroke-sky-400' : 'stroke-slate-600'}`} />

                            {/* Nodes */}
                            <g>
                                <circle cx="50" cy="75" r="15" className={`transition-all duration-300 ${currentMnemStep.element === 'n1' ? 'fill-sky-400' : 'fill-slate-700'}`} />
                                <text x="50" y="100" textAnchor="middle" fontSize="10" className="fill-slate-300">Alice</text>
                            </g>
                             <g>
                                <circle cx="250" cy="75" r="15" className={`transition-all duration-300 ${currentMnemStep.element === 'n2' ? 'fill-sky-400' : 'fill-slate-700'}`} />
                                <text x="250" y="100" textAnchor="middle" fontSize="10" className="fill-slate-300">Bob</text>
                            </g>
                             <g>
                                <circle cx="150" cy="75" r="15" className={`transition-all duration-300 ${currentMnemStep.element === 'n3' ? 'fill-sky-400' : 'fill-slate-700'}`} />
                                <text x="150" y="100" textAnchor="middle" fontSize="10" className="fill-slate-300">Project X</text>
                            </g>
                        </svg>
                    </div>
                     <p className="text-center text-sm text-slate-300 font-semibold mt-2 min-h-[20px]">{currentMnemStep.text}</p>
                    <CodeDisplay lines={mnemonicQuery} highlightLine={currentMnemStep.codeLine} />
                </div>
            )}
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};
