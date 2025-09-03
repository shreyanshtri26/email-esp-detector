import React, { useEffect, useState } from 'react';
import TokenCard from './components/TokenCard';
import ESPBadge from './components/ESPBadge';
import ChainTimeline from './components/ChainTimeline';
import { createSession, getLatestByToken, listEmails } from './api';

export default function App() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subjectToUse, setSubjectToUse] = useState('');
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const newSession = async () => {
    setLoading(true);
    try {
      const data = await createSession();
      setRecipientEmail(data.recipientEmail);
      setSubjectToUse(data.subjectToUse);
      setToken(data.token);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    newSession();
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    if (token) {
      const poll = async () => {
        const r = await getLatestByToken(token);
        if (r.found) setResult(r.email);
      };
      poll();
      timer = window.setInterval(poll, 3000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [token]);

  useEffect(() => {
    const load = async () => {
      const l = await listEmails();
      setLogs(l);
    };
    load();
    const t = window.setInterval(load, 15000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Email ESP Detector</h1>
        <div className="subtitle">
          Identify the receiving chain and sender ESP of a test email via IMAP.
        </div>
      </header>

      <TokenCard
        recipientEmail={recipientEmail}
        subjectToUse={subjectToUse}
        onRefresh={newSession}
      />

      <section className="result">
        <h3>Detected Result</h3>
        {!result ? (
          <div className="waiting">
            {loading ? 'Preparing test...' : 'Waiting for a matching email...'}
          </div>
        ) : (
          <div className="grid">
            <div className="card">
              <div className="row">
                <div className="label">ESP</div>
                <ESPBadge esp={result.esp} />
              </div>
              <div className="row">
                <div className="label">From</div>
                <div className="value">{result.from || '-'}</div>
              </div>
              <div className="row">
                <div className="label">Subject</div>
                <div className="value">{result.subject || '-'}</div>
              </div>
              <div className="row">
                <div className="label">Date</div>
                <div className="value">
                  {result.date ? new Date(result.date).toLocaleString() : '-'}
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Receiving Chain</h3>
              <ChainTimeline hops={result.receivedChain || []} />
            </div>
          </div>
        )}
      </section>

      <section className="logs">
        <h3>Recent Logs</h3>
        <div className="table">
          <div className="thead">
            <div>Time</div>
            <div>Subject</div>
            <div>From</div>
            <div>ESP</div>
          </div>
          <div className="tbody">
            {logs.map((x) => (
              <div className="tr" key={x._id}>
                <div>{new Date(x.createdAt).toLocaleString()}</div>
                <div className="ellipsis" title={x.subject}>
                  {x.subject}
                </div>
                <div className="ellipsis" title={x.from}>
                  {x.from}
                </div>
                <div>{x.esp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        Validate headers with third-party tools if needed.
      </footer>
    </div>
  );
}
