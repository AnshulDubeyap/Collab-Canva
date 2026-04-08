'use client';

import { Box } from '@mui/material';
import RegisterForm from '@/src/components/auth/RegisterForm';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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
        background: 'radial-gradient(circle at top left, #0d47a1, #000814)',
        px: 2
      }}
    >
      <RegisterForm />
    </Box>
  );
}
