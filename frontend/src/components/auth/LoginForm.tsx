'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, Link as MuiLink, Paper, Divider, InputAdornment, IconButton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUiStore } from '@/src/store/useUiStore';
import api from '@/src/services/api';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { showToast } = useUiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.user);
      showToast('Login successful!', 'success');
      router.push('/home');
    } catch (err: any) {
       // Global interceptor handles error toasts now
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/auth/google`;
  };

  return (
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
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 900, textAlign: 'center' }}>Welcome to Collab Canva</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Please login or register to unleash your creativity with friends
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
        <TextField 
          fullWidth label="Password" type={showPassword ? 'text' : 'password'} margin="normal" variant="outlined"
          value={password} onChange={(e) => setPassword(e.target.value)} required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} opacity={0.5} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <MuiLink component={Link} href="/forgot-password" variant="body2" color="secondary" underline="hover">
                Forgot password?
            </MuiLink>
        </Box>

        <Button 
          fullWidth type="submit" variant="contained" size="large" disableElevation
          sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem', background: 'linear-gradient(45deg, #2196f3, #1565c0)' }} 
          disabled={loading}
        >
          {loading ? 'Entering...' : 'Sign In'}
        </Button>
      </form>

      <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.8rem' }}>OR CONTINUE WITH</Divider>

      <Button 
        fullWidth variant="outlined" size="large" onClick={handleGoogleLogin}
        startIcon={<Image src="/google-g.png" alt="Google" width={22} height={22} />}
        sx={{ 
            mb: 3, 
            borderColor: 'rgba(255,255,255,0.1)', 
            color: 'text.primary',
            py: 1.2,
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.2)',
              bgcolor: 'rgba(255,255,255,0.03)'
            }
        }}
      >
        Google Account
      </Button>

      <Typography variant="body2" align="center" color="text.secondary">
        Don't have an account? {' '}
        <MuiLink component={Link} href="/register" underline="hover" color="secondary" sx={{ fontWeight: 600 }}>
            Create one now
        </MuiLink>
      </Typography>
    </Paper>
  );
}
