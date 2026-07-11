import { Languages, History, BarChart3 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'translate' | 'history' | 'stats';
  setActiveTab: (tab: 'translate' | 'history' | 'stats') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
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

        {/* Navigation Items */}
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
      </div>
    </nav>
  );
}
