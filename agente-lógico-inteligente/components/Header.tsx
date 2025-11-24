
import React from 'react';
import { AppMode } from '../types';
import { ArrowRightLeftIcon, MessageSquareTextIcon } from './icons';

interface HeaderProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange }) => {
  const getButtonClass = (mode: AppMode) => {
    const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary";
    if (currentMode === mode) {
      return `${baseClass} bg-brand-accent text-brand-primary`;
    }
    return `${baseClass} bg-brand-secondary text-brand-text hover:bg-slate-600`;
  };

  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-blue-500">
        Agente Lógico Inteligente
      </h1>
      <p className="mt-4 text-lg text-brand-subtle">
        Converta entre Linguagem Natural e Lógica Proposicional com IA.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => onModeChange(AppMode.NL_TO_CPC)}
          className={getButtonClass(AppMode.NL_TO_CPC)}
        >
          <MessageSquareTextIcon className="w-5 h-5" />
          <span>Linguagem Natural → Lógica</span>
        </button>
        <button
          onClick={() => onModeChange(AppMode.CPC_TO_NL)}
          className={getButtonClass(AppMode.CPC_TO_NL)}
        >
          <ArrowRightLeftIcon className="w-5 h-5" />
          <span>Lógica → Linguagem Natural</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
