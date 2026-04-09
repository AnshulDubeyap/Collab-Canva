'use client';

import { Box } from '@mui/material';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegisterContent() {
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
        background: 'radial-gradient(circle at top left, #0d47a1, #000814)',
        px: 2
      }}
    >
      <RegisterForm redirect={redirect} />
    </Box>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Box sx={{ height: '100vh', bgcolor: '#000814' }} />}>
      <RegisterContent />
    </Suspense>
  );
}
