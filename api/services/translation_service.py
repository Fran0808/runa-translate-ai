from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

LANGUAGE_CODES = {
    "es": "spa_Latn",
    "qu": "quy_Latn",
    "ay": "ayr_Latn",
}

MODEL_NAME = "facebook/nllb-200-distilled-600M"


class TranslationService:
    """
    Singleton service that loads the NLLB-200 model once into RAM
    and provides a translate method for all subsequent requests.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def initialize(self):
        """Load the model and tokenizer into memory. Called once at server startup."""
        if self._initialized:
            return

        print(f"[*] Cargando modelo NLLB-200 en memoria RAM ({MODEL_NAME})...")
        self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
        self._initialized = True
        print("[+] Modelo NLLB-200 cargado y listo para traducir.")

    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translate a text string from source_lang to target_lang.

        Args:
            text: The input text to translate.
            source_lang: Source language code (es, qu, ay).
            target_lang: Target language code (es, qu, ay).

        Returns:
            The translated text string.

        Raises:
            ValueError: If the language codes are not supported.
            RuntimeError: If the model has not been initialized yet.
        """
        if not self._initialized:
            raise RuntimeError("El servicio de traducción no ha sido inicializado. Llama a initialize() primero.")

        if source_lang not in LANGUAGE_CODES:
            raise ValueError(f"Idioma de origen no soportado: '{source_lang}'. Use: {list(LANGUAGE_CODES.keys())}")

        if target_lang not in LANGUAGE_CODES:
            raise ValueError(f"Idioma de destino no soportado: '{target_lang}'. Use: {list(LANGUAGE_CODES.keys())}")

        if source_lang == target_lang:
            raise ValueError("El idioma de origen y destino no pueden ser el mismo.")

        nllb_source = LANGUAGE_CODES[source_lang]
        nllb_target = LANGUAGE_CODES[target_lang]

        # Tokenize the input text with the source language
        self.tokenizer.src_lang = nllb_source
        inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)

        # Generate translated tokens
        with torch.no_grad():
            translated_tokens = self.model.generate(
                **inputs,
                forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(nllb_target),
                max_length=512,
                num_beams=4,
                early_stopping=True,
            )

        # Decode the tokens back to a string
        result = self.tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)
        return result[0]


# Global singleton instance used across the entire application
translation_service = TranslationService()
