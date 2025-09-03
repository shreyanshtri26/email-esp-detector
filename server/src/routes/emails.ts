import { Router } from 'express';
import { EmailLog } from '../models/EmailLog.js';

const router = Router();

// Latest processed email for a given token
router.get('/latest', async (req, res) => {
  const token = String(req.query.token || '');
  if (!token) return res.status(400).json({ error: 'token required' });

  const doc = await EmailLog.findOne({ token }).sort({ createdAt: -1 }).lean();
  if (!doc) return res.json({ found: false });

  res.json({ found: true, email: doc });
});

// List recent logs
router.get('/', async (_req, res) => {
  const docs = await EmailLog.find({}).sort({ createdAt: -1 }).limit(50).lean();
  res.json(docs);
});

export default router;
