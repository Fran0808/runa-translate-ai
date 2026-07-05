# Backend API — RunaTranslate

Este directorio contiene el servidor backend de RunaTranslate desarrollado con FastAPI y Python. Se encarga de procesar las traducciones de texto, gestionar la integración con los servicios de inteligencia artificial (ASR/TTS) y almacenar el historial y las estadísticas en MongoDB.

---

## Requisitos de Configuración Local

Para ejecutar este servidor en tu computadora, debes configurar las variables de entorno locales:

### Variables de Entorno (Archivo .env)

1. Duplica el archivo `.env.example` de esta carpeta y renómbralo como `.env`.
2. Abre el nuevo archivo `.env` y rellena las variables de conexión a MongoDB Atlas y la clave de API de OpenAI.

Para ver las instrucciones de instalación del entorno virtual y los comandos de arranque del servidor, consulta la **[Guía de Ejecución en el README principal](../../README.md#guía-de-ejecución)**.

---

## Estructura de Carpetas

* `main.py`: Punto de entrada que inicializa FastAPI y configura CORS.
* `core/`: Configuración del sistema.
  * `config.py`: Lee y valida las variables de entorno del archivo `.env`.
  * `database.py`: Conecta y gestiona el cliente de MongoDB Atlas.
* `models/`: Esquemas de validación de datos con Pydantic.
* `routers/`: Rutas y endpoints de la API (traducción, voz, administración).
* `services/`: Integraciones con motores de IA (NLLB, Whisper, OpenAI).
