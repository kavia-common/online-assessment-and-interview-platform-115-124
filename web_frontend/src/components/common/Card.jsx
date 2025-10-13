import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card component with standard padding and elevation.
 */
const Card = ({ children, title, actions, style, elevation = 'sm' }) => {
  const shadow = {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  }[elevation] || 'var(--shadow-sm)';

  return (
    <div className="card" style={{ boxShadow: shadow, ...style }}>
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          {title && <h3 style={{ margin: 0, fontSize: 16, fontWeight: 'var(--heading-weight)' }}>{title}</h3>}
          {actions}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default Card;
