import { useState } from 'react';
import { ArrowLeftRight, Copy, Volume2, Trash2, Check, Loader2 } from 'lucide-react';
import { translateText } from '../services/api';
import type { LangCode } from '../services/api';
import { speakText } from '../services/speech';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'qu', label: 'Quechua' },
  { code: 'ay', label: 'Aimara' },
];

const CHAR_LIMIT = 1000;

interface TranslationPageProps {
  sourceLang: LangCode;
  setSourceLang: (lang: LangCode) => void;
  targetLang: LangCode;
  setTargetLang: (lang: LangCode) => void;
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  setTranslatedText: (text: string) => void;
}

export default function TranslationPage({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  sourceText,
  setSourceText,
  translatedText,
  setTranslatedText,
}: TranslationPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || isLoading) return;
    setIsLoading(true);
    setError('');
    setTranslatedText('');
    try {
      const translated = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(translated);
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor. Asegúrate de que el backend esté activo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    speakText(translatedText, targetLang);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-10 flex-1 flex flex-col items-center justify-center">
      
      <div className="text-center max-w-2xl mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-3">
          Traductor Inteligente de Lenguas Regionales
        </h2>
        <p className="text-gray-400 text-lg">
          Preservando el Quechua y Aimara a través de Inteligencia Artificial.
        </p>
      </div>
      
      <div className="w-full flex items-center justify-between gap-4 mb-4">
        <select
          value={sourceLang}
          onChange={e => setSourceLang(e.target.value as LangCode)}
          className="bg-dark-panel border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none focus:border-brand-teal"
        >
          {LANGUAGES.filter(l => l.code !== targetLang).map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        <button
          onClick={handleSwap}
          title="Intercambiar idiomas"
          className="p-2.5 rounded-xl bg-dark-panel border border-gray-700 text-gray-400 hover:text-brand-teal hover:border-brand-teal transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        <select
          value={targetLang}
          onChange={e => setTargetLang(e.target.value as LangCode)}
          className="bg-dark-panel border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none focus:border-brand-teal"
        >
          {LANGUAGES.filter(l => l.code !== sourceLang).map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

        <div className="bg-dark-panel/40 border border-gray-800 rounded-2xl p-6 flex flex-col min-h-70">
          <div className="flex justify-between items-center mb-4 border-b border-gray-800/50 pb-3">
            <span className="text-brand-teal font-semibold text-sm">Texto original</span>
            <span className="text-xs text-gray-500">{sourceText.length}/{CHAR_LIMIT}</span>
          </div>
          <textarea
            value={sourceText}
            onChange={e => {
              if (e.target.value.length <= CHAR_LIMIT) setSourceText(e.target.value);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleTranslate();
            }}
            placeholder="Escribe o pega el texto aquí..."
            className="w-full flex-1 bg-transparent border-0 resize-none text-gray-200 placeholder-gray-600 focus:ring-0 focus:outline-none text-base leading-relaxed"
          />
          {sourceText && (
            <button
              onClick={() => setSourceText('')}
              className="self-start mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>
        
        <div className="bg-dark-panel/40 border border-gray-800 rounded-2xl p-6 flex flex-col min-h-70">
          <div className="flex justify-between items-center mb-4 border-b border-gray-800/50 pb-3">
            <span className="text-brand-teal font-semibold text-sm">Traducción</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeak}
                disabled={!translatedText}
                title="Escuchar"
                className="text-gray-500 hover:text-brand-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!translatedText}
                title="Copiar"
                className="text-gray-500 hover:text-brand-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-brand-teal" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                Traduciendo con NLLB-200…
              </div>
            ) : error ? (
              <p className="text-yellow-500/80 text-sm">{error}</p>
            ) : translatedText ? (
              <p className="text-gray-200 text-base leading-relaxed">{translatedText}</p>
            ) : (
              <p className="text-gray-600 text-sm italic">La traducción aparecerá aquí...</p>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={handleTranslate}
        disabled={!sourceText.trim() || isLoading}
        className="w-full max-w-md py-3.5 rounded-2xl bg-brand-teal text-obsidian font-bold text-sm tracking-wide hover:bg-teal-400 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Traduciendo...' : 'Traducir'}
      </button>

      <p className="mt-3 text-xs text-gray-600">Ctrl + Enter para traducir</p>
    </div>
  );
}
