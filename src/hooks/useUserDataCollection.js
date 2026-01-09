
// src/hooks/useUserDataCollection.js
import { useCallback, useEffect, useState } from 'react';
import { collection, addDoc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthUser from './useAuthUser';

export default function useUserDataCollection(sectionKey = 'basic') {
  const { uid, isSignedIn, authReady, email, displayName } = useAuthUser();
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const colRef = uid ? collection(db, 'editions', uid, 'data') : null;

  const loadLatest = useCallback(async () => {
    if (!authReady) { setLoading(false); return; }
    if (!isSignedIn || !colRef) { setLoading(false); setError('Not signed in'); return; }

    setLoading(true);
    setError('');
    try {
      const q = query(colRef, orderBy('updatedAt', 'desc'), limit(1));
      const snap = await getDocs(q);
      setLatest(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [colRef, authReady, isSignedIn]);

  useEffect(() => { loadLatest(); }, [loadLatest]);

  const save = async (payload, meta = {}) => {
    if (!isSignedIn || !colRef) return { ok: false, error: 'No user/collection' };
    setSaving(true);
    setError('');
    try {
      const data = {
        ...payload,
        section: sectionKey,
        user: { uid, email: email ?? null, displayName: displayName ?? null },
        updatedAt: serverTimestamp(),
        ...meta,
      };
      await addDoc(colRef, data);           // <-- editions/{uid}/data/{autoDocId}
      setLatest(data);
      return { ok: true };
    } catch (e) {
      console.error(e);
      setError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setSaving(false);
    }
  };

  return { uid, latest, loading, saving, error, save, reload: loadLatest, isSignedIn, authReady };
}
