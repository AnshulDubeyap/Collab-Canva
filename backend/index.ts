import app from './app';
import Logger from './utils/logger';

import connectDB from './config/database';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Connect to Database
connectDB();

const server = app.listen(PORT, () => {
  Logger.info(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  Logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    Logger.info('HTTP server closed');
  });
});
