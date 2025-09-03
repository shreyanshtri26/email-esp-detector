import mongoose from 'mongoose';

const ReceivedHopSchema = new mongoose.Schema(
  {
    raw: { type: String, required: true },
    by: String,
    from: String,
    with: String,
    id: String,
    date: String
  },
  { _id: false }
);

const EmailLogSchema = new mongoose.Schema(
  {
    token: { type: String, index: true },
    messageId: String,
    subject: String,
    from: String,
    to: String,
    date: Date,
    esp: { type: String, index: true },
    receivedChain: [ReceivedHopSchema],
    receivedRaw: [String],
    rawHeaders: String,
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export type EmailLogDoc = mongoose.InferSchemaType<typeof EmailLogSchema>;
export const EmailLog = mongoose.model('EmailLog', EmailLogSchema);
