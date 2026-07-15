# Backend API — RunaTranslate

Este directorio contiene el servidor backend de RunaTranslate desarrollado con FastAPI y Python. Se encarga de procesar las traducciones de texto localmente mediante inteligencia artificial, gestionar el reconocimiento de voz (ASR) y almacenar el historial y las estadísticas en la base de datos (MongoDB Atlas).

---

## Guía de Instalación y Configuración del Backend

Sigue estos pasos en orden para configurar el entorno y dejar el backend listo para su ejecución y verificación:

### Paso 1: Configurar las Variables de Entorno (Archivo .env)
El servidor requiere credenciales seguras para comunicarse con la base de datos en la nube.
1. Abre tu terminal de comandos en la raíz del proyecto, navega hacia la carpeta `api/` y duplica el archivo de ejemplo para crear tu archivo `.env` local:
   ```powershell
   cd api
   copy .env.example .env
   ```
2. Abre el nuevo archivo `.env` en tu editor de código y configura las siguientes variables:

   * **Obtener la cadena de conexión de MongoDB Atlas (Obligatorio)**:
     1. Regístrate de forma gratuita en **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)**.
     2. Crea un nuevo clúster de base de datos seleccionando la opción gratuita **M0 Free / Shared** (no requiere tarjeta de crédito).
     3. Configura la seguridad en el panel de Atlas:
        * En **Database Access**, crea un usuario de base de datos con su respectivo nombre y contraseña (guarda la contraseña para el paso 5).
        * En **Network Access**, añade la dirección IP `0.0.0.0/0` para permitir conexiones de prueba.
     4. En el panel principal del clúster, haz clic en **Connect**, selecciona **Drivers** (Python) y copia la cadena de conexión (`mongodb+srv://...`).
     5. Pega la cadena en tu archivo `.env` en la variable `MONGODB_URI`, asegurándote de reemplazar `<username>` por tu usuario y `<password>` por tu contraseña real. **Importante**: Elimina los símbolos `<` y `>`. Ejemplo: `mongodb+srv://admin:Secreto123@cluster...`

   * **Obtener el Token de Hugging Face (Opcional)**:
     * *Nota*: Aunque el modelo de traducción corre en local sin necesidad de tokens, contar con este token evita avisos de advertencia en consola y acelera la velocidad de descarga inicial del modelo.
     1. Regístrate de forma gratuita en **[Hugging Face](https://huggingface.co/join)**.
     2. Haz clic en tu foto de perfil (esquina superior derecha) y selecciona **Settings**.
     3. En el menú lateral izquierdo, haz clic en **Access Tokens**.
     4. Haz clic en **New token**, nómbralo `RunaTranslate`, dale el rol de **Read** (lectura) y haz clic en **Generate a token**.
     5. Copia la clave resultante (inicia con `hf_...`) y pégala en tu `.env` en la variable `HF_API_TOKEN`.

   * **Obtener la API Key Gratuita de Google Gemini (Opcional - Recomendado)**:
     * *Nota*: Al configurar esta clave activarás el **Módulo Inteligente de Corrección Contextual**, el cual pule las traducciones locales del modelo NLLB-200 para evitar modismos erróneos o desvíos al inglés. Es 100% gratuito.
     1. Regístrate en **[Google AI Studio](https://aistudio.google.com/)** con tu cuenta de Google.
     2. Haz clic en el botón principal **"Create API Key"** (Crear clave de API).
     3. Selecciona tu proyecto o crea uno nuevo y haz clic en **"Create API Key in new project"**.
     4. Copia la clave de API generada (inicia con `AIzaSy...`) y pégala en tu archivo `.env` en la variable `GEMINI_API_KEY`.

   * **Configurar el ID del Proyecto de Firebase (Opcional - Requerido para Autenticación Real)**:
     * *Nota*: Esta variable le permite al backend validar y descifrar criptográficamente las firmas de los tokens JWT de tus usuarios autenticados reales de Firebase.
     1. Abre tu proyecto en **[Firebase Console](https://console.firebase.google.com/)**.
     2. Haz clic en el ícono de engranaje ⚙️ y selecciona **"Configuración del proyecto"**.
     3. Copia el valor del campo **"ID del proyecto"** (Project ID, por ejemplo: `runa-78e7f`).
     4. Pégalo en tu archivo `api/.env` en la variable `FIREBASE_PROJECT_ID`.

---

### Paso 2: Crear el Entorno Virtual de Python
Asegúrate de que tu terminal esté dentro de la carpeta `api/` (si cerraste la terminal, ejecuta `cd api` de nuevo). Luego crea el entorno virtual:
```powershell
python -m venv .venv
```

---

### Paso 3: Instalar las Dependencias y Librerías de IA
Instala las librerías del servidor y los motores locales de Inteligencia Artificial (PyTorch, Transformers y SentencePiece) en tu entorno virtual. Este paso puede tardar varios minutos por el tamaño de PyTorch:
```powershell
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## Verificación del Correcto Funcionamiento

Una vez completados los pasos de instalación anteriores, puedes ejecutar estos dos scripts de diagnóstico en tu terminal para verificar que todo se haya instalado y configurado correctamente:

### 1. Verificar Base de Datos (MongoDB Atlas)
Comprueba que el archivo `.env` tiene las credenciales correctas y que tu base de datos en la nube está activa y accesible:
```powershell
.venv\Scripts\python.exe verify_mongodb.py
```

### 2. Verificar Inteligencia Artificial (Modelo Local NLLB-200)
Comprueba que las librerías de IA se instalaron bien y descarga/ejecuta el modelo de traducción en tu procesador para traducir una frase de prueba a Quechua y Aimara:
```powershell
.venv\Scripts\python.exe verify_translation.py
```
*(Nota: La primera vez que corras este script tardará unos minutos en descargar el modelo de 1.1 GB. Las siguientes ejecuciones serán casi instantáneas).*

---

## Arranque del Servidor API

Una vez verificado todo, inicia el backend en modo de recarga automática (desarrollo):
```powershell
.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Con el servidor encendido:
* La API REST estará lista en `http://localhost:8000`.
* Puedes acceder a la interfaz de pruebas interactiva de Swagger UI en: **`http://localhost:8000/docs`**

---

## Estructura de Carpetas

* `main.py`: Punto de entrada que inicializa FastAPI y configura CORS.
* `verify_mongodb.py`: Script de verificación de conexión a MongoDB.
* `verify_translation.py`: Script de verificación de traducción local.
* `core/`: Configuración del sistema.
  * `config.py`: Lee y valida las variables de entorno del archivo `.env`.
  * `database.py`: Conecta y gestiona el cliente de MongoDB Atlas.
* `models/`: Esquemas de validación de datos con Pydantic.
* `routers/`: Rutas y endpoints de la API (traducción, voz, administración).
* `services/`: Integraciones con motores de IA (NLLB local, Whisper).

---

## Ejemplos de Prueba Verificados (Offline / Modelo Local)

Para comprobar el correcto funcionamiento del modelo de traducción local **NLLB-200** (offline, sin necesidad de claves de API externas), puedes probar con este listado de oraciones cortas y estructuradas que han sido verificadas en el entorno local:

### 🇪🇸 Español ➜ 🏔️ Quechua
*   `Buenos días, ¿cómo estás?` ➜ `Alli p'unchay. ¿Imaynatan kanki?`
*   `Mi nombre es Juan.` ➜ `Noqaqa Juan sutin.`
*   `Yo vivo aquí.` ➜ `Kaypi tiyakuni.`
*   `El sol es grande.` ➜ `Intiqa hatunmi.`
*   `Tú eres mi amigo.` ➜ `Qammi amistadniy kanki.`
*   `Me gusta cantar.` ➜ `Noqaqa takiyta munani.`
*   `Mi pueblo es hermoso.` ➜ `Llaqtaqa sumaqmi.`

### 🏔️ Quechua ➜ 🇪🇸 Español
*   `Alli p'unchay. ¿Imaynatan kanki?` ➜ `Buen día. ¿Cómo estás?`
*   `Imataq sutiyki?` ➜ `¿Cómo te llamas?`
*   `Kaypi tiyakuni.` ➜ `Aquí es donde vivo.`
*   `Intiqa hatunmi.` ➜ `El sol es grande.`
*   `Qammi amistadniy kanki.` ➜ `Tú eres mi amigo.`
*   `Noqa allin kani.` ➜ `Estoy bien.`
*   `Wasiyqa sumaqmi.` ➜ `Mi casa está bien.`
