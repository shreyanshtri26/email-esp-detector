import React from 'react';

type Hop = {
  raw: string;
  by?: string;
  from?: string;
  with?: string;
  id?: string;
  date?: string;
};

export default function ChainTimeline({ hops }: { hops: Hop[] }) {
  return (
    <div className="timeline">
      {hops && hops.length > 0 ? (
        hops.map((h, i) => (
          <div className="timeline-item" key={i}>
            <div className="dot" />
            <div className="content">
              <div className="line"><strong>From:</strong> {h.from || '-'}</div>
              <div className="line"><strong>By:</strong> {h.by || '-'}</div>
              <div className="line"><strong>With:</strong> {h.with || '-'}</div>
              <div className="line"><strong>ID:</strong> {h.id || '-'}</div>
              <div className="line"><strong>Date:</strong> {h.date || '-'}</div>
              <div className="line raw"><strong>Raw:</strong> {h.raw}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="muted">No Received chain found</div>
      )}
    </div>
  );
}
