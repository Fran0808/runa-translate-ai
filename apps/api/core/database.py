from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from core.config import settings

# Inicializar cliente de MongoDB
client = None
db = None

if settings.MONGODB_URI:
    try:
        client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Verificar la conexión enviando un comando ping
        client.admin.command('ping')
        # Obtener la base de datos
        db = client.get_database("runatranslate")
        print("Conexión a MongoDB Atlas establecida con éxito.")
    except ConnectionFailure:
        print("Error: No se pudo conectar a MongoDB. Verifica tu MONGODB_URI.")
    except Exception as e:
        print(f"Error al conectar con la base de datos: {e}")
else:
    print("Advertencia: MONGODB_URI no está configurado en las variables de entorno. El historial y estadísticas no se guardarán.")

def get_db():
    """
    Retorna la instancia de la base de datos de MongoDB para realizar operaciones en las colecciones.
    """
    return db
