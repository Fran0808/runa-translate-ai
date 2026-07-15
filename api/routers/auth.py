from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from core.database import get_db
from core.auth import User, get_current_user
from typing import Optional

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])

@router.post(
    "/register",
    summary="Registrar o sincronizar usuario",
    description="Registra un usuario autenticado mediante Firebase en la colección 'users' de MongoDB."
)
def register_user(user: Optional[User] = Depends(get_current_user)):
    if user is None:
        raise HTTPException(
            status_code=401,
            detail={"success": False, "error": "Cabecera de autenticación requerida o token inválido."}
        )

    db = get_db()
    if db is None:
        raise HTTPException(
            status_code=503,
            detail={"success": False, "error": "Base de datos no disponible."}
        )

    try:
        # Check if the user already exists in MongoDB
        existing_user = db["users"].find_one({"uid": user.uid})
        
        if not existing_user:
            user_doc = {
                "uid": user.uid,
                "email": user.email,
                "name": user.name or user.email.split("@")[0],
                "role": user.role,
                "createdAt": datetime.utcnow()
            }
            db["users"].insert_one(user_doc)
            return {"success": True, "message": "Usuario registrado en la base de datos con éxito.", "data": {"uid": user.uid, "role": user.role}}
        else:
            # Sync role or other details if necessary
            if existing_user.get("role") != user.role or existing_user.get("name") != user.name:
                db["users"].update_one(
                    {"uid": user.uid},
                    {"$set": {"role": user.role, "name": user.name or existing_user.get("name")}}
                )
            return {"success": True, "message": "Usuario ya existe, perfil sincronizado.", "data": {"uid": user.uid, "role": user.role}}
    except Exception as e:
        print(f"[!] Error al registrar usuario en base de datos: {e}")
        raise HTTPException(status_code=500, detail={"success": False, "error": "Error interno al registrar usuario."})
