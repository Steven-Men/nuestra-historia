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
import * as DocumentPicker from 'expo-document-picker';
import { db, storage, ensureSignedIn } from './firebase';

const songsCol = collection(db, 'songs');

export function listenToSongs(onChange) {
  const q = query(songsCol, orderBy('uploadedAt', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function pickAndUploadSong() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;

  await ensureSignedIn();
  const asset = result.assets[0];
  const response = await fetch(asset.uri);
  const blob = await response.blob();
  const filename = `songs/${Date.now()}_${asset.name}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);

  await addDoc(songsCol, {
    url,
    title: asset.name.replace(/\.[^/.]+$/, ''),
    storagePath: filename,
    uploadedAt: Date.now(),
  });
  return url;
}

export async function deleteSong(song) {
  await ensureSignedIn();
  await deleteDoc(fsDoc(db, 'songs', song.id));
  if (song.storagePath) {
    try {
      await deleteObject(ref(storage, song.storagePath));
    } catch (e) {
      // el archivo pudo haber sido borrado ya
    }
  }
}
