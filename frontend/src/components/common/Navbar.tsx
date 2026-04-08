'use client';

import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box, Tooltip } from '@mui/material';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUiStore } from '@/src/store/useUiStore';
import api from '@/src/services/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { openProfileModal, showToast } = useUiStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch (err) {
      showToast('Logout failed', 'error');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      backgroundColor: 'rgba(0, 8, 20, 0.8)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      zIndex: (theme) => theme.zIndex.drawer + 1
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        <Box 
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'opacity 0.2s', '&:hover': { opacity: 0.8 } }} 
          onClick={() => router.push('/home')}
        >
           <Image src="/logo.png" alt="CollabCanva" width={40} height={40} style={{ objectFit: 'contain' }} />
           <Typography variant="h6" sx={{ ml: 1.5, fontWeight: 800, background: 'linear-gradient(45deg, #2196f3, #FFEB3B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: { xs: 'none', sm: 'block' } }}>
             CollabCanva
           </Typography>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Tooltip title="Profile Settings">
              <IconButton onClick={openProfileModal} sx={{ p: 0.5, border: '2px solid transparent', transition: 'border-color 0.2s', '&:hover': { borderColor: 'secondary.main' } }}>
                <Avatar 
                  src={user.avatar} 
                  sx={{ width: 38, height: 38, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  {getInitials(user.name)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Button 
              variant="text" 
              color="inherit" 
              onClick={handleLogout}
              startIcon={<LogOut size={18} />}
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, display: { xs: 'none', sm: 'flex' } }}
            >
              Logout
            </Button>
            
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{ display: { xs: 'flex', sm: 'none' }, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
            >
              <LogOut size={20} />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
