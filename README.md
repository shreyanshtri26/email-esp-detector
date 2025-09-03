# Email ESP Detector (IMAP)

A full-stack system that (1) shows an email address and a subject token, (2) watches an IMAP mailbox for incoming test emails, (3) extracts the Received chain and detects the sender ESP from headers, and (4) renders results in a responsive UI.

## Tech
- Backend: Node.js + TypeScript, ImapFlow, MailParser, MongoDB
- Frontend: React + TypeScript (Vite)
- DB: MongoDB (local Docker or Atlas)

## Prerequisites
- A working IMAP mailbox (host, port, TLS, user, password)
- Node.js 18+, npm
- MongoDB (Docker or managed)

## Setup

1) MongoDB
- Option A: Docker
  docker compose up -d
- Option B: Atlas
  Use your connection string.

2) Backend
- cd server
- cp ../.env.example .env
- Fill IMAP_*, MONGODB_URI, etc.
- npm install
- npm run dev

3) Frontend
- cd ../client
- npm install
- VITE_API_URL defaults to http://localhost:5000/api (set if needed)
- npm run dev
- Open http://localhost:5173

## Usage
- The UI shows:
  - To: your IMAP mailbox address (from IMAP_USER)
  - Subject: a generated token (e.g., ESP-TEST-AB12CD)
- Send any email to that address using the exact subject token.
- The backend identifies the message via IMAP search, parses headers, detects ESP, and stores the result.
- The UI polls the API and shows ESP + a timeline of the Received chain.

## Validating results
- Paste headers into Google Message Header Analyzer or MXToolbox Header Analyzer to compare chains and timing. This is helpful for confirming the hop path and latency between servers.

## Deployment notes
- Host server on any Node-friendly platform. Ensure outbound IMAP is allowed and credentials remain secure.
- For production, keep the IMAP worker running (e.g., PM2 or systemd). Consider reconnection logic if 'close' events occur.
- Rate-limit scans and handle large mailboxes by archiving or moving processed mail.

## Extending ESP detection
- Add new patterns for common ESPs:
  - Return-Path, List-Unsubscribe, X-* tracking headers
  - Domains in Received hops and embedded links
- Use real-world datasets to improve accuracy.
