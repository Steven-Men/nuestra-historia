import * as Crypto from 'expo-crypto';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, ensureSignedIn } from './firebase';

const lockDocRef = () => doc(db, 'config', 'appLock');

async function hash(text) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

// Si nadie ha configurado una contraseña todavía, la app pide crear una.
export async function getLockStatus() {
  await ensureSignedIn();
  const snap = await getDoc(lockDocRef());
  return { configured: snap.exists() };
}

export async function setupPassword(newPassword) {
  await ensureSignedIn();
  const passwordHash = await hash(newPassword);
  await setDoc(lockDocRef(), { passwordHash, updatedAt: Date.now() });
}

export async function verifyPassword(candidate) {
  await ensureSignedIn();
  const snap = await getDoc(lockDocRef());
  if (!snap.exists()) return false;
  const candidateHash = await hash(candidate);
  return candidateHash === snap.data().passwordHash;
}

export async function changePassword(currentPassword, newPassword) {
  const ok = await verifyPassword(currentPassword);
  if (!ok) throw new Error('La contraseña actual no es correcta');
  await setupPassword(newPassword);
}
