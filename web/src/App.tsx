import { useState } from 'react';
import Navbar from './components/Navbar';
import TranslationPage from './pages/TranslationPage';
import HistoryPage from './pages/HistoryPage';
import AdminStatsPage from './pages/AdminStatsPage';

function App() {
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'stats'>('translate');
  const [sourceLang, setSourceLang] = useState<'es' | 'qu' | 'ay'>('es');
  const [targetLang, setTargetLang] = useState<'es' | 'qu' | 'ay'>('qu');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  return (
    <div className="min-h-screen bg-obsidian text-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'translate' && (
          <TranslationPage
            sourceLang={sourceLang}
            setSourceLang={setSourceLang}
            targetLang={targetLang}
            setTargetLang={setTargetLang}
            sourceText={sourceText}
            setSourceText={setSourceText}
            translatedText={translatedText}
            setTranslatedText={setTranslatedText}
          />
        )}
        {activeTab === 'history' && (
          <HistoryPage
            onSelectRecord={(srcText, transText, srcLang, tgtLang) => {
              setSourceText(srcText);
              setTranslatedText(transText);
              setSourceLang(srcLang);
              setTargetLang(tgtLang);
              setActiveTab('translate');
            }}
          />
        )}
        {activeTab === 'stats' && <AdminStatsPage />}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-gray-800 text-xs text-gray-500">
        RunaTranslate © {new Date().getFullYear()} — Diseñado para la preservación de lenguas regionales
      </footer>
    </div>
  );
}

export default App;
