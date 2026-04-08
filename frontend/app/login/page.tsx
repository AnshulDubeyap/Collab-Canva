'use client';

import { Box, Container } from '@mui/material';
import LoginForm from '@/src/components/auth/LoginForm';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #1a237e, #000814)',
        px: 2
      }}
    >
      <LoginForm />
    </Box>
  );
}
