import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card - surface container
 */
export default function Card({ title, extra, children }) {
  return (
    <div className="card p-20">
      {(title || extra) && (
        <div className="flex items-center justify-between mb-16">
          <strong>{title}</strong>
          {extra}
        </div>
      )}
      {children}
    </div>
  );
}
