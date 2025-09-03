import dotenv from 'dotenv';

export function loadEnv() {
  const result = dotenv.config();
  if (result.error && process.env.NODE_ENV !== 'production') {
    console.warn('No .env file found, relying on process env');
  }

  const required = [
    'MONGODB_URI',
    'IMAP_HOST',
    'IMAP_PORT',
    'IMAP_SECURE',
    'IMAP_USER',
    'IMAP_PASS',
    'IMAP_MAILBOX'
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}
