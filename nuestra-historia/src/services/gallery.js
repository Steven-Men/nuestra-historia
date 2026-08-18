import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc as fsDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, ensureSignedIn } from './firebase';

const photosCol = collection(db, 'photos');

export function listenToPhotos(onChange) {
  const q = query(photosCol, orderBy('uploadedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function pickAndUploadPhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Necesitamos permiso para acceder a tus fotos');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });
  if (result.canceled) return null;

  await ensureSignedIn();
  const asset = result.assets[0];
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const filename = `photos/${Date.now()}_${asset.fileName || 'foto.jpg'}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);

  await addDoc(photosCol, {
    url,
    storagePath: filename,
    uploadedAt: Date.now(),
  });
  return url;
}

export async function deletePhoto(photo) {
  await ensureSignedIn();
  await deleteDoc(fsDoc(db, 'photos', photo.id));
  if (photo.storagePath) {
    try {
      await deleteObject(ref(storage, photo.storagePath));
    } catch (e) {
      // el archivo pudo haber sido borrado ya
    }
  }
}
