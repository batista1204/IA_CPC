
import React, { useState } from 'react';
import { convertCpcToNl } from '../services/geminiService';
import { CpcToNlResult } from '../types';
import Spinner from './Spinner';
import Card from './Card';
import PropositionEditor from './PropositionEditor';
import { SparklesIcon } from './icons';

const CpcToNlConverter: React.FC = () => {
  const [formula, setFormula] = useState<string>('');
  const [propositions, setPropositions] = useState<Record<string, string>>({});
  const [autoGenerate, setAutoGenerate] = useState<boolean>(true);
  const [result, setResult] = useState<CpcToNlResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formula.trim()) {
      setError('Por favor, insira uma fórmula.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await convertCpcToNl(formula, autoGenerate ? undefined : propositions);
      setResult(apiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-brand-accent mb-4">1. Insira a Fórmula</h2>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Ex: (P ∧ Q) → R"
              className="w-full p-3 bg-brand-primary border-2 border-brand-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent transition font-mono"
              disabled={isLoading}
            />
            <p className="text-sm mt-2 text-brand-subtle">Use os símbolos: ∧ (e), ∨ (ou), ¬ (não), → (implica), ↔ (se e somente se)</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-brand-accent mb-4">2. Defina os Significados</h2>
            <div className="flex items-center gap-3 bg-brand-primary p-3 rounded-lg border-2 border-brand-secondary">
              <input
                type="checkbox"
                id="auto-generate"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="h-5 w-5 rounded bg-brand-secondary border-brand-subtle text-brand-accent focus:ring-brand-accent"
              />
              <label htmlFor="auto-generate" className="font-medium">
                Gerar significados automaticamente com IA
              </label>
            </div>
          </div>
          
          {!autoGenerate && (
            <PropositionEditor
              formula={formula}
              propositions={propositions}
              onPropositionsChange={setPropositions}
              disabled={isLoading}
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-sky-400 transition-colors duration-300 disabled:bg-brand-secondary disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5" />}
            <span>Converter</span>
          </button>
        </form>
      </Card>

      {error && (
        <Card>
          <p className="text-red-400 text-center">{error}</p>
        </Card>
      )}

      {result && (
        <Card>
          <h2 className="text-xl font-semibold text-brand-accent mb-4">3. Resultado da Conversão</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-brand-subtle">Frase Gerada</h3>
              <p className="mt-1 p-4 bg-brand-primary rounded-lg text-lg italic">
                "{result.sentence}"
              </p>
            </div>
             <div>
              <h3 className="font-semibold text-brand-subtle">Legenda Utilizada</h3>
              <ul className="mt-2 space-y-2">
                {result.propositions.map((prop) => (
                  <li key={prop.variable} className="flex items-center gap-4 p-3 bg-brand-primary rounded-lg">
                    <span className="font-mono font-bold text-brand-accent text-lg w-8 text-center">{prop.variable}</span>
                    <span className="text-brand-text">=</span>
                    <span className="italic">"{prop.meaning}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CpcToNlConverter;
