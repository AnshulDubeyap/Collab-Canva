'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/src/store/useAuthStore';
import api from '@/src/services/api';

export default function AuthInitializer() {
  const { setUser, setLoading } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const checkSession = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        // If 401 or network error, just stop loading
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, setLoading]);

  return null; // This component doesn't render anything
}
