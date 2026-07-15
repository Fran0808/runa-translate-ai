import { useState } from 'react';
import Navbar from './components/Navbar';
import TranslationPage from './pages/TranslationPage';
import HistoryPage from './pages/HistoryPage';
import AdminStatsPage from './pages/AdminStatsPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Lock, LogIn } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'stats'>('translate');
  const [sourceLang, setSourceLang] = useState<'es' | 'qu' | 'ay'>('es');
  const [targetLang, setTargetLang] = useState<'es' | 'qu' | 'ay'>('qu');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [contextCorrected, setContextCorrected] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian text-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLoginClick={() => setShowLogin(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {showLogin ? (
          <LoginPage onBackToApp={() => setShowLogin(false)} />
        ) : (
          <>
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
                contextCorrected={contextCorrected}
                setContextCorrected={setContextCorrected}
              />
            )}
            
            {activeTab === 'history' && (
              user ? (
                <HistoryPage
                  onSelectRecord={(srcText, transText, srcLang, tgtLang, isCorrected) => {
                    setSourceText(srcText);
                    setTranslatedText(transText);
                    setSourceLang(srcLang);
                    setTargetLang(tgtLang);
                    setContextCorrected(isCorrected);
                    setActiveTab('translate');
                  }}
                />
              ) : (
                <div className="max-w-md w-full mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="bg-brand-teal/10 p-4 rounded-full border border-brand-teal/20 mb-4">
                    <Lock className="w-10 h-10 text-brand-teal animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Acceso Restringido</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs">
                    Por favor, inicia sesión con tu cuenta para acceder a tu historial de traducciones personal.
                  </p>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-obsidian font-bold hover:bg-teal-400 transition-colors text-sm cursor-pointer mx-auto"
                  >
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </button>
                </div>
              )
            )}

            {activeTab === 'stats' && (
              user && user.role === 'admin' ? (
                <AdminStatsPage />
              ) : (
                <div className="max-w-md w-full mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="bg-brand-gold/10 p-4 rounded-full border border-brand-gold/20 mb-4">
                    <Lock className="w-10 h-10 text-brand-gold animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Panel Administrativo</h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs">
                    Solo los usuarios con rol de **Administrador** (correos que inicien con admin) tienen permiso para ver las estadísticas globales de uso.
                  </p>
                  {!user ? (
                    <button
                      onClick={() => setShowLogin(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal text-obsidian font-bold hover:bg-teal-400 transition-colors text-sm cursor-pointer mx-auto"
                    >
                      <LogIn className="w-4 h-4" />
                      Iniciar Sesión como Admin
                    </button>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Conectado como {user.name} ({user.role}). Cierra sesión e ingresa como administrador para ver estadísticas.
                    </p>
                  )}
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-gray-800 text-xs text-gray-500">
        RunaTranslate © {new Date().getFullYear()} — Diseñado para la preservación de lenguas regionales
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
