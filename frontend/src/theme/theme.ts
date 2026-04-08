import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3', // Blue
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFEB3B', // Nanobana Yellow
      light: '#FFFF72',
      dark: '#C8B900',
      contrastText: '#000',
    },
    background: {
      default: '#000814', // Deep Midnight Blue
      paper: '#001D3D',  // Mid-depth Midnight Blue
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: 'inherit',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(255, 235, 59, 0.3)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
                 backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }
          },
        },
      },
    },
  },
});

export default theme;
