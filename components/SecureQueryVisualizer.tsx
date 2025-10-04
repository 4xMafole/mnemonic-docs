import React, { useState } from 'react';

const roles = {
    'Admin': {
        description: 'Has full access. No constraints are added.',
        rewrite: (query: string) => query,
    },
    'Analyst': {
        description: 'Can only see data from projects they have been granted access to.',
        rewrite: (query: string) => `${query}
    Λ (?analyst, "has_access", ?project)
    Λ (?concept, "part_of", ?project)`,
    },
     'Auditor': {
        description: 'Can only see data that has been explicitly marked as "auditable".',
        rewrite: (query: string) => `${query}
    Λ (?concept, "is_auditable", true)`,
    },
};

type Role = keyof typeof roles;

export const SecureQueryVisualizer: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<Role>('Analyst');
    const [userQuery, setUserQuery] = useState('RETRIEVE((?concept, "type", "data_record"))');

    const { description, rewrite } = roles[selectedRole];
    const rewrittenQuery = rewrite(userQuery);

    return (
        <div className="my-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">1. Select User Role</label>
                <select id="role" value={selectedRole} onChange={e => setSelectedRole(e.target.value as Role)} className="block w-full md:w-1/2 pl-3 pr-10 py-2 text-base bg-slate-800 border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-slate-200">
                    {Object.keys(roles).map(r => <option key={r}>{r}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1 italic">{description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold text-slate-200 mb-2">2. User's Query</h3>
                    <div className="p-3 bg-slate-800 rounded-md font-mono text-xs text-amber-300 h-32">
                        {userQuery}
                    </div>
                </div>
                 <div>
                    <h3 className="font-bold text-slate-200 mb-2">3. System's Rewritten Query</h3>
                    <div className="p-3 bg-slate-800 rounded-md font-mono text-xs text-sky-300 h-32">
                         {rewrittenQuery}
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center text-xs text-slate-500">
                The system automatically augments the user's query with constraints based on their role, ensuring they can only access data they are permitted to see.
            </div>
        </div>
    );
};
