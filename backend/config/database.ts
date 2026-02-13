import mongoose from 'mongoose';
import Logger from '../utils/logger';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL as string);
    Logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    Logger.error(`MongoDB Connection Failed: ${error.message}`);
    Logger.warn('Server will continue without database. Auth features requiring DB will fail.');
  }
};

export default connectDB;
