'use client';

import { useEffect, useRef, useState, use } from 'react';
import { Box, Paper, Typography, AppBar, Toolbar, IconButton, Tooltip, CircularProgress, Container } from '@mui/material';
import { socket } from '@/api/socket';
import { Canvas, Circle, Rect, PencilBrush } from 'fabric';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Square, Circle as CircleIcon, MousePointer2, Eraser, Users } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { getRoomDetails, Room } from '@/api/roomService';
import LobbyView from '@/components/canvas/LobbyView';

interface CanvasPageProps {
  params: Promise<{ roomId: string }>;
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const { roomId } = use(params);
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  
  // Room State
  const [room, setRoom] = useState<Room | null>(null);
  const [readyUsers, setReadyUsers] = useState<string[]>([]);
  const [joinedUsers, setJoinedUsers] = useState<{ id: string, name: string }[]>([]);
  const [status, setStatus] = useState<'WAITING' | 'ACTIVE'>('WAITING');
  
  // Canvas Refs & State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pencil' | 'rect' | 'circle'>('pencil');

  // 0. Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/canvas/${roomId}`);
    }
  }, [isLoading, isAuthenticated, router, roomId]);

  // 1. Fetch Room Details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const details = await getRoomDetails(roomId);
        setRoom(details);
        setStatus(details.status as 'WAITING' | 'ACTIVE');
      } catch (error) {
        console.error('Failed to fetch room:', error);
        router.push('/home');
      }
    };

    fetchRoom();
  }, [roomId, router]);

  // 2. Setup Socket Connection
  useEffect(() => {
    if (!user) return;

    socket.emit('join-room', { roomId, user: { id: user.id, name: user.name } });

    socket.on('presence-update', (users: { id: string, name: string }[]) => {
      setJoinedUsers(users);
    });

    socket.on('ready-update', (users: string[]) => {
      setReadyUsers(users);
    });

    socket.on('start-canvas', () => {
      setStatus('ACTIVE');
    });

    socket.on('draw-data', (objectData: any) => {
      if (fabricCanvas.current) {
        fabricCanvas.current.loadFromJSON(objectData, () => fabricCanvas.current?.renderAll());
      }
    });

    return () => {
      socket.off('presence-update');
      socket.off('ready-update');
      socket.off('start-canvas');
      socket.off('draw-data');
    };
  }, [roomId, user]);


  // 2. Initialize Fabric Canvas when status becomes ACTIVE
  useEffect(() => {
    if (status !== 'ACTIVE' || !canvasRef.current || fabricCanvas.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth - 80,
      height: window.innerHeight - 100,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    fabricCanvas.current = canvas;

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = '#2196f3';

    canvas.on('object:added', (e) => {
      if (e.target && !e.target.get('remote')) {
        socket.emit('draw-data', { roomId, object: canvas.toJSON() });
      }
    });

    return () => {
      canvas.dispose();
      fabricCanvas.current = null;
    };
  }, [status, roomId]);

  const handleReady = () => {
    if (user?.id) {
      socket.emit('lobby-ready', { roomId, userId: user.id });
    }
  };

  const setTool = (tool: 'select' | 'pencil' | 'rect' | 'circle') => {
    setActiveTool(tool);
    if (!fabricCanvas.current) return;

    const canvas = fabricCanvas.current;
    canvas.isDrawingMode = tool === 'pencil';

    if (tool === 'rect') {
      const rect = new Rect({
        left: 100, top: 100, fill: 'transparent', stroke: '#2196f3', strokeWidth: 2, width: 100, height: 100,
      });
      canvas.add(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 150, top: 150, fill: 'transparent', stroke: '#FFEB3B', strokeWidth: 2, radius: 50,
      });
      canvas.add(circle);
    }
  };

  if (isLoading || !room || !user) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>Loading Collab Canva...</Typography>
      </Box>
    );
  }

  // LOBBY VIEW
  if (status === 'WAITING') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Toolbar variant="dense">
            <IconButton onClick={() => router.push('/home')} sx={{ mr: 2 }}><ArrowLeft /></IconButton>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 800 }}>Lobby</Typography>
          </Toolbar>
        </AppBar>
        <LobbyView 
          roomName={room.name}
          userName={user.name}
          invitedUsers={room.invitedUsers || []}
          joinedUsers={joinedUsers}
          readyUsers={readyUsers}
          userId={user.id}
          onReady={handleReady}
        />
      </Box>
    );
  }

  // CANVAS VIEW
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Toolbar variant="dense">
          <IconButton onClick={() => router.push('/home')} sx={{ mr: 2 }}><ArrowLeft /></IconButton>
          <Typography variant="h6" color="text.primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {room.name} <Typography component="span" variant="caption" color="success.main" sx={{ ml: 1, fontWeight: 800 }}>● LIVE</Typography>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
            <Users size={20} />
            <Typography variant="body2">Collaborating</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Paper elevation={0} sx={{ width: 64, m: 1, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, gap: 1, border: '1px solid rgba(0,0,0,0.05)' }}>
          <Tooltip title="Select" placement="right">
            <IconButton color={activeTool === 'select' ? 'primary' : 'default'} onClick={() => setTool('select')}><MousePointer2 /></IconButton>
          </Tooltip>
          <Tooltip title="Pencil" placement="right">
            <IconButton color={activeTool === 'pencil' ? 'primary' : 'default'} onClick={() => setTool('pencil')}><Eraser /></IconButton>
          </Tooltip>
          <Tooltip title="Rectangle" placement="right">
             <IconButton color={activeTool === 'rect' ? 'primary' : 'default'} onClick={() => setTool('rect')}><Square /></IconButton>
          </Tooltip>
          <Tooltip title="Circle" placement="right">
            <IconButton color={activeTool === 'circle' ? 'primary' : 'default'} onClick={() => setTool('circle')}><CircleIcon /></IconButton>
          </Tooltip>
        </Paper>

        <Box sx={{ flexGrow: 1, position: 'relative', m: 1, overflow: 'hidden', borderRadius: 3, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)', bgcolor: '#fff' }}>
          <canvas ref={canvasRef} />
        </Box>
      </Box>
    </Box>
  );
}
