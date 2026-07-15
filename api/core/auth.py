import time
import requests
import jwt
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from fastapi import Header, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from core.config import settings

# Google public certificates URL for Firebase Auth
GOOGLE_CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"

# Cache for Google public certificates
public_keys_cache = {}
cache_expiry = 0

class User(BaseModel):
    uid: str
    email: str
    name: Optional[str] = None
    role: str = "user"

def get_google_public_keys():
    global public_keys_cache, cache_expiry
    now = time.time()
    if not public_keys_cache or now > cache_expiry:
        try:
            r = requests.get(GOOGLE_CERTS_URL, timeout=5)
            if r.status_code == 200:
                public_keys_cache = r.json()
                cache_expiry = now + 3600  # Cache for 1 hour
        except Exception as e:
            print(f"[!] Error al descargar llaves públicas de Google: {e}")
    return public_keys_cache

def verify_firebase_token(token: str) -> Optional[User]:
    # 1. Handle mock token for offline/development mode
    if token.startswith("mock-"):
        try:
            parts = token.split("||")
            uid = parts[0]
            email = parts[1] if len(parts) > 1 else "invitado@runatranslate.com"
            name = parts[2] if len(parts) > 2 else "Invitado Offline"
            role = "admin" if email.startswith("admin") else "user"
            return User(uid=uid, email=email, name=name, role=role)
        except Exception:
            return None

    # 2. Handle real Firebase Token verification
    project_id = settings.FIREBASE_PROJECT_ID
    if not project_id:
        # If Firebase is not configured, fall back to mock behavior
        return User(uid="mock-uid-default", email="default@runatranslate.com", name="Usuario Default", role="user")

    try:
        # Decode header to find Key ID (kid)
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        if not kid:
            return None

        # Fetch public keys (PEM X.509 certificates)
        public_keys = get_google_public_keys()
        cert_pem = public_keys.get(kid)
        if not cert_pem:
            return None

        # Extract the RSA public key from the X.509 PEM certificate
        cert_obj = x509.load_pem_x509_certificate(
            cert_pem.encode("utf-8"),
            default_backend()
        )
        public_key = cert_obj.public_key()

        # Decode and verify the Firebase JWT using the extracted public key
        decoded = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}"
        )

        uid = decoded.get("sub")
        email = decoded.get("email", "")
        name = decoded.get("name", email.split("@")[0])
        role = "admin" if email.startswith("admin") else "user"
        
        return User(uid=uid, email=email, name=name, role=role)
    except jwt.ExpiredSignatureError:
        print("[!] Token de Firebase expirado.")
        return None
    except jwt.InvalidTokenError as e:
        print(f"[!] Token de Firebase inválido: {e}")
        return None
    except Exception as e:
        print(f"[!] Error inesperado al validar token de Firebase: {e}")
        return None

def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[User]:
    """
    FastAPI dependency to retrieve the authenticated user.
    Returns None if the Authorization header is missing (for optional/guest access).
    Raises 418 or 401 if a token is present but invalid.
    """
    if not authorization:
        return None

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Formato de cabecera de autorización inválido. Debe ser Bearer <token>"
        )

    token = authorization.split(" ")[1]
    user = verify_firebase_token(token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticación expirado o inválido."
        )

    return user

def get_required_user(user: Optional[User] = Header(None)) -> User:
    """FastAPI dependency requiring user to be logged in."""
    # We will fetch current user via the dependency get_current_user
    raise NotImplementedError("Use get_current_user instead and check for None")
