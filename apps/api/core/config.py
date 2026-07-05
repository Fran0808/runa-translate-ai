import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

class Settings:
    PROJECT_NAME: str = "RunaTranslate API"
    PORT: int = int(os.getenv("PORT", 8000))
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ENV_MODE: str = os.getenv("ENV_MODE", "development")

settings = Settings()
