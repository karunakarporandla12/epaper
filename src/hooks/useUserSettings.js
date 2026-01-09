
// src/hooks/useUserSettings.js
import { useCallback, useEffect, useState } from 'react';
import { collection, addDoc, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthUser from './useAuthUser';

const DEFAULT_META = { leftTab: 'basic', topTab: 'head' };

export default function useUserSettings(sectionKey = 'basic') {
  const { uid, isSignedIn, authReady } = useAuthUser();
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Build the collection ref only when uid is available
  const colRef = uid ? collection(db, 'editions', uid, 'items') : null;

  const loadLatest = useCallback(async () => {
    // If auth hasn't resolved yet, or no uid (and you removed fallback),
    // end loading to avoid infinite spinner and show a friendly state.
    if (!authReady || !colRef) {
      setLoading(false);
      if (authReady && !isSignedIn) {
        setError('Not signed in');
      }
      return;
    }

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

  useEffect(() => {
    loadLatest();
  }, [loadLatest]); // re-run when uid/colRef/authReady changes

  const save = async (payload, meta = DEFAULT_META) => {
    if (!colRef) return { ok: false, error: 'No user/collection' };
    setSaving(true);
    setError('');
    try {
      const data = {
        ...payload,
        section: sectionKey,
        leftTab: meta.leftTab ?? DEFAULT_META.leftTab,
        topTab: meta.topTab ?? DEFAULT_META.topTab,
        updatedAt: serverTimestamp(),
      };
      await addDoc(colRef, data);
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
