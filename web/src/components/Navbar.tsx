import { Languages, History, BarChart3, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'translate' | 'history' | 'stats';
  setActiveTab: (tab: 'translate' | 'history' | 'stats') => void;
  onLoginClick: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onLoginClick }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-obsidian/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <div className="bg-brand-teal/10 p-2 rounded-xl border border-brand-teal/30">
            <Languages className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-wide">
              Runa<span className="text-brand-teal">Translate</span>
            </span>
            <span className="hidden xs:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-md">
              Beta
            </span>
          </div>
        </div>

        {/* Navigation Items and User Status */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center bg-gray-900/60 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('translate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-250 cursor-pointer ${
                activeTab === 'translate'
                  ? 'bg-brand-teal text-obsidian shadow-lg shadow-brand-teal/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Languages className="w-4 h-4" />
              Traductor
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-250 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-brand-teal text-obsidian shadow-lg shadow-brand-teal/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <History className="w-4 h-4" />
              Historial
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-250 cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-brand-teal text-obsidian shadow-lg shadow-brand-teal/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Estadísticas
            </button>
          </div>

          {/* User Session */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3 bg-gray-900/60 border border-gray-800 rounded-xl px-3 py-1.5">
                <div className="bg-brand-teal/10 p-1.5 rounded-lg border border-brand-teal/20 text-brand-teal flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="hidden xs:flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                  <span className="text-[9px] text-gray-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-teal/10 border border-brand-teal/25 text-brand-teal hover:bg-brand-teal hover:text-obsidian transition-colors text-sm font-semibold cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
