
import React, { useState } from 'react';
import { AppMode } from './types';
import Header from './components/Header';
import NlToCpcConverter from './components/NlToCpcConverter';
import CpcToNlConverter from './components/CpcToNlConverter';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.NL_TO_CPC);

  return (
    <div className="min-h-screen bg-brand-primary font-sans text-brand-text">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header currentMode={mode} onModeChange={setMode} />
        <main className="mt-8">
          {mode === AppMode.NL_TO_CPC ? (
            <NlToCpcConverter />
          ) : (
            <CpcToNlConverter />
          )}
        </main>
        <footer className="text-center mt-12 text-sm text-brand-subtle">
          <p>Desenvolvido com React, Tailwind CSS e Google Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
