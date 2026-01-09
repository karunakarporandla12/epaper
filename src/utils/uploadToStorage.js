
// src/utils/uploadToStorage.js
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

export async function uploadIfFile(uid, file, filenameBase) {
  if (!file || !uid) return null;
  const ext = file.name?.split('.').pop()?.toLowerCase() || 'png';
  const storageRef = ref(storage, `editions/${uid}/assets/${filenameBase}.${ext}`);
  const snap = await uploadBytes(storageRef, file);
  return await getDownloadURL(snap.ref);
}
