# Reglas y Arquitectura del Proyecto: RunaTranslate

Este archivo define las directrices del proyecto, la arquitectura de referencia, la estructura de base de datos y la hoja de ruta para el desarrollo de **RunaTranslate** (Traductor Inteligente de Lenguas Regionales). Sirve como la "fuente de verdad" para cualquier asistente de IA.

---

## 1. Directrices Generales de Código

- **Idioma de desarrollo**: Código y comentarios en inglés (estándar de la industria), pero documentación y mensajes de usuario final en español.
- **Backend (Python / FastAPI)**:
  - Usar tipado estricto (`Pydantic` v2, `typing`).
  - Formato de respuesta JSON consistente: `{ "success": true/false, "data": ..., "error": ... }`.
  - Estructuración modular: `routers/`, `services/`, `models/`, `core/`.
- **Frontend (React Web - Prioritario)**:
  - Usar TypeScript para tipado estricto.
  - Componentes funcionales con React Hooks (usando Vite para React Web).
  - Diseño responsivo y premium adaptado a dispositivos móviles.
  - Gestión de estado limpia (Context API o Zustand).
  - *Nota*: El desarrollo de la App Móvil (React Native/Expo) queda pospuesto hasta finalizar el frontend web.
- **Control de Cambios**:
  - No romper compatibilidad de APIs existentes sin actualizar la documentación de endpoints aquí descrita.
  - Si se realizan cambios en la estructura de archivos, nombres de carpetas o arquitectura del proyecto, se deben actualizar inmediatamente las representaciones del árbol de directorios tanto en este archivo (AGENTS.md) como en el README.md para mantener la coherencia.

---

## 2. Estructura del Proyecto (Monorepo)

```text
runa-translate-ai/
├── AGENTS.md                # Este archivo de reglas
├── package.json             # Atajos de ejecución del monorepo
├── api/                     # Backend en Python (FastAPI)
│   ├── main.py              # Punto de entrada
│   ├── core/                # Configuración, seguridad y conexión a DB
│   ├── models/              # Modelos de Pydantic y esquemas de MongoDB
│   ├── routers/             # Endpoints (auth, translation, voice, admin)
│   ├── services/            # Lógica de traducción e IA (NLLB, OpenAI, Whisper)
│   └── requirements.txt     # Dependencias de Python
└── web/                     # Frontend Web (React + TypeScript con Vite)
    ├── index.html           # Entrada de la web
    ├── src/
    │   ├── components/      # Componentes reutilizables de UI (Premium UI)
    │   ├── pages/           # Páginas/Pantallas (Traducción, Historial, Estadísticas, Login)
    │   ├── services/        # Clientes de API (fetch a FastAPI, Firebase Auth)
    │   └── hooks/           # Custom hooks
    └── package.json
```

---

## 3. Modelo de Datos (MongoDB)

### Colección: `users`
```json
{
  "_id": "ObjectId",
  "uid": "String (Firebase Auth UID)",
  "email": "String",
  "name": "String",
  "role": "String (user / admin)",
  "createdAt": "ISODate"
}
```

### Colección: `translations`
```json
{
  "_id": "ObjectId",
  "userId": "String (Firebase UID o null si es invitado)",
  "sourceText": "String",
  "translatedText": "String",
  "sourceLanguage": "String (es / qu / ay)",
  "targetLanguage": "String (es / qu / ay)",
  "mode": "String (text / voice)",
  "timestamp": "ISODate"
}
```

### Colección: `statistics` (Agregados para Admin)
```json
{
  "_id": "ObjectId",
  "date": "String (YYYY-MM-DD)",
  "totalTranslations": "Number",
  "languages": {
    "es_qu": "Number",
    "qu_es": "Number",
    "es_ay": "Number",
    "ay_es": "Number"
  },
  "modes": {
    "text": "Number",
    "voice": "Number"
  }
}
```

---

## 4. Diseño de API (FastAPI)

Todos los endpoints deben estar bajo el prefijo `/api/v1`.

### Autenticación (Opcional - Pospuesto / Simplificado)
- *Nota*: Por ahora se priorizará el flujo sin autenticación (usuarios invitados/anónimos).
- `POST /api/v1/auth/register` (Pospuesto): Registrar/sincronizar usuario.
- `POST /api/v1/auth/login` (Pospuesto): Validar token e iniciar sesión.

### Traducción (Motor IA)
- `POST /api/v1/translate`:
  - **Body**: `{ "text": "...", "source_lang": "es/qu/ay", "target_lang": "es/qu/ay" }`
  - **Response**: `{ "translated_text": "...", "context_corrected": true/false }`

### Voz (ASR & TTS)
- `POST /api/v1/voice/asr`:
  - **Body**: Multipart form (archivo de audio) + `source_lang`.
  - **Response**: `{ "text": "..." }`
- `POST /api/v1/voice/tts`:
  - **Body**: `{ "text": "...", "lang": "es/qu/ay" }`
  - **Response**: Archivo de audio (MP3/WAV) o URL temporal del audio generado.

### Historial y Estadísticas (Admin / Usuario)
- `GET /api/v1/history`: Obtener historial de traducciones del usuario autenticado.
- `GET /api/v1/admin/stats`: Obtener métricas agregadas (solo administradores).

---

## 5. Estrategia de IA

Dado el alcance del proyecto, el desarrollo de modelos de traducción desde cero es complejo. Se aplicará una estrategia de IA 100% gratuita y alineada con los requerimientos del PDF:

1. **Traducción de Texto (Español <-> Quechua / Aimara)**:
   - **Motor Principal (Local)**: Carga y ejecución local del modelo **Meta NLLB-200** (`facebook/nllb-200-distilled-600M`) utilizando la librería de Python `transformers` y `torch` (PyTorch) en el servidor backend (ejecución por CPU). Esta solución es 100% offline, no requiere tokens de API, y funciona de manera independiente sin verse afectada por filtros DNS.
2. **Reconocimiento de Voz (ASR)**:
   - **Opción Principal**: Integración del modelo **Whisper** de OpenAI para la transcripción de voz a texto de forma gratuita (consumido por API de Hugging Face o de forma local si persisten bloqueos de red).
3. **Síntesis de Voz (TTS)**:
   - **Nativo del Navegador**: Utilizar la API de síntesis de voz nativa del navegador (**Web Speech API**) desde el frontend para reproducir la voz de forma local y 100% gratuita.


