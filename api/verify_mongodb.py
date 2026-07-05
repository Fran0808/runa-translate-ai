import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure

# Cargar variables de entorno del archivo .env
load_dotenv()

def verify_mongo():
    print("[*] Iniciando verificación de conexión con MongoDB Atlas...")
    
    uri = os.getenv("MONGODB_URI")
    
    if not uri:
        print("[-] ERROR: La variable MONGODB_URI no está definida en el archivo .env")
        sys.exit(1)
        
    if "<username>" in uri or "<password>" in uri:
        print("[-] ERROR: Aún tienes los marcadores de posición <username> o <password> en tu MONGODB_URI.")
        print("    Debes reemplazarlos por tu usuario y contraseña reales de MongoDB Atlas (sin los símbolos '<' y '>').")
        sys.exit(1)

    print(f"[*] URI detectada en .env. Intentando conectar...")
    
    try:        
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        
        client.admin.command('ping')
        
        print("\n[+] ===========================================")
        print("[+] VERIFICACIÓN EXITOSA DE MONGODB")
        print("[+] Conexión establecida con tu clúster en la nube.")
        print("[+] Nombre de la base de datos conectada: runatranslate")
        print("[+] ===========================================\n")
        
    except ConnectionFailure as ce:
        print("\n[-] ERROR DE CONEXIÓN CON MONGODB:")
        print(f"    No se pudo establecer contacto con el servidor: {ce}")
        print("    Sugerencias:")
        print("    1. Revisa tu conexión a internet.")
        print("    2. Verifica que hayas añadido tu IP actual (o 0.0.0.0/0) en Network Access en la consola de MongoDB Atlas.")
    except OperationFailure as oe:
        print("\n[-] ERROR DE AUTENTICACIÓN:")
        print(f"    Las credenciales de tu MONGODB_URI son incorrectas: {oe}")
        print("    Sugerencia: Revisa que tu usuario y contraseña de Database Access en Atlas coincidan exactamente.")
    except Exception as e:
        print(f"\n[-] Ocurrió un error inesperado al conectar: {e}")

if __name__ == "__main__":
    verify_mongo()
