import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Container, Avatar, Badge } from '@mui/material';
import { Users, Lock, ChevronRight } from 'lucide-react';

interface LobbyViewProps {
  roomName: string;
  userName: string;
  invitedUsers: string[];
  joinedUsers: { id: string, name: string }[];
  readyUsers: string[];
  userId: string;
  onReady: () => void;
}

export default function LobbyView({ roomName, userName, invitedUsers, joinedUsers, readyUsers, userId, onReady }: LobbyViewProps) {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const isUserReady = readyUsers.includes(userId);

  const startHold = () => {
    if (isUserReady) return;
    setIsHolding(true);
    holdInterval.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdInterval.current!);
          onReady();
          return 100;
        }
        return prev + 2; 
      });
    }, 30);
  };

  const stopHold = () => {
    setIsHolding(false);
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
    }
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Paper elevation={0} sx={{ p: 6, borderRadius: 8, textAlign: 'center', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'white' }}>
            <Lock size={32} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>{roomName}</Typography>
          <Typography variant="body1" color="text.secondary">Waiting Room</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 6, mb: 8 }}>
          {joinedUsers.map((u) => {
            const isReady = readyUsers.includes(u.id);
            const isMe = u.id === userId;
            
            return (
              <Box key={u.id} sx={{ textAlign: 'center' }}>
                <Badge 
                  overlap="circular" 
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box sx={{ 
                      width: 14, 
                      height: 14, 
                      borderRadius: '50%', 
                      bgcolor: isReady ? '#4caf50' : '#ff9800', 
                      border: '2px solid white' 
                    }} />
                  }
                >
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: isMe ? 'primary.light' : 'grey.300', 
                    fontSize: '2rem',
                    fontWeight: 700,
                    boxShadow: isReady ? '0 0 20px rgba(76, 175, 80, 0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {u.name[0]}
                  </Avatar>
                </Badge>
                <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>
                  {isMe ? 'You' : u.name}
                </Typography>
                <Typography variant="caption" color={isReady ? 'success.main' : 'warning.main'}>
                  {isReady ? 'Ready' : 'Joined'}
                </Typography>
              </Box>
            );
          })}

          {joinedUsers.length < 2 && (
            <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.100', fontSize: '2rem' }}>?</Avatar>
              <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700 }}>Waiting...</Typography>
              <Typography variant="caption">Invite sent</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={holdProgress}
            size={160}
            thickness={4}
            sx={{ color: '#2196f3', position: 'absolute', top: -5, left: -5, zIndex: 1 }}
          />
          <Button
            variant="contained"
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={startHold}
            onTouchEnd={stopHold}
            disabled={isUserReady}
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              fontSize: '1.2rem',
              fontWeight: 800,
              textTransform: 'none',
              bgcolor: isUserReady ? '#4caf50' : (isHolding ? '#1976d2' : '#2196f3'),
              '&:hover': { bgcolor: isUserReady ? '#4caf50' : '#1976d2' },
              boxShadow: isHolding ? '0 0 40px rgba(33, 150, 243, 0.5)' : '0 8px 32px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.2s',
              zIndex: 2
            }}
          >
            {isUserReady ? 'READY' : (isHolding ? 'HOLDING...' : 'HOLD TO JOIN')}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, maxWidth: 400, mx: 'auto' }}>
          Both users must hold the join button for 3 seconds to unlock the canvas and start collaborating.
        </Typography>
      </Paper>
    </Container>
  );
}
