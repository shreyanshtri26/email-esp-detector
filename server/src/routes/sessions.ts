import { Router } from 'express';
import { TestSession } from '../models/TestSession.js';

const router = Router();

// Create a new test session with a unique token
router.post('/', async (_req, res) => {
  const token = `ESP-TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const session = await TestSession.create({ token });
  res.json({
    token: session.token,
    recipientEmail: process.env.IMAP_USER!,
    subjectToUse: session.token
  });
});

export default router;
