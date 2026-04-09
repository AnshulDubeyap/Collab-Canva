import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  roomId: string; // Unique human-readable or UUID for URLs
  name: string;
  owner: mongoose.Types.ObjectId;
  invitedUsers: string[]; // Store email addresses of invited friends
  status: 'WAITING' | 'ACTIVE';
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invitedUsers: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['WAITING', 'ACTIVE'],
      default: 'WAITING',
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRoom>('Room', roomSchema);
