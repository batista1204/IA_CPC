
import React, { useState } from 'react';
import { convertNlToCpc } from '../services/geminiService';
import { NlToCpcResult } from '../types';
import Spinner from './Spinner';
import Card from './Card';
import { SparklesIcon } from './icons';

const NlToCpcConverter: React.FC = () => {
  const [sentence, setSentence] = useState<string>('');
  const [result, setResult] = useState<NlToCpcResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentence.trim()) {
      setError('Por favor, insira uma frase.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiResult = await convertNlToCpc(sentence);
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
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-brand-accent mb-4">1. Insira a Frase</h2>
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Ex: Se o sol brilha e eu estou de férias, então vou à praia."
            className="w-full h-24 p-3 bg-brand-primary border-2 border-brand-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full flex justify-center items-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-sky-400 transition-colors duration-300 disabled:bg-brand-secondary disabled:cursor-not-allowed"
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
          <h2 className="text-xl font-semibold text-brand-accent mb-4">2. Resultado da Conversão</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-brand-subtle">Fórmula Lógica (CPC)</h3>
              <p className="mt-1 p-4 bg-brand-primary rounded-lg font-mono text-lg text-brand-text">
                {result.formula}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-subtle">Legenda das Proposições</h3>
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

export default NlToCpcConverter;
