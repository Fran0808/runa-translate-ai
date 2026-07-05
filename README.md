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

### 2. Iniciar módulos de forma independiente
Si prefiere ejecutarlos en terminales independientes para ver los logs por separado:

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

### 3. Verificar el correcto funcionamiento
Para validar la instalación y configuración de forma aislada, el backend cuenta con dos scripts de autodiagnóstico que se pueden ejecutar desde la raíz:

*   **Verificar Base de Datos (MongoDB Atlas)**:
    ```powershell
    .\api\.venv\Scripts\python.exe api/verify_mongodb.py
    ```
*   **Verificar Inteligencia Artificial (Traducción Local NLLB-200)**:
    ```powershell
    .\api\.venv\Scripts\python.exe api/verify_translation.py
    ```
