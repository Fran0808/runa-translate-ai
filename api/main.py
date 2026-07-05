from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import get_db

app = FastAPI(
    title="RunaTranslate API",
    description="API para el traductor inteligente de lenguas regionales",
    version="1.0.0"
)

# Configuración de CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "success": True,
        "message": "RunaTranslate API is running"
    }

@app.get("/api/v1")
def api_v1_root():
    return {
        "success": True,
        "message": "Welcome to RunaTranslate API v1"
    }
