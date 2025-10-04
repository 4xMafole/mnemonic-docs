import React, { useState, useEffect } from 'react';

const companies = [
    { id: 'cygnus', name: 'Cygnus Corp', min_wage: 100000 },
    { id: 'orion', name: 'Orion Syndicate', min_wage: 85000 },
];

export const DependentTypeVisualizer: React.FC = () => {
    const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id);
    const [salary, setSalary] = useState('110000');
    const [validationResult, setValidationResult] = useState<{ status: 'valid' | 'invalid'; message: string } | null>(null);

    const selectedCompany = companies.find(c => c.id === selectedCompanyId)!;
    
    useEffect(() => {
        setValidationResult(null); // Clear validation on change
    }, [selectedCompanyId, salary]);

    const handleValidate = () => {
        const salaryNum = parseInt(salary, 10);
        if (isNaN(salaryNum)) {
            setValidationResult({ status: 'invalid', message: 'Please enter a valid number for salary.' });
            return;
        }

        if (salaryNum >= selectedCompany.min_wage) {
            setValidationResult({ status: 'valid', message: `Success! ${salaryNum.toLocaleString()} is greater than or equal to ${selectedCompany.name}'s minimum wage of ${selectedCompany.min_wage.toLocaleString()}.` });
        } else {
            setValidationResult({ status: 'invalid', message: `Error: ${salaryNum.toLocaleString()} is less than ${selectedCompany.name}'s minimum wage of ${selectedCompany.min_wage.toLocaleString()}.` });
        }
    };

    const typeDefinitionCode = `
// The EmployeeType depends on the 'company' concept
EmployeeType(company: Company) := ConceptType {
  required_relationships: {
    (works_for, company, 1..1),
    (salary, Integer, 1..1)
  },
  invariants: {
    // This constraint changes based on the company
    salary ≥ company.min_wage 
  }
}`;

    return (
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 text-sm">
            {/* Left side: Type Definition */}
            <div>
                <h3 className="font-bold text-slate-200 mb-2">Dependent Type Definition</h3>
                <pre className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300 font-mono whitespace-pre-wrap">
                    <code>{typeDefinitionCode.trim()}</code>
                </pre>
            </div>
            {/* Right side: Interactive Validation */}
            <div>
                <h3 className="font-bold text-slate-200 mb-2">Interactive Validation</h3>
                <div className="space-y-4 p-3 bg-slate-800 rounded-md">
                    <div>
                        <label htmlFor="company" className="block text-xs font-medium text-slate-300">1. Select a Company</label>
                        <select id="company" value={selectedCompanyId} onChange={e => setSelectedCompanyId(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-slate-200">
                           {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                         <p className="text-xs text-slate-400 mt-1">Constraint set: <code className="text-amber-400">salary ≥ {selectedCompany.min_wage.toLocaleString()}</code></p>
                    </div>
                     <div>
                        <label htmlFor="salary" className="block text-xs font-medium text-slate-300">2. Enter Employee's Salary</label>
                         <input
                            id="salary"
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="e.g., 95000"
                            className="mt-1 block w-full pl-3 pr-3 py-2 bg-slate-700 border-slate-600 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md text-slate-200"
                        />
                    </div>
                    <button onClick={handleValidate} className="w-full bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-sky-500">Validate</button>
                    {validationResult && (
                         <div className={`p-2 rounded-md text-xs font-medium text-center ${validationResult.status === 'valid' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {validationResult.message}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};
