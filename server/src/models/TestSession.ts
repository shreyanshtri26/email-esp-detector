import mongoose from 'mongoose';

const TestSessionSchema = new mongoose.Schema(
  {
    token: { type: String, unique: true, index: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    matchedEmailId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailLog' }
  },
  { versionKey: false }
);

export type TestSessionDoc = mongoose.InferSchemaType<typeof TestSessionSchema>;
export const TestSession = mongoose.model('TestSession', TestSessionSchema);
