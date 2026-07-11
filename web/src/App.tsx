import { useState } from 'react';
import Navbar from './components/Navbar';
import TranslationPage from './pages/TranslationPage';
import HistoryPage from './pages/HistoryPage';
import AdminStatsPage from './pages/AdminStatsPage';

function App() {
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'stats'>('translate');

  return (
    <div className="min-h-screen bg-obsidian text-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'translate' && <TranslationPage />}
        {activeTab === 'history' && <HistoryPage />}
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
