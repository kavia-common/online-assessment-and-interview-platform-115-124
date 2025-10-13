import React from 'react';
import PropTypes from 'prop-types';
import '../../theme/global.css';

/**
 * PUBLIC_INTERFACE
 * KPIGrid
 * A responsive grid of KPI tiles showing a label, value, optional delta and icon.
 * Ocean Professional theme: blue primary accents, subtle gradient background, rounded corners, shadow.
 */
const KPIGrid = ({ items, columns }) => {
  return (
    <div
      className="kpi-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns || 4}, minmax(0, 1fr))`,
        gap: '16px',
      }}
    >
      {items.map((kpi, idx) => (
        <div
          key={idx}
          className="kpi-tile"
          style={{
            background: 'linear-gradient(to bottom right, rgba(59,130,246,0.08), #ffffff)',
            border: '1px solid rgba(37,99,235,0.12)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {kpi.icon && (
            <div
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: 'rgba(37,99,235,0.1)',
                display: 'grid',
                placeItems: 'center',
                color: '#2563EB',
                flex: '0 0 auto',
              }}
            >
              {kpi.icon}
            </div>
          )}
          <div style={{ display: 'grid', gap: 4 }}>
            <div style={{ fontSize: 12, color: '#6B7280' }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{kpi.value}</div>
            {typeof kpi.delta !== 'undefined' && (
              <div
                style={{
                  fontSize: 12,
                  color: kpi.delta >= 0 ? '#10B981' : '#EF4444',
                }}
              >
                {kpi.delta >= 0 ? '▲' : '▼'} {Math.abs(kpi.delta)}%
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

KPIGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      delta: PropTypes.number,
      icon: PropTypes.node,
    })
  ).isRequired,
  columns: PropTypes.number,
};

export default KPIGrid;
