import React from 'react';

interface ErrorDisplayProps {
  errors?: string[];
  style?: React.CSSProperties;
}

const defaultStyle: React.CSSProperties = {
  color: '#dc3545',
  fontSize: '14px',
  marginTop: '4px',
  marginBottom: '8px',
};

export default function ErrorDisplay({ errors, style }: ErrorDisplayProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div style={{ ...defaultStyle, ...style }}>
      {errors.map((error, index) => (
        <div key={index}>• {error}</div>
      ))}
    </div>
  );
}