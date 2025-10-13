import React from 'react';
import Card from './Card';

/**
 * PUBLIC_INTERFACE
 * StatTile - displays a numeric stat with label
 */
export default function StatTile({ label, value, trend }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
        </div>
        {trend && <div style={{ color: trend > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
          {trend > 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
        </div>}
      </div>
    </Card>
  );
}
