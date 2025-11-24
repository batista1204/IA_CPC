
import React, { useMemo } from 'react';

interface PropositionEditorProps {
  formula: string;
  propositions: Record<string, string>;
  onPropositionsChange: (propositions: Record<string, string>) => void;
  disabled: boolean;
}

const PropositionEditor: React.FC<PropositionEditorProps> = ({ formula, propositions, onPropositionsChange, disabled }) => {
  const variables = useMemo(() => {
    const matches = formula.match(/[A-Z]/g);
    return matches ? [...new Set(matches)].sort() : [];
  }, [formula]);

  const handleChange = (variable: string, meaning: string) => {
    onPropositionsChange({
      ...propositions,
      [variable]: meaning,
    });
  };

  if (variables.length === 0) {
    return (
      <div className="text-center text-brand-subtle p-4 bg-brand-primary rounded-lg">
        <p>Digite uma fórmula para definir as proposições.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-brand-primary rounded-lg">
      <h3 className="font-semibold text-brand-subtle mb-2">Significados manuais:</h3>
      {variables.map((variable) => (
        <div key={variable} className="flex items-center gap-3">
          <label htmlFor={`prop-${variable}`} className="font-mono font-bold text-brand-accent text-lg w-8 text-center">
            {variable}
          </label>
          <input
            id={`prop-${variable}`}
            type="text"
            value={propositions[variable] || ''}
            onChange={(e) => handleChange(variable, e.target.value)}
            placeholder={`Significado de ${variable}...`}
            className="flex-grow p-2 bg-brand-secondary border-2 border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  );
};

export default PropositionEditor;
