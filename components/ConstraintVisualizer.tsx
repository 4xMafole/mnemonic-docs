import React, { useState, useMemo } from 'react';

const allRelations = [
    { id: 'name', type: 'String', arity: '1..1' },
    { id: 'age', type: 'Integer', arity: '1..1' },
    { id: 'friend', type: 'Person', arity: '0..N' },
    { id: 'employer', type: 'Company', arity: '0..1' },
];

export const ConstraintVisualizer: React.FC = () => {
    const [required, setRequired] = useState(['name', 'age']);
    const [optional, setOptional] = useState(['friend']);

    const handleToggle = (set: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
        set(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };
    
    const liveInstance = useMemo(() => {
        const instance: { [key: string]: any } = {};
        allRelations.forEach(rel => {
            if (required.includes(rel.id)) {
                if(rel.id === 'name') instance.name = '"Alice"';
                else if (rel.id === 'age') instance.age = 30;
                else instance[rel.id] = `... (${rel.type})`;
            } else if (optional.includes(rel.id)) {
                 instance[rel.id] = `... (${rel.type}, optional)`;
            }
        });
        return instance;
    }, [required, optional]);

    const RelationToggle: React.FC<{ rel: typeof allRelations[0], isRequired: boolean, isOptional: boolean }> = ({ rel, isRequired, isOptional }) => (
        <div className="flex items-center justify-between p-2 bg-slate-800 rounded-md">
            <code className="text-xs text-slate-300">{rel.id}: ({rel.type}, {rel.arity})</code>
            <div className="flex gap-2">
                 <button onClick={() => handleToggle(setRequired, rel.id)} className={`px-2 py-1 text-xs rounded ${isRequired ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Required</button>
                 <button onClick={() => handleToggle(setOptional, rel.id)} className={`px-2 py-1 text-xs rounded ${isOptional ? 'bg-amber-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>Optional</button>
            </div>
        </div>
    );

    return (
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            {/* Left side: Controls */}
            <div>
                <h3 className="font-bold text-slate-200 mb-2">1. Define Type Constraints for "Person"</h3>
                <div className="space-y-2">
                    {allRelations.map(rel => (
                        <RelationToggle key={rel.id} rel={rel} isRequired={required.includes(rel.id)} isOptional={optional.includes(rel.id)} />
                    ))}
                </div>
            </div>
            {/* Right side: Live Preview */}
            <div>
                 <h3 className="font-bold text-slate-200 mb-2">2. Live Preview of a Valid Instance</h3>
                 <div className="p-3 bg-slate-800 rounded-md min-h-[150px] font-mono text-xs text-sky-300">
                    <p className="text-slate-400">// A concept that satisfies the constraints:</p>
                    <p>Person_Instance {"{"}</p>
                    <div className="pl-4">
                        {Object.entries(liveInstance).map(([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                        ))}
                    </div>
                    <p>{"}"}</p>
                 </div>
            </div>
        </div>
    );
};