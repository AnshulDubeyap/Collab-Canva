'use client';

import { Box } from '@mui/material';
import LoginForm from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/home';

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, redirect]);

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
      <LoginForm redirect={redirect} />
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box sx={{ height: '100vh', bgcolor: '#000814' }} />}>
      <LoginContent />
    </Suspense>
  );
}
