from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class HistoryRecord(BaseModel):
    """Schema for a history record returned to the client."""
    id: Optional[str] = None
    sourceText: str
    translatedText: str
    sourceLanguage: str
    targetLanguage: str
    mode: str
    timestamp: datetime
