import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { X, UserPlus, Mail } from 'lucide-react';
import { createRoom } from '@/api/roomService';
import { useRouter } from 'next/navigation';

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  userName: string;
}

export default function CreateRoomModal({ open, onClose, userName }: CreateRoomModalProps) {
  const router = useRouter();
  const [name, setName] = useState(`${userName}'s Creative Space`);
  const [isPrivate, setIsPrivate] = useState(true);
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(currentEmail)) {
        setEmails([...emails, currentEmail]);
        setCurrentEmail('');
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const room = await createRoom(name, isPrivate, emails);
      router.push(`/canvas/${room.roomId}`);
      onClose();
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 4, bgcolor: 'background.paper', p: 1 } }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create Room
        <IconButton onClick={onClose} size="small"><X /></IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Room Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Brainstorming Session"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <FormControlLabel
            control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} color="primary" />}
            label="Private Room (Only invited users can join)"
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Mail size={16} /> Invite Friends
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Friend's Email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                placeholder="email@example.com"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <Button variant="outlined" onClick={handleAddEmail} startIcon={<UserPlus size={18} />} sx={{ borderRadius: 3, px: 3 }}>
                Add
              </Button>
            </Box>

            <List sx={{ mt: 1 }}>
              {emails.map((email, index) => (
                <ListItem key={email} sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2, mb: 1 }}>
                  <ListItemText primary={email} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => handleRemoveEmail(index)}>
                      <X size={16} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {emails.length === 0 && (
                <Typography variant="caption" color="text.secondary">No friends invited yet. You can also invite them later.</Typography>
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleCreate} 
          disabled={loading}
          sx={{ 
            borderRadius: 100, 
            px: 6, 
            py: 1.5, 
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)'
          }}
        >
          {loading ? 'Creating...' : 'Create & Start Session'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
