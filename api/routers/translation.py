from fastapi import APIRouter, HTTPException
from datetime import datetime

from models.translation import TranslationRequest, TranslationResponse, TranslationRecord
from services.translation_service import translation_service
from core.database import get_db

router = APIRouter(prefix="/api/v1", tags=["Traducción"])


@router.post(
    "/translate",
    response_model=TranslationResponse,
    summary="Traducir texto",
    description="Traduce un texto entre Español (es), Quechua (qu) y Aimara (ay) usando el modelo local Meta NLLB-200."
)
def translate_text(request: TranslationRequest):
    """
    Translates text between Spanish, Quechua, and Aymara.

    - **text**: The input text to translate (max 1000 characters).
    - **source_lang**: Source language code: `es` (Español), `qu` (Quechua), `ay` (Aimara).
    - **target_lang**: Target language code: `es` (Español), `qu` (Quechua), `ay` (Aimara).
    """
    try:
        draft_text = translation_service.translate(
            text=request.text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )
        # Apply Gemini context correction if online/configured
        translated_text, context_corrected = translation_service.refine_translation(
            text=request.text,
            draft=draft_text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail={"success": False, "error": str(e)})
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail={"success": False, "error": str(e)})
    except Exception:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Error interno del servidor al traducir."})

    # Save translation record to MongoDB if the database is available
    db = get_db()
    if db is not None:
        try:
            record = TranslationRecord(
                sourceText=request.text,
                translatedText=translated_text,
                sourceLanguage=request.source_lang,
                targetLanguage=request.target_lang,
                mode="text",
                context_corrected=context_corrected,
                timestamp=datetime.utcnow(),
            )
            db["translations"].insert_one(record.model_dump())
        except Exception:
            pass

    return TranslationResponse(
        success=True,
        data={
            "original_text": request.text,
            "translated_text": translated_text,
            "source_lang": request.source_lang,
            "target_lang": request.target_lang,
            "context_corrected": context_corrected,
        }
    )
