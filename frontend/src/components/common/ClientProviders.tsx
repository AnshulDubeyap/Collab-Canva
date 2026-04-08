'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { ReactNode, useEffect } from 'react';
import GlobalToast from './GlobalToast';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalToast />
      {children}
    </ThemeProvider>
  );
}
