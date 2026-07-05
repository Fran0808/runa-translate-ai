import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

class Settings:
    PROJECT_NAME: str = "RunaTranslate API"
    PORT: int = int(os.getenv("PORT", 8000))
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    ENV_MODE: str = os.getenv("ENV_MODE", "development")

settings = Settings()
