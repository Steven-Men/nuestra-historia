[README.md](https://github.com/user-attachments/files/31162248/README.md)
# nuestra-historia# Nuestra Historia 💙❤️

Galería privada para pareja: fotos con marco romántico, canciones que se
reproducen mientras ven las fotos, momentos con ubicación, y una
contraseña que solo ustedes conocen. Las fotos y canciones se guardan en
la nube (Firebase), así que si instalan la app en dos teléfonos, ambos
ven el mismo contenido.

## 1. Requisitos

- Node.js 18 o superior instalado en tu computadora.
- Una cuenta gratuita de Google (para Firebase).
- Una cuenta gratuita en https://expo.dev (para compilar el APK).

## 2. Crear el backend gratuito (Firebase)

1. Entra a https://console.firebase.google.com y crea un proyecto nuevo.
2. Dentro del proyecto, ve a **Compilación → Authentication → Comenzar**,
   pestaña "Sign-in method", y activa el proveedor **Anónimo**.
3. Ve a **Compilación → Firestore Database → Crear base de datos**
   (modo producción, la región que prefieras).
4. Ve a **Compilación → Storage → Comenzar** (modo producción).
5. En **Configuración del proyecto → General**, baja hasta "Tus apps",
   pulsa el ícono `</>` (Web), regístrala con cualquier nombre y copia el
   objeto `firebaseConfig` que te muestra.
6. Pega esos valores en `src/services/firebase.js`, reemplazando
   `TU_API_KEY`, `TU_PROYECTO`, etc.

### Reglas de seguridad

En **Firestore Database → Reglas**, reemplaza por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

En **Storage → Reglas**, reemplaza por:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Esto permite leer/escribir a cualquiera que haya iniciado sesión anónima
desde la app (es decir, cualquiera que tenga la app instalada). Como es
una app privada para ustedes dos, es suficiente; nadie puede entrar sin
antes pasar tu contraseña dentro de la app.

## 3. Instalar dependencias

```bash
cd nuestra-historia
npm install
npx expo install --fix
```

El segundo comando ajusta automáticamente cualquier versión de paquete
que no calce exactamente con tu versión de Expo.

## 4. Probar la app sin compilar (rápido)

```bash
npx expo start
```

Escanea el código QR con la app **Expo Go** (disponible en Play Store)
desde tu teléfono. Así puedes probar todo antes de generar el APK.

## 5. Generar el APK instalable

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Al terminar, la terminal (y tu cuenta de expo.dev) te dará un enlace de
descarga del `.apk`. Descárgalo en tu teléfono e instálalo (activa
"Permitir instalación de fuentes desconocidas" si Android lo pide).

## 6. Personalizar

- **Nombre de la app**: cambia `"name"` en `app.json`.
- **Logo**: reemplaza `assets/icon.png`, `assets/adaptive-icon.png` y
  `assets/splash.png` por tus propias imágenes (cuadradas, 1024×1024 px
  recomendado) y vuelve a compilar.
- **Colores**: edita `src/theme/colors.js`.
- **Contraseña**: se crea la primera vez que abres la app y se puede
  cambiar luego desde la pestaña "Ajustes".

## Estructura del proyecto

```
App.js                    punto de entrada
src/
  theme/                  colores y tipografías
  context/                estado global (música, bloqueo)
  services/                Firebase, fotos, canciones, momentos, contraseña
  components/              piezas reutilizables (marco de foto, reproductor...)
  screens/                 pantallas de la app
  navigation/              pestañas y navegación
assets/                    icono, splash
```
