import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Card
 * Themed surface container with optional title and extra actions content.
 */
export default function Card({ title, extra, children, style }) {
  return (
    <div
      className="card"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        padding: 16,
        ...style,
      }}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between mb-16">
          {title && <strong style={{ color: 'var(--text-primary)' }}>{title}</strong>}
          {extra}
        </div>
      )}
      {children}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extra: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.object,
};
