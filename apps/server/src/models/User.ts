import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserDocument extends Document {
  phoneNumber?: string;
  email?: string;
  displayName: string;
  avatar: string;
  nativeLanguage: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  walletBalance: number;
  promoStrikes: number;
  nsfwStrikes: number;
  isBanned: boolean;
  banUntil: Date | null;
  blockedUsers: Types.ObjectId[];
  interests: string[];
  languageFilter: string | null;
  genderFilter: 'male' | 'female' | 'other' | 'prefer_not_to_say' | 'any';
  fcmToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    phoneNumber: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    displayName: { type: String, required: true },
    avatar: { type: String, default: '' },
    nativeLanguage: { type: String, default: 'en' },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    walletBalance: { type: Number, default: 0, min: 0 },
    promoStrikes: { type: Number, default: 0 },
    nsfwStrikes: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    banUntil: { type: Date, default: null },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    interests: [{ type: String }],
    languageFilter: { type: String, default: null },
    genderFilter: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say', 'any'],
      default: 'any',
    },
    fcmToken: { type: String, default: null },
  },
  { timestamps: true }
);

// Named exports for both import styles
export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
export const User = UserModel; // alias used in socket handlers
