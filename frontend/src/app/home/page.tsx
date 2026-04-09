'use client';

import { Box, Container, Typography, Button, Paper } from '@mui/material';
import Navbar from '@/components/common/Navbar';
import ProfileModal from '@/components/profile/ProfileModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Palette, Users, Sparkles } from 'lucide-react';
import CreateRoomModal from '@/components/home/CreateRoomModal';
import { useState } from 'react';

export default function HomePage() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !user) {
        return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }} />;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
            <Navbar />
            <ProfileModal />
            <CreateRoomModal 
                open={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                userName={user?.name || ''} 
            />

            <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 10 },
                        textAlign: 'center',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(255, 235, 59, 0.03))',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography
                            variant="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                mb: 2
                            }}
                        >
                            Welcome, <Typography component="span" variant="inherit" sx={{ background: 'linear-gradient(45deg, #2196f3, #FFEB3B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name.split(' ')[0]}</Typography>
                        </Typography>

                        <Typography variant="h5" color="text.secondary" sx={{ mb: 8, maxWidth: 700, mx: 'auto', fontWeight: 500, lineHeight: 1.6 }}>
                            Your creative journey begins here. Collaborate with artists worldwide or invite your friends to paint together in real-time.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                startIcon={<Plus size={24} />}
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    borderRadius: 100,
                                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                                    textTransform: 'none'
                                }}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Create Room
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                color="inherit"
                                sx={{
                                    py: 2,
                                    px: 6,
                                    fontSize: '1.2rem',
                                    borderRadius: 100,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    textTransform: 'none'
                                }}
                                onClick={() => { }} // Does nothing for now
                            >
                                Join Room
                            </Button>
                        </Box>

                        <Box sx={{ mt: 10, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'primary.main' }}>
                                    <Palette size={24} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>Infinite Canvas</Typography>
                                <Typography variant="body2" color="text.secondary">Never run out of space for your ideas with our seamless infinite canvas technology.</Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(255, 235, 59, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'secondary.main' }}>
                                    <Users size={24} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>Real-time Collab</Typography>
                                <Typography variant="body2" color="text.secondary">See cursors move and strokes appear instantly as your friends draw with you.</Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(156, 39, 176, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: '#ce93d8' }}>
                                    <Sparkles size={24} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>AI Assistant</Typography>
                                <Typography variant="body2" color="text.secondary">Use our built-in AI to generate inspiration or help you complete difficult sections.</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Background decorative elements */}
                    <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(33, 150, 243, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                    <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 235, 59, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
                </Paper>
            </Container>
        </Box>
    );
}
