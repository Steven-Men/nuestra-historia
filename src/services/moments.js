import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db, ensureSignedIn } from './firebase';

const momentsCol = collection(db, 'moments');

export function listenToMoments(onChange) {
  const q = query(momentsCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function captureCurrentLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Necesitamos permiso de ubicación');
  }
  const position = await Location.getCurrentPositionAsync({});
  let label = null;
  try {
    const [place] = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    if (place) label = [place.city, place.region, place.country].filter(Boolean).join(', ');
  } catch (e) {
    // si falla la geocodificación inversa, guardamos solo coordenadas
  }
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    label,
  };
}

export async function addMoment({ text, location }) {
  await ensureSignedIn();
  await addDoc(momentsCol, {
    text: text || '',
    location: location || null,
    createdAt: Date.now(),
  });
}
