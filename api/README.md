# Backend API — RunaTranslate

Este directorio contiene el servidor backend de RunaTranslate desarrollado con FastAPI y Python. Se encarga de procesar las traducciones de texto localmente, gestionar la integración con los servicios de inteligencia artificial (ASR/TTS) y almacenar el historial y las estadísticas en la nube (MongoDB Atlas).

---

## Requisitos de Configuración Local

Para ejecutar este servidor en tu computadora, debes configurar el entorno virtual, las dependencias de IA local y las variables de entorno:

### 1. Dependencias de Inteligencia Artificial (Local)

El backend ejecuta el modelo de traducción **Meta NLLB-200** (`facebook/nllb-200-distilled-600M`) de forma 100% local. Para ello, se requiere instalar las siguientes librerías de IA en el entorno virtual (declaradas en `requirements.txt`):
*   `torch` (PyTorch): Motor de ejecución para la red neuronal.
*   `transformers`: Librería de Hugging Face para cargar y gestionar el modelo.
*   `sentencepiece`: Tokenizador para el procesamiento del texto en Quechua y Aimara.

*Nota*: La primera vez que el servidor se ejecute, descargará automáticamente el archivo de pesos del modelo (aproximadamente 1.1 GB) y lo guardará en la carpeta de caché de tu perfil de usuario de Windows:
`C:\Users\Usuario\.cache\huggingface\hub\`

---

### 2. Variables de Entorno (Archivo .env)

Por motivos de seguridad, las contraseñas y accesos no se guardan directamente en el código. Debes configurar un archivo local `.env`:

1. Duplica el archivo `.env.example` de esta carpeta y renómbralo como `.env`.
2. Abre el nuevo archivo `.env` y rellena las variables siguiendo estos pasos:

#### Paso A: Obtener la cadena de conexión de MongoDB Atlas (Base de Datos)
1. Regístrate de forma gratuita en **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)**.
2. Crea un nuevo clúster de base de datos seleccionando la opción gratuita **M0 Free / Shared** (no requiere tarjeta de crédito).
3. Configura la seguridad:
   * Crea un usuario de base de datos con un nombre y contraseña segura (guarda esta contraseña, la necesitarás en el paso 5).
   * En la sección de seguridad de red ("Network Access"), añade tu dirección IP actual o `0.0.0.0/0` para permitir conexiones de prueba desde cualquier ubicación.
4. En el panel principal del clúster, haz clic en el botón **Connect**, selecciona la opción **Drivers** (Python) y copia la cadena de conexión (`mongodb+srv://...`).
5. Pega la cadena en tu archivo `.env` en la variable `MONGODB_URI`, reemplazando `<username>` y `<password>` por tus credenciales del usuario de base de datos creado (elimina los símbolos `< >`). Por ejemplo: `mongodb+srv://admin:Secreto123@cluster...`

#### Paso B: Token de Hugging Face (Opcional)
*   El token `HF_API_TOKEN` es opcional en este modo. No es necesario para traducir, pero agregarlo al `.env` evita avisos de advertencia en la consola y acelera la velocidad de descarga inicial del modelo.

Para ver las instrucciones de instalación del entorno virtual y los comandos de arranque del servidor, consulta la **[Guía de Ejecución en el README principal](../../README.md#guía-de-ejecución)**.

---

## Verificación de la Instalación

Una vez configurado el entorno virtual e instaladas las dependencias, puedes verificar de forma independiente los dos pilares del backend ejecutando los siguientes scripts de diagnóstico desde la raíz del proyecto:

### 1. Verificar Conexión a la Base de Datos (MongoDB Atlas)
Este script comprueba si tu archivo `.env` está bien configurado y si la base de datos en la nube está activa y accesible:
```powershell
.\api\.venv\Scripts\python.exe api/verify_mongodb.py
```

### 2. Verificar Modelo de Traducción (Local NLLB-200)
Este script verifica que las dependencias de inteligencia artificial (PyTorch/Transformers) estén bien instaladas y realiza una traducción real de prueba a Quechua y Aimara en tu procesador local:
```powershell
.\api\.venv\Scripts\python.exe api/verify_translation.py
```

---

## Estructura de Carpetas

* `main.py`: Punto de entrada que inicializa FastAPI y configura CORS.
* `core/`: Configuración del sistema.
  * `config.py`: Lee y valida las variables de entorno del archivo `.env`.
  * `database.py`: Conecta y gestiona el cliente de MongoDB Atlas.
* `models/`: Esquemas de validación de datos con Pydantic.
* `routers/`: Rutas y endpoints de la API (traducción, voz, administración).
* `services/`: Integraciones con motores de IA (NLLB local, Whisper).
