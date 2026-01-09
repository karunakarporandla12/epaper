
// src/hooks/useEditionDoc.js
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // <-- adjust path if your firebase file is elsewhere
import useAuthReady from './useAuthReady';

export default function useEditionDoc(uid, editionId) {
    const authReady = useAuthReady();
    const [edition, setEdition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid || !editionId) {
            setEdition(null);
            setLoading(false);
            setError('Missing uid or editionId');
            return;
        }
        if (!authReady) return;

        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const ref = doc(db, 'editions', uid, 'items', editionId);
                const snap = await getDoc(ref);
                if (!snap.exists()) throw new Error('Edition not found or access denied');
                const data = snap.data();
                if (mounted) setEdition({ id: editionId, uid, ...data });
            } catch (e) {
                if (mounted) setError(e.message || String(e));
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [uid, editionId, authReady]);

    return { edition, loading, error };
}
