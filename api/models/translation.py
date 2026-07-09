from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TranslationRequest(BaseModel):
    """Schema for incoming translation requests."""
    text: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="Texto a traducir",
        examples=["Buenos días, ¿cómo estás?"]
    )
    source_lang: str = Field(
        ...,
        description="Código del idioma de origen (es, qu, ay)",
        examples=["es"]
    )
    target_lang: str = Field(
        ...,
        description="Código del idioma de destino (es, qu, ay)",
        examples=["qu"]
    )


class TranslationResponse(BaseModel):
    """Schema for successful translation responses."""
    success: bool = True
    data: dict


class TranslationRecord(BaseModel):
    """Schema for a translation record stored in MongoDB."""
    userId: Optional[str] = None
    sourceText: str
    translatedText: str
    sourceLanguage: str
    targetLanguage: str
    mode: str = "text"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
