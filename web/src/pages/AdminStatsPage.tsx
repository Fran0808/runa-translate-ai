import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, TrendingUp, Type, Mic, Loader2 } from 'lucide-react';

type LanguageStat = {
  _id: {
    source: string;
    target: string;
  };
  count: number;
};

type ModeStat = {
  _id: string;
  count: number;
};

type StatsData = {
  total_translations: number;
  by_language: LanguageStat[];
  by_mode: ModeStat[];
};

const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  qu: 'Quechua',
  ay: 'Aimara',
};

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError('Error al obtener las estadísticas.');
      }
    } catch {
      setError('No se pudo conectar al servidor. Asegúrate de que el backend esté activo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getTextTranslationsCount = () => {
    if (!stats) return 0;
    const textStat = stats.by_mode.find(m => m._id === 'text');
    return textStat ? textStat.count : 0;
  };

  const getVoiceTranslationsCount = () => {
    if (!stats) return 0;
    const voiceStat = stats.by_mode.find(m => m._id === 'voice');
    return voiceStat ? voiceStat.count : 0;
  };

  const getLanguageLabel = (code: string) => {
    return LANG_LABELS[code] || code.toUpperCase();
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 flex-1 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Estadísticas de Uso
          </h2>
          <p className="text-gray-400">
            Métricas agregadas sobre el volumen de traducciones por idioma y modalidad.
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-panel border border-gray-700 text-gray-300 hover:text-brand-teal hover:border-brand-teal transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {isLoading ? (
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-brand-teal mb-4" />
          <p className="text-gray-400 text-sm">Cargando estadísticas...</p>
        </div>
      ) : error ? (
        <div className="w-full bg-dark-panel/20 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-yellow-500/80 text-sm text-center">{error}</p>
        </div>
      ) : !stats ? (
        <div className="w-full bg-dark-panel/20 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-gray-400 text-sm">No hay datos disponibles.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Translations */}
            <div className="bg-dark-panel/30 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-gray-400 text-sm font-semibold">Total Traducciones</span>
                <div className="p-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <span className="text-4xl font-extrabold text-white tabular-nums">
                {stats.total_translations}
              </span>
            </div>

            {/* Text Mode Translations */}
            <div className="bg-dark-panel/30 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-gray-400 text-sm font-semibold">Modo Texto</span>
                <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-lg">
                  <Type className="w-4 h-4" />
                </div>
              </div>
              <span className="text-4xl font-extrabold text-white tabular-nums">
                {getTextTranslationsCount()}
              </span>
            </div>

            {/* Voice Mode Translations */}
            <div className="bg-dark-panel/30 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-gray-400 text-sm font-semibold">Modo Voz</span>
                <div className="p-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-lg">
                  <Mic className="w-4 h-4" />
                </div>
              </div>
              <span className="text-4xl font-extrabold text-white tabular-nums">
                {getVoiceTranslationsCount()}
              </span>
            </div>
          </div>

          {/* Language Pair Distribution */}
          <div className="bg-dark-panel/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-teal" />
              Pares de Idiomas Populares
            </h3>

            {stats.by_language.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No hay datos de distribución aún.</p>
            ) : (
              <div className="space-y-5">
                {stats.by_language.map((item, index) => {
                  const maxCount = Math.max(...stats.by_language.map(l => l.count), 1);
                  const percentage = Math.round((item.count / maxCount) * 100);

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 font-semibold">
                          {getLanguageLabel(item._id.source)} ➜ {getLanguageLabel(item._id.target)}
                        </span>
                        <span className="text-brand-teal font-semibold tabular-nums">
                          {item.count} {item.count === 1 ? 'traducción' : 'traducciones'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-2">
                        <div
                          className="bg-brand-teal h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
