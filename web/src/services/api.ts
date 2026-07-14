const API_URL = 'http://localhost:8000';

export type LangCode = 'es' | 'qu' | 'ay';

export type TranslationRecord = {
  sourceText: string;
  translatedText: string;
  sourceLanguage: LangCode;
  targetLanguage: LangCode;
  mode: string;
  context_corrected?: boolean;
  timestamp: string;
};

export type LanguageStat = {
  _id: {
    source: string;
    target: string;
  };
  count: number;
};

export type ModeStat = {
  _id: string;
  count: number;
};

export type StatsData = {
  total_translations: number;
  by_language: LanguageStat[];
  by_mode: ModeStat[];
};

export type TranslationResponseData = {
  translatedText: string;
  contextCorrected: boolean;
};

/**
 * Sends a text translation request to the backend.
 */
export async function translateText(
  text: string,
  sourceLang: LangCode,
  targetLang: LangCode
): Promise<TranslationResponseData> {
  const res = await fetch(`${API_URL}/api/v1/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!res.ok) {
    throw new Error('Error en la respuesta del servidor');
  }

  const data = await res.json();
  if (data.success) {
    return {
      translatedText: data.data.translated_text,
      contextCorrected: data.data.context_corrected || false,
    };
  } else {
    throw new Error(data.error || 'Error al traducir');
  }
}

/**
 * Fetches the list of the last 50 translations.
 */
export async function getHistory(): Promise<TranslationRecord[]> {
  const res = await fetch(`${API_URL}/api/v1/history`);
  if (!res.ok) {
    throw new Error('Error al conectar con el servidor de historial');
  }

  const data = await res.json();
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.error || 'Error al obtener el historial');
  }
}

/**
 * Fetches usage statistics for the admin dashboard.
 */
export async function getAdminStats(): Promise<StatsData> {
  const res = await fetch(`${API_URL}/api/v1/admin/stats`);
  if (!res.ok) {
    throw new Error('Error al conectar con el servidor de estadísticas');
  }

  const data = await res.json();
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.error || 'Error al obtener las estadísticas');
  }
}

