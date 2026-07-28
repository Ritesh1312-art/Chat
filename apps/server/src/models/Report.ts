import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReportDocument extends Document {
  reporterId: Types.ObjectId;
  targetId: Types.ObjectId;
  type: 'nsfw' | 'spam' | 'panic' | 'link_promo' | 'other';
  description?: string;
  evidence?: string;
  details?: Record<string, any>;
  actionTaken?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReportDocument>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['nsfw', 'spam', 'panic', 'link_promo', 'other'],
      required: true,
    },
    description: { type: String },
    evidence: { type: String },
    details: { type: Schema.Types.Mixed },
    actionTaken: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const ReportModel = mongoose.model<IReportDocument>('Report', ReportSchema);
export const Report = ReportModel; // alias used in socket handlers
