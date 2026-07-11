from datetime import datetime

from pydantic import BaseModel


class HistoryRecord(BaseModel):
    """Schema for a history record returned to the client."""
    id: str | None = None
    sourceText: str
    translatedText: str
    sourceLanguage: str
    targetLanguage: str
    mode: str
    timestamp: datetime
