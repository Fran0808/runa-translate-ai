from fastapi import APIRouter, HTTPException, Depends
from core.database import get_db
from core.auth import User, get_current_user
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["Historial y Estadísticas"])


@router.get(
    "/history",
    summary="Obtener historial de traducciones",
    description="Retorna las últimas 50 traducciones registradas en la base de datos para el usuario autenticado."
)
def get_history(user: Optional[User] = Depends(get_current_user)):
    """Returns the last 50 translation records from MongoDB for the authenticated user."""
    if user is None:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "error": "Inicie sesión para ver su historial."}
        )

    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=503,
            detail={"success": False, "error": "Base de datos no disponible. Configura MONGODB_URI en tu archivo .env."}
        )

    try:
        records = list(
            db["translations"]
            .find({"userId": user.uid}, {"_id": 0})
            .sort("timestamp", -1)
            .limit(50)
        )
        return {"success": True, "data": records}
    except Exception:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Error al obtener el historial."})


@router.get(
    "/admin/stats",
    summary="Obtener estadísticas de uso",
    description="Retorna métricas agregadas de uso del traductor: total de traducciones y distribución por idioma y modalidad (Solo Administradores)."
)
def get_stats(user: Optional[User] = Depends(get_current_user)):
    """Returns aggregated usage statistics from MongoDB (Admin only)."""
    if user is None:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "error": "Inicie sesión para ver las estadísticas."}
        )
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail={"success": False, "error": "Acceso denegado. Solo administradores pueden ver las estadísticas."}
        )

    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=503,
            detail={"success": False, "error": "Base de datos no disponible. Configura MONGODB_URI en tu archivo .env."}
        )

    try:
        total = db["translations"].count_documents({})

        # Aggregate by language pair
        pipeline_languages = [
            {
                "$group": {
                    "_id": {
                        "source": "$sourceLanguage",
                        "target": "$targetLanguage"
                    },
                    "count": {"$sum": 1}
                }
            }
        ]
        language_stats = list(db["translations"].aggregate(pipeline_languages))

        # Aggregate by mode (text/voice)
        pipeline_modes = [
            {
                "$group": {
                    "_id": "$mode",
                    "count": {"$sum": 1}
                }
            }
        ]
        mode_stats = list(db["translations"].aggregate(pipeline_modes))

        return {
            "success": True,
            "data": {
                "total_translations": total,
                "by_language": language_stats,
                "by_mode": mode_stats,
            }
        }
    except Exception:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Error al obtener las estadísticas."})
