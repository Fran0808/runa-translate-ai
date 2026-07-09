from fastapi import APIRouter, HTTPException
from core.database import get_db

router = APIRouter(prefix="/api/v1", tags=["Historial y Estadísticas"])


@router.get(
    "/history",
    summary="Obtener historial de traducciones",
    description="Retorna las últimas 50 traducciones registradas en la base de datos."
)
def get_history():
    """Returns the last 50 translation records from MongoDB."""
    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=503,
            detail={"success": False, "error": "Base de datos no disponible. Configura MONGODB_URI en tu archivo .env."}
        )

    try:
        records = list(
            db["translations"]
            .find({}, {"_id": 0})
            .sort("timestamp", -1)
            .limit(50)
        )
        return {"success": True, "data": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Error al obtener el historial."})


@router.get(
    "/admin/stats",
    summary="Obtener estadísticas de uso",
    description="Retorna métricas agregadas de uso del traductor: total de traducciones y distribución por idioma y modalidad."
)
def get_stats():
    """Returns aggregated usage statistics from MongoDB."""
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
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Error al obtener las estadísticas."})
