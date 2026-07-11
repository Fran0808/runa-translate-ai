/**
 * Service that handles client-side TTS (Text-to-Speech) using the native Web Speech API.
 */
export function speakText(text: string, lang: 'es' | 'qu' | 'ay'): void {
  if (!text) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  

  utterance.lang = lang === 'es' ? 'es-ES' : 'es-PE';
  
  window.speechSynthesis.speak(utterance);
}
