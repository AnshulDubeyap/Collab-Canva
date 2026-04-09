'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Link as MuiLink, Container, InputAdornment } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/api/api';
import { useUiStore } from '@/store/useUiStore';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useUiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      showToast('Reset code sent to your email!', 'success');
      router.push('/reset-password');
    } catch (err: any) {
      // Global interceptor handles errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4
    }}>
      <Paper elevation={0} sx={{ 
        p: { xs: 3, sm: 5 }, 
        width: '100%', 
        maxWidth: 450, 
        bgcolor: 'background.paper', 
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Image src="/logo.png" alt="Logo" width={64} height={64} style={{ borderRadius: '12px' }} />
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 900, textAlign: 'center' }}>Forgot Password</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Enter your email to receive a password reset token
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth label="Email Address" margin="normal" variant="outlined" 
            value={email} onChange={(e) => setEmail(e.target.value)} required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} opacity={0.5} />
                  </InputAdornment>
                ),
              }
            }}
          />

          <Button 
            fullWidth type="submit" variant="contained" size="large" disableElevation
            sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem', background: 'linear-gradient(45deg, #2196f3, #1565c0)' }} 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <MuiLink 
              component={Link} 
              href="/login" 
              sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
                <ArrowLeft size={16} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Back to Login</Typography>
            </MuiLink>
        </Box>
      </Paper>
    </Container>
  );
}
