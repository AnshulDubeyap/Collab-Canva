'use client';

import { Modal, Box, Typography, TextField, Button, Avatar, IconButton, Divider } from '@mui/material';
import { X, User, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';
import { useState, useEffect } from 'react';
import api from '@/api/api';
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
  border: '1px solid rgba(255, 255, 255, 0.05)',
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
    } catch (err) { } finally {
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
    } catch (err) { } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal open={isProfileModalOpen} onClose={closeProfileModal} closeAfterTransition>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>Account Settings</Typography>
          <IconButton onClick={closeProfileModal} size="small" sx={{ color: 'text.secondary' }}>
            <X size={20} />
          </IconButton>
        </Box>

        {/* Unified Content Area (Scrollable) */}
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' } }}>
          {/* Section 1: Basic Profile */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 1.5 }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  fontSize: '2rem',
                  fontWeight: 700,
                }}
              >
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              </Box>
            </Box>

            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, letterSpacing: 1.5 }}>
              Personal Info
            </Typography>
            <TextField
              fullWidth
              label="Display Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleUpdateName}
              disabled={loading || !name.trim() || name === user.name}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Update Name
            </Button>
          </Box>

          <Divider sx={{ mb: 3, opacity: 0.1 }} />

          {/* Section 2: Security & Credentials */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, letterSpacing: 1.5 }}>
              Account Credentials
            </Typography>

            {emailMode === 'idle' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2.5, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Current Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.email}</Typography>
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
                  <Button fullWidth variant="contained" onClick={handleRequestEmailChange} disabled={loading} size="small">
                    {loading ? 'Requesting...' : 'Request Code'}
                  </Button>
                  <Button variant="text" color="inherit" onClick={() => setEmailMode('idle')} size="small">Cancel</Button>
                </Box>
              </Box>
            )}

            {emailMode === 'verifying' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="caption" color="info.main">Verification code sent to {newEmail}</Typography>
                <TextField
                  fullWidth
                  label="6-Digit Code"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button fullWidth variant="contained" color="success" onClick={handleVerifyEmailChange} disabled={loading} size="small">
                    {loading ? 'Verifying...' : 'Verify Now'}
                  </Button>
                  <Button variant="text" color="inherit" onClick={() => setEmailMode('idle')} size="small">Cancel</Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Section 3: Status Badges (Simplified) */}
          <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.02)', p: 1, px: 1.5, borderRadius: 2, flex: 1 }}>
              <Shield size={14} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{user.role.toUpperCase()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', bgcolor: 'rgba(255,255,255,0.02)', p: 1, px: 1.5, borderRadius: 2, flex: 2 }}>
              <User size={14} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{user.googleId ? 'GOOGLE AUTH' : 'SECURE EMAIL'}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={closeProfileModal}
            sx={{ py: 1, color: 'text.secondary', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
          >
            Close Settings
          </Button>
        </Box>

      </Box>
    </Modal>
  );
}
