'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, Link as MuiLink, Paper, InputAdornment, IconButton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/src/services/api';
import { useUiStore } from '@/src/store/useUiStore';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useUiStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, confirmPassword });
      showToast('Account created! Please login.', 'success');
      router.push('/login');
    } catch (err: any) {
       // Global interceptor handles the toast
    } finally {
      setLoading(false);
    }
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
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 900, textAlign: 'center' }}>Join Collab Canva</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Start collaborating and making art together
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField 
          fullWidth label="Full Name" margin="normal" variant="outlined" 
          value={name} onChange={(e) => setName(e.target.value)} required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <User size={18} opacity={0.5} />
                </InputAdornment>
              ),
            }
          }}
        />
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
        <TextField 
          fullWidth label="Confirm Password" type={showPassword ? 'text' : 'password'} margin="normal" variant="outlined"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
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
        
        <Button 
          fullWidth type="submit" variant="contained" size="large" disableElevation
          color="secondary"
          sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 700 }} 
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Get Started'}
        </Button>
      </form>

      <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 3 }}>
        Already have an account? {' '}
        <MuiLink component={Link} href="/login" underline="hover" color="primary" sx={{ fontWeight: 600 }}>
            Log in
        </MuiLink>
      </Typography>
    </Paper>
  );
}
