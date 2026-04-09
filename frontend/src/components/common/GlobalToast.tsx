'use client';

import { Snackbar, Alert } from '@mui/material';
import { useUiStore } from '@/store/useUiStore';

export default function GlobalToast() {
  const { toast, hideToast } = useUiStore();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideToast();
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert 
        onClose={handleClose} 
        severity={toast.severity} 
        variant="filled"
        sx={{ 
          width: '100%', 
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          color: '#fff',
          fontWeight: 600,
          '& .MuiAlert-icon': {
            color: '#fff'
          }
        }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
