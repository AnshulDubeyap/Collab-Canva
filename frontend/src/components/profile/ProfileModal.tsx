'use client';

import { Modal, Box, Typography, TextField, Button, Avatar, IconButton, Divider } from '@mui/material';
import { X, User, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useUiStore } from '@/src/store/useUiStore';
import { useState, useEffect } from 'react';
import api from '@/src/services/api';
// Global toast is now handled by useUiStore

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
  p: 4,
  outline: 'none',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

export default function ProfileModal() {
  const { user, setUser } = useAuthStore();
  const { isProfileModalOpen, closeProfileModal, showToast } = useUiStore();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Email change flow states
  const [emailMode, setEmailMode] = useState<'idle' | 'requesting' | 'verifying'>('idle');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (!name.trim() || name === user?.name) return;
    setLoading(true);
    try {
      const res = await api.put('/users/profile', { name });
      setUser(res.data.user);
      showToast('Name updated successfully', 'success');
    } catch (err) { } finally {
      setLoading(false);
    }
  };

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    try {
        await api.post('/users/request-email-change', { newEmail, currentPassword });
        showToast('Verification token sent to your new email!', 'success');
        setEmailMode('verifying');
    } catch (err) {} finally {
        setLoading(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!verificationToken.trim()) return;
    setLoading(true);
    try {
        await api.post('/users/verify-email-change', { token: verificationToken });
        showToast('Email updated successfully!', 'success');
        
        // Refresh profile to get new email
        const res = await api.get('/users/profile');
        setUser(res.data.user);
        
        setEmailMode('idle');
        setNewEmail('');
        setCurrentPassword('');
    } catch (err) {} finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal open={isProfileModalOpen} onClose={closeProfileModal} closeAfterTransition>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Account Settings</Typography>
          <IconButton onClick={closeProfileModal} size="small" sx={{ color: 'text.secondary' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, gap: 2 }}>
          <Avatar 
            src={user.avatar} 
            sx={{ 
                width: 90, 
                height: 90, 
                bgcolor: 'secondary.main', 
                color: 'secondary.contrastText', 
                fontSize: '2.5rem',
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }}
          >
            {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </Avatar>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4, opacity: 0.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Display Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Button 
                    size="small" 
                    variant="text" 
                    onClick={handleUpdateName}
                    disabled={loading || !name.trim() || name === user.name}
                    sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                >
                    Update Name
                </Button>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.3 }} />

            <Box>
                <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                    Security & Email
                </Typography>
                
                {emailMode === 'idle' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Primary Email</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{user.email}</Typography>
                        </Box>
                        <Button size="small" variant="outlined" onClick={() => setEmailMode('requesting')} sx={{ borderRadius: 2 }}>
                            Change
                        </Button>
                    </Box>
                )}

                {emailMode === 'requesting' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="New Email Address"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                        {!user.googleId && (
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                variant="outlined"
                                size="small"
                            />
                        )}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button fullWidth variant="contained" onClick={handleRequestEmailChange} disabled={loading}>
                                {loading ? 'Requesting...' : 'Request Change'}
                            </Button>
                            <Button variant="text" color="inherit" onClick={() => setEmailMode('idle')}>Cancel</Button>
                        </Box>
                    </Box>
                )}

                {emailMode === 'verifying' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="body2" color="info.main">Check your new email for the token!</Typography>
                        <TextField
                            fullWidth
                            label="Verification Token"
                            value={verificationToken}
                            onChange={(e) => setVerificationToken(e.target.value)}
                            variant="outlined"
                            size="small"
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button fullWidth variant="contained" color="success" onClick={handleVerifyEmailChange} disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Update'}
                            </Button>
                            <Button variant="text" color="inherit" onClick={() => setEmailMode('idle')}>Cancel</Button>
                        </Box>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                    <Shield size={16} />
                    <Typography variant="body2">Role: <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>{user.role}</Typography></Typography>
                 </Box>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
                    <Mail size={16} />
                    <Typography variant="body2">Account Type: {user.googleId ? 'Google Account' : 'Standard Email'}</Typography>
                 </Box>
            </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 5 }}>
            <Button 
                fullWidth 
                variant="outlined" 
                onClick={closeProfileModal}
                sx={{ color: 'text.primary', borderColor: 'rgba(255,255,255,0.1)' }}
            >
                Close
            </Button>
        </Box>
      </Box>
    </Modal>
  );
}
