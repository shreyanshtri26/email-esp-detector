import React from 'react';

export default function TokenCard({
  recipientEmail,
  subjectToUse,
  onRefresh
}: {
  recipientEmail: string;
  subjectToUse: string;
  onRefresh: () => void;
}) {
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="card">
      <h3>Send a test email</h3>
      <div className="row">
        <div className="label">To</div>
        <div className="value">{recipientEmail}</div>
        <button onClick={() => copy(recipientEmail)}>Copy</button>
      </div>
      <div className="row">
        <div className="label">Subject</div>
        <div className="value">{subjectToUse}</div>
        <button onClick={() => copy(subjectToUse)}>Copy</button>
      </div>
      <div className="hint">
        Send any message to the address above using the subject shown, then wait while the system detects and analyzes it.
      </div>
      <div className="actions">
        <button onClick={onRefresh}>Generate new subject</button>
      </div>
    </div>
  );
}
