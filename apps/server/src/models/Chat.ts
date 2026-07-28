import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessageDoc {
  _id?: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  originalContent?: string;
  isTranslated: boolean;
  deleted: boolean;
  timestamp: Date;
}

export interface IChatDocument extends Document {
  participants: Types.ObjectId[];
  callPermissionGrantedBy: Types.ObjectId[];
  messages: IMessageDoc[];
  lastMessageAt: Date;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  originalContent: { type: String },
  isTranslated: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
}, { _id: true });

const ChatSchema = new Schema<IChatDocument>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    callPermissionGrantedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    messages: [MessageSchema],
    lastMessageAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model<IChatDocument>('Chat', ChatSchema);
export const Chat = ChatModel; // alias used in socket handlers
