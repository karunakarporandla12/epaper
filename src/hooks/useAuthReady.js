
// src/hooks/useAuthReady.js
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

/** Waits until Firebase Auth session is restored in the tab. */
export default function useAuthReady() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, () => setReady(true));
        return () => unsub();
    }, []);
    return ready;
}
