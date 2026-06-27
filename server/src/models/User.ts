import { Schema, model, type Document } from 'mongoose';

export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['CUSTOMER', 'SELLER', 'ADMIN'], default: 'CUSTOMER' },
    avatar: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
