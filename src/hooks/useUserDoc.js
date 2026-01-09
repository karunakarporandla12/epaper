
// src/hooks/useUserDoc.js
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthUser from './useAuthUser';

/**
 * Loads/saves a single doc using current user uid: {collection}/{uid}
 */
export default function useUserDoc(collection, defaults = {}) {
  const { uid } = useAuthUser();
  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const ref = uid ? doc(db, collection, uid) : null;

  const load = useCallback(async () => {
    if (!ref) return;
    setLoading(true);
    setError('');
    try {
      const snap = await getDoc(ref);
      setData(snap.exists() ? { ...defaults, ...snap.data() } : defaults);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [ref]);

  const save = useCallback(async (partial) => {
    if (!ref) return { ok: false, error: 'No user' };
    setSaving(true);
    setError('');
    try {
      await setDoc(ref, { ...data, ...partial }, { merge: true });
      setData((prev) => ({ ...prev, ...partial }));
      return { ok: true };
    } catch (e) {
      console.error(e);
      setError(e.message);
      return { ok: false, error: e.message };
    } finally {
      setSaving(false);
    }
  }, [ref, data]);

  useEffect(() => { load(); }, [load]);

  return { uid, data, setData, loading, saving, error, save, reload: load };
}