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

### Paso 2: Configurar las Variables de Entorno (Opcional)

Por defecto, la aplicación web se conecta al backend en `http://localhost:8000`. Además, soporta **Autenticación con Firebase** en modo híbrido:
1. **Modo de Simulación (Por defecto - Offline):** Si dejas las variables de Firebase vacías, la aplicación usará un simulador local. Podrás registrar usuarios e iniciar sesión offline sin necesidad de crear una cuenta en Firebase.
2. **Modo Real (Firebase Cloud):** Si deseas conectarlo a la nube real de Firebase, sigue los pasos a continuación.

#### Pasos Detallados para Configurar Firebase Real:

Sigue este tutorial paso a paso basado directamente en la consola de Firebase Console para vincular tu aplicación:

##### Paso A: Registrar la Aplicación Web y Obtener las Claves
1. Inicia sesión en **[Firebase Console](https://console.firebase.google.com/)** y entra a tu proyecto (ej. `runa`).
2. En el panel principal del proyecto, haz clic en el botón **`+ Agregar app`** (ubicado justo debajo del título del proyecto).
3. Selecciona la plataforma **Web** haciendo clic en el ícono de código **`</>`**.
4. Nombra tu aplicación como `RunaTranslate-Web` y haz clic en **"Registrar app"**.
5. Firebase Console te mostrará un bloque de código javascript para inicializar el SDK. Copia los valores que aparecen dentro del objeto `const firebaseConfig = { ... }`:

   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_PROYECTO.firebaseapp.com",
     projectId: "TU_PROYECTO_ID",
     storageBucket: "TU_PROYECTO.firebasestorage.app",
     messagingSenderId: "TU_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

##### Paso B: Configurar el archivo `.env` del Frontend
Crea o edita el archivo `.env` en la raíz de la carpeta `web/` y mapea los campos que copiaste de Firebase de la siguiente manera:

```env
# URL de conexión al backend
VITE_API_URL=http://localhost:8000

# Configuración del SDK de Firebase (Mapeo directo)
VITE_FIREBASE_API_KEY=tu_apiKey_de_firebaseConfig
VITE_FIREBASE_AUTH_DOMAIN=tu_authDomain_de_firebaseConfig
VITE_FIREBASE_PROJECT_ID=tu_projectId_de_firebaseConfig
VITE_FIREBASE_STORAGE_BUCKET=tu_storageBucket_de_firebaseConfig
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messagingSenderId_de_firebaseConfig
VITE_FIREBASE_APP_ID=tu_appId_de_firebaseConfig
```

##### Paso C: Configurar el archivo `.env` del Backend (FastAPI)
Para que el servidor valide de forma segura los tokens de acceso de tus usuarios, debes copiar el **ID de tu proyecto** (`projectId`) al archivo `.env` del backend:
1. Abre el archivo `api/.env`.
2. Asigna el ID del proyecto en la variable correspondiente:
   ```env
   FIREBASE_PROJECT_ID=tu_projectId_de_firebaseConfig (ej. runa-78e7f)
   ```

##### Paso D: Activar el Método de Inicio de Sesión en Firebase Console
Para habilitar que los usuarios puedan registrar cuentas en la base de datos de Google:
1. En el menú lateral izquierdo de Firebase Console, haz clic en la sección **Seguridad** (o **Compilación / Build**).
2. En el submenú que se despliega, haz clic en **`Authentication`**.
3. En el panel principal de Authentication, selecciona la pestaña superior **"Método de acceso"** (o *Sign-in method*).
4. En el listado de "Proveedores de acceso", busca la fila **"Correo electrónico/contraseña"** y haz clic en el interruptor **"Habilitar"** (los demás interruptores como Vínculo de correo electrónico deben quedarse desactivados).
5. Haz clic en el botón azul **"Guardar"** para confirmar los cambios.

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
