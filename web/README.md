# Frontend Web — RunaTranslate

Este directorio contiene la aplicación web de **RunaTranslate**, desarrollada con **React**, **TypeScript** y **Vite** para ofrecer una experiencia rápida, reactiva y fluida. 

La interfaz implementa un diseño visual premium y responsivo, preparado para conectar el motor de traducción del backend, el reconocimiento de voz (ASR) y el historial/estadísticas almacenados en MongoDB.

---

## Guía de Instalación y Ejecución

Sigue estos pasos en orden para configurar y levantar la aplicación web:

### Paso 1: Instalar Dependencias
Asegúrate de tener instalado **Node.js** (versión 18 o superior). Abre una terminal en la raíz del proyecto, navega a la carpeta `web/` e instala los paquetes necesarios:
```bash
cd web
npm install
```

### Paso 2: Configurar las Variables de Envío (Opcional)
Por defecto, la aplicación web se conecta al backend en `http://localhost:8000`. Si necesitas cambiar esta dirección:
1. Crea un archivo `.env` en la raíz del directorio `web/`.
2. Agrega la variable con la URL de tu API:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

### Paso 3: Iniciar el Servidor de Desarrollo
Para levantar el frontend de forma independiente con recarga en tiempo real (HMR):
```bash
npm run dev
```
La aplicación web estará disponible en: **`http://localhost:5173`** (o el puerto que te indique la consola).

---

## Estructura del Proyecto

El código fuente de la aplicación se encuentra organizado de la siguiente manera dentro de `src/`:

```text
web/src/
├── main.tsx             # Punto de entrada de React e inicialización del DOM
├── App.tsx              # Componente principal y enrutador / contenedor de páginas
├── App.css              # Estilos base y variables globales
├── index.css            # Hoja de estilo global y configuración del sistema de diseño (tokens)
├── components/          # Componentes de UI reutilizables
│   ├── Common/          # Botones, selectores, cargadores de carga (spinners)
│   ├── Translator/      # Paneles de texto, botones de audio y controles
│   ├── History/         # Lista de elementos del historial
│   └── Dashboard/       # Tarjetas de métricas y gráficos
├── pages/               # Páginas completas (Vistas)
│   ├── TranslationPage.tsx  # Pantalla principal del traductor (Texto y Voz)
│   ├── HistoryPage.tsx      # Vista detallada de las últimas traducciones
│   └── AdminStatsPage.tsx   # Dashboard administrativo de métricas de uso
└── services/            # Clientes y llamadas al backend (API Fetch)
    ├── api.ts           # Cliente base de fetch (peticiones a FastAPI)
    └── speech.ts        # Lógica de Web Speech API para TTS (síntesis de voz)
```

---

## Directrices de Diseño y Experiencia de Usuario (UX)

Para cumplir con los estándares de un **diseño premium y moderno**, utilizaremos las siguientes pautas en las hojas de estilo:

### 🎨 Paleta de Colores (Estilo Neo-Andino Premium)
*   **Fondo Base (Oscuro):** Tonos pizarra y obsidiana profunda (`#0B0F19`, `#111827`) para reducir la fatiga visual.
*   **Contenedores:** Efecto Glassmorphism con fondos translúcidos y bordes sutiles.
*   **Color Acento Primario:** Turquesa/Teal vibrante (`#14B8A6`) que representa frescura y tecnología.
*   **Color Acento Secundario:** Cobre o dorado andino templado (`#F59E0B`) para estados activos y llamadas a la acción.

### 💫 Tipografía y Animaciones
*   **Fuentes:** Inter o Outfit desde Google Fonts para textos altamente legibles.
*   **Micro-interacciones:** Transiciones suaves de 0.2s en botones, escalas ligeras en hover, y una onda animada para el botón de grabación de micrófono.
*   **Responsive:** Diseño en cuadrícula (grid) y flexbox que se apila automáticamente en dispositivos móviles.
