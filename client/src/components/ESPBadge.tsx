import React from 'react';

export default function ESPBadge({ esp }: { esp?: string }) {
  const color =
    esp && esp !== 'Unknown' ? '#0a7f2e' : '#6b7280'; // green vs gray
  return (
    <span
      style={{
        background: color,
        color: 'white',
        padding: '6px 10px',
        borderRadius: 8,
        fontWeight: 600
      }}
      title="Detected Email Service Provider"
    >
      {esp || 'Unknown'}
    </span>
  );
}
