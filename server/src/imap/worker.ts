import { ImapFlow } from 'imapflow';
import { simpleParser, ParsedMail } from 'mailparser';
import { EmailLog } from '../models/EmailLog.js';
import { TestSession } from '../models/TestSession.js';
import { detectESP } from '../utils/espDetector.js';
import { extractReceivedRaw, parseReceivedHops } from '../utils/received.js';

function getClient(): ImapFlow {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT!),
    secure: process.env.IMAP_SECURE === 'true',
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASS!
    },
    // Keep IDLE running by default; we will also periodically search
    maxIdleTime: 10 * 60 * 1000
  });
  return client;
}

export async function startImapWorker(): Promise<void> {
  const mailbox = process.env.IMAP_MAILBOX!;
  const client = getClient();

  client.on('close', () => {
    console.warn('IMAP connection closed. Attempting to reconnect...');
    // Attempt to reconnect after a delay
    setTimeout(() => {
      startImapWorker().catch(console.error);
    }, 5000);
  });

  client.on('error', (err) => {
    console.error('IMAP error:', err);
  });

  try {
    await client.connect();
    console.log('Successfully connected to IMAP server');
    await client.mailboxOpen(mailbox);
    console.log(`Watching mailbox: ${mailbox}`);

    // Poll + IDLE hybrid for reliability
    const scan = async () => {
      try {
        // Get active tokens
        const sessions = await TestSession.find({ active: true }).lean();
        if (sessions.length === 0) return;

        // Search for matching subjects per token (both seen and unseen)
        for (const s of sessions) {
          const matches = await client.search({
            subject: s.token || undefined
          });

          for (const seq of matches || []) {
            const msg = await client.fetchOne(seq.toString(), { source: true, envelope: true });
            if (!msg || !('source' in msg) || !msg.source) continue;

            const mail = (await simpleParser(msg.source as Buffer)) as ParsedMail;
            const headerLines = [...(mail.headerLines || [])]; // Create mutable copy
            const headerMap = new Map<string, string | string[]>();
            for (const { key, line } of headerLines) {
              const k = key.toLowerCase();
              const prev = headerMap.get(k);
              if (prev) {
                if (Array.isArray(prev)) headerMap.set(k, [...prev, line]);
                else headerMap.set(k, [prev, line]);
              } else {
                headerMap.set(k, line);
              }
            }

            const receivedRaw = extractReceivedRaw(headerLines as Array<{ key: string; line: string }>);
            const receivedChain = parseReceivedHops(receivedRaw);
            const esp = detectESP({
              headerMap,
              receivedRaw,
              rawHeaders: (mail.headerLines || []).map((h: { line: string }) => h.line).join('\n')
            });

            const doc = await EmailLog.create({
              token: s.token,
              messageId: mail.messageId || undefined,
              subject: mail.subject || '',
              from: mail.from?.text || '',
              to: Array.isArray(mail.to) 
                ? mail.to.map(addr => (addr as any).text || '').filter(Boolean).join(', ') 
                : (mail.to as any)?.text || '',
              date: mail.date || new Date(),
              esp,
              receivedChain,
              receivedRaw,
              rawHeaders: (mail.headerLines || []).map((h: { line: string }) => h.line).join('\n')
            });

            await TestSession.updateOne({ _id: s._id }, { $set: { active: false, matchedEmailId: doc._id } });
            // Mark as seen to avoid reprocessing
            await client.messageFlagsAdd(seq, ['\\Seen']);
          }
        }
      } catch (err) {
        console.error('Scan error:', err);
      }
    };

    // Periodic scan plus idle
    setInterval(scan, 10_000);
    await client.idle(); // keeps the connection listening; resolves only if IDLE stops
  } catch (err) {
    console.error('Error starting IMAP worker:', err);
  }
}
