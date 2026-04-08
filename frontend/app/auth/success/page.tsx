'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import api from '@/src/services/api';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUiStore } from '@/src/store/useUiStore';

export default function AuthSuccessPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { showToast } = useUiStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Attempt to fetch profile assuming cookies are set by the backend callback
        const res = await api.get('/users/profile');
        setUser(res.data.user);
        showToast('Successfully logged in with Google!', 'success');
        router.push('/home');
      } catch (err) {
        console.error('Google Auth Success Error:', err);
        showToast('Authentication failed. Please try again.', 'error');
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router, setUser]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        bgcolor: 'background.default'
      }}
    >
      <CircularProgress color="secondary" thickness={5} size={60} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Finalizing Authentication</Typography>
        <Typography variant="body1" color="text.secondary">Securing your creative workspace...</Typography>
      </Box>
    </Box>
  );
}
