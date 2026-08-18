import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1) Ve a https://console.firebase.google.com, crea un proyecto gratuito.
// 2) Agrega una app "Web" dentro del proyecto y copia aquí sus datos.
// 3) Activa Authentication -> Sign-in method -> Anonymous.
// 4) Activa Firestore Database y Storage (modo producción) y aplica las
//    reglas que están en el README de este proyecto.
const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROYECTO.firebaseapp.com',
  projectId: 'TU_PROYECTO',
  storageBucket: 'TU_PROYECTO.appspot.com',
  messagingSenderId: 'TU_SENDER_ID',
  appId: 'TU_APP_ID',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // En Fast Refresh durante desarrollo, initializeAuth puede llamarse dos
  // veces; en ese caso recuperamos la instancia ya creada.
  auth = getAuth(app);
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export { auth };

export const ensureSignedIn = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        if (user) return resolve(user);
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user))
          .catch(reject);
      },
      reject
    );
  });
