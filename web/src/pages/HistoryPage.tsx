import { useState, useEffect } from 'react';
import { Clock, ArrowRight, RefreshCw, Loader2, Play } from 'lucide-react';

type TranslationRecord = {
  sourceText: string;
  translatedText: string;
  sourceLanguage: 'es' | 'qu' | 'ay';
  targetLanguage: 'es' | 'qu' | 'ay';
  mode: string;
  timestamp: string;
};

interface HistoryPageProps {
  onSelectRecord: (
    sourceText: string,
    translatedText: string,
    sourceLang: 'es' | 'qu' | 'ay',
    targetLang: 'es' | 'qu' | 'ay'
  ) => void;
}

const LANG_LABELS: Record<string, string> = {
  es: 'Español',
  qu: 'Quechua',
  ay: 'Aimara',
};

export default function HistoryPage({ onSelectRecord }: HistoryPageProps) {
  const [records, setRecords] = useState<TranslationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/history');
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        setError('Error al obtener el historial.');
      }
    } catch {
      setError('No se pudo conectar al servidor. Asegúrate de que el backend esté activo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-10 flex-1 flex flex-col">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            Historial de Traducciones
          </h2>
          <p className="text-gray-400">
            Últimas consultas de traducción registradas en la base de datos de MongoDB.
          </p>
        </div>
        <button
          onClick={fetchHistory}
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
          <p className="text-gray-400 text-sm">Cargando historial...</p>
        </div>
      ) : error ? (
        <div className="w-full bg-dark-panel/20 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-yellow-500/80 text-sm text-center">{error}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="w-full bg-dark-panel/20 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
          <div className="bg-gray-900/50 p-4 rounded-full border border-gray-800 mb-4">
            <Clock className="w-10 h-10 text-brand-teal" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Sin historial reciente</h3>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Las traducciones que realices se guardarán automáticamente aquí para acceder a ellas después.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {records.map((record, index) => (
            <div
              key={index}
              className="bg-dark-panel/30 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-3">
                {/* Languages and Time */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2.5 py-1 rounded-lg font-semibold">
                    {LANG_LABELS[record.sourceLanguage] || record.sourceLanguage}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                  <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2.5 py-1 rounded-lg font-semibold">
                    {LANG_LABELS[record.targetLanguage] || record.targetLanguage}
                  </span>
                  <span className="text-gray-500 ml-auto sm:ml-2">
                    {formatTime(record.timestamp)}
                  </span>
                </div>

                {/* Texts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Original</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{record.sourceText}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Traducción</span>
                    <p className="text-gray-200 text-sm leading-relaxed">{record.translatedText}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() =>
                  onSelectRecord(
                    record.sourceText,
                    record.translatedText,
                    record.sourceLanguage,
                    record.targetLanguage
                  )
                }
                title="Cargar en el traductor"
                className="self-end sm:self-center flex items-center justify-center p-3 rounded-xl bg-brand-teal/10 border border-brand-teal/20 hover:bg-brand-teal hover:text-obsidian transition-colors text-brand-teal cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
