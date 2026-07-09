from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.database import get_db
from services.translation_service import translation_service
from routers.translation import router as translation_router
from routers.history import router as history_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the FastAPI application.
    The translation model is loaded into RAM once at startup.
    """
    # Startup
    print("\n[*] Iniciando RunaTranslate API...")
    print("[*] Verificando conexión a base de datos...")
    db = get_db()
    if db is not None:
        print("[+] Base de datos MongoDB Atlas conectada correctamente.")
    else:
        print("[!] Advertencia: Base de datos no disponible. El historial no se guardará.")

    print("[*] Cargando modelo de IA (NLLB-200) en memoria RAM...")
    print("    (Este proceso puede tardar entre 5 y 15 segundos la primera vez)...")
    translation_service.initialize()
    print("[+] Servidor listo. Accede a la documentación en: http://localhost:8000/docs\n")

    yield

    # Shutdown
    print("\n[*] Apagando RunaTranslate API...")


app = FastAPI(
    title="RunaTranslate API",
    description="API REST para el traductor inteligente de lenguas regionales: Español, Quechua y Aimara.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(translation_router)
app.include_router(history_router)


@app.get("/", tags=["Estado"])
def read_root():
    return {
        "success": True,
        "message": "RunaTranslate API is running",
        "docs": "http://localhost:8000/docs"
    }
