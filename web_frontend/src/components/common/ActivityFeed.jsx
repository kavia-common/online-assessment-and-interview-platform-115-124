import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * ActivityFeed
 * A simple list of recent actions with timestamp and type badge.
 */
const ActivityFeed = ({ items, maxItems = 8 }) => {
  const visible = items.slice(0, maxItems);
  const badgeColor = (type) => {
    switch (type) {
      case 'info':
        return '#2563EB';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      case 'success':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
      {visible.map((it, idx) => (
        <li
          key={idx}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(17,24,39,0.06)',
            borderRadius: 12,
            padding: 12,
            display: 'grid',
            gap: 6,
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: badgeColor(it.type),
              }}
            />
            <div style={{ color: '#111827', fontWeight: 600, fontSize: 14 }}>{it.title}</div>
          </div>
          <div style={{ color: '#4B5563', fontSize: 13 }}>{it.description}</div>
          <div style={{ color: '#6B7280', fontSize: 12 }}>{new Date(it.timestamp).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  );
};

ActivityFeed.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['info', 'warning', 'error', 'success']),
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  maxItems: PropTypes.number,
};

export default ActivityFeed;
