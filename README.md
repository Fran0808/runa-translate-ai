# RunaTranslate — Traductor Inteligente de Lenguas Regionales

RunaTranslate es una plataforma web inteligente diseñada para facilitar la comunicación y preservar la identidad cultural mediante la traducción automática de texto y voz entre el **Español**, **Quechua** y **Aimara**. 

El proyecto utiliza tecnologías de Procesamiento de Lenguaje Natural (NLP) e Inteligencia Artificial de última generación para ofrecer traducciones rápidas, contextualizadas y accesibles.

---

## Índice

* [Funcionalidades Principales](#funcionalidades-principales)
* [Arquitectura Tecnológica](#arquitectura-tecnológica)
* [Estructura del Directorio](#estructura-del-directorio)
* [Guía de Ejecución](#guía-de-ejecución)

---

## Funcionalidades Principales

La aplicación se compone de los siguientes módulos funcionales:

### 1. Módulo de Traducción
*   **Traducción de Texto**: Conversión bidireccional en tiempo real entre:
    *   Español ↔ Quechua
    *   Español ↔ Aimara
*   **Traducción de Voz**: Entrada de audio por micrófono y salida traducida de manera fluida.

### 2. Módulo de Voz (ASR & TTS)
*   **Reconocimiento de Voz (ASR)**: Transcripción automática de audio hablado (voz a texto) en lenguas regionales.
*   **Síntesis de Voz (TTS)**: Lectura automática en audio de los textos traducidos (texto a voz) utilizando el motor nativo del navegador o APIs en la nube.

### 3. Módulo Inteligente
*   **Corrección Contextual**: Uso de modelos avanzados para adaptar la traducción al contexto cultural y lingüístico de la región, evitando traducciones literales incorrectas.

### 4. Módulo Administrativo
*   **Historial de Traducciones**: Registro de las traducciones realizadas por los usuarios (almacenamiento local o en base de datos para usuarios invitados).
*   **Panel de Estadísticas (Dashboard)**: Visualización agregada de métricas de uso, incluyendo total de traducciones diarias, idiomas más consultados y modalidades preferidas (texto o voz).

---

## Arquitectura Tecnológica

El sistema está estructurado bajo una arquitectura modular y desacoplada (monorreferencial):

*   **Frontend**: Desarrollado en **React** con **TypeScript** utilizando **Vite** para máxima velocidad de desarrollo y compilación. Diseño visual premium responsivo adaptado a dispositivos móviles.
*   **Backend**: API REST construida con **FastAPI** (Python), aprovechando su tipado estático, alto rendimiento y generación automática de documentación interactiva (Swagger UI).
*   **Base de Datos**: **MongoDB (Atlas)** en la nube para almacenamiento flexible de historiales y métricas.
*   **Motor de IA**:
    *   *Traducción*: Modelo open-source **Meta NLLB-200** (`facebook/nllb-200-distilled-600M`) e integración con la API de **OpenAI (GPT-4o)** para correcciones de contexto.
    *   *Reconocimiento de Voz*: **Whisper** de OpenAI para transcripciones de alta precisión.
    *   *Síntesis de Voz*: API nativa **Web Speech API** del navegador para síntesis ligera en el cliente.

---

## Estructura del Directorio

```text
runa-translate-ai/
├── README.md                # Presentación general del proyecto (este archivo)
├── AGENTS.md                # Directrices del proyecto, base de datos y endpoints
├── package.json             # Atajos de ejecución del monorepo
├── api/                     # Backend FastAPI (Python)
│   ├── main.py              # Punto de entrada
│   ├── core/                # Configuración de base de datos y entorno
│   ├── models/              # Esquemas Pydantic y MongoDB
│   ├── routers/             # Controladores de rutas de la API
│   └── services/            # Servicios de traducción e integración de IA
└── web/                     # Frontend React (TypeScript + Vite)
    ├── index.html           # Archivo HTML de entrada
    ├── src/
    │   ├── components/      # Componentes interactivos y UI
    │   ├── pages/           # Vistas de la aplicación (Traductor, Historial, Admin)
    │   └── services/        # Clientes de API y conexiones externas
```

---

## Guía de Ejecución

Para iniciar y probar el proyecto de manera local, puede ejecutar los comandos directamente desde la **carpeta raíz** del proyecto (sin necesidad de cambiar de directorio):

### 1. Iniciar ambos módulos en paralelo
Para levantar el servidor backend (API) y la aplicación web (Frontend) al mismo tiempo en una única terminal:
```bash
npm run dev
```

*   **Iniciar el Backend (API)**:
    ```bash
    npm run api
    ```
    La API estará disponible en `http://localhost:8000`. Puedes acceder a la documentación interactiva (Swagger UI) en `http://localhost:8000/docs`.

*   **Iniciar el Frontend (Web)**:
    ```bash
    npm run web
    ```
    La aplicación web estará disponible en `http://localhost:5173`.

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

---

## Módulo Inteligente: Configuración de Google Gemini (Opcional - Recomendado)

Para corregir los desvíos lingüísticos del modelo local de traducción (NLLB-200) y obtener traducciones refinadas y adaptadas culturalmente, puedes activar el **Módulo de Corrección Contextual** de forma 100% gratuita utilizando la API de Google Gemini:

### Cómo obtener la API Key Gratuita de Gemini:
1. Regístrate de forma gratuita en **[Google AI Studio](https://aistudio.google.com/)** con tu cuenta de Google.
2. Haz clic en el botón principal **"Create API Key"** (Crear clave de API).
3. Selecciona tu proyecto o crea uno nuevo y haz clic en **"Create API Key in new project"**.
4. Copia la clave de API generada (una cadena de caracteres que inicia con `AIzaSy...`). *No requiere tarjeta de crédito ni facturación.*

### Configuración en el proyecto:
Abre el archivo `.env` ubicado en la carpeta `api/` y añade la clave de API en la variable `GEMINI_API_KEY`:

```env
GEMINI_API_KEY=AIzaSyTuClaveGeneradaAqui...
```

Al levantar el proyecto, el backend detectará la clave y aplicará automáticamente el filtro corrector de **Gemini 1.5 Flash** para optimizar el resultado del traductor. Si no hay internet o no configuras la clave, el traductor seguirá funcionando con el modelo NLLB-200 local como respaldo seguro.
