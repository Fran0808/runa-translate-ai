import os
from pathlib import Path

from dotenv import load_dotenv

base_dir = Path(__file__).resolve().parent.parent
env_path = base_dir / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "RunaTranslate API"
    PORT: int = int(os.getenv("PORT", 8000))
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    ENV_MODE: str = os.getenv("ENV_MODE", "development")

settings = Settings()
