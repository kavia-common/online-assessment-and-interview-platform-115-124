import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Table - basic table presentation component.
 */
export default function Table({ columns = [], data = [] }) {
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} style={{ borderTop: '1px solid var(--border-color)' }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
                  {typeof col.render === 'function' ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 16, color: 'var(--text-muted)' }}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
