import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Table - accessible table with optional caption.
 */
export default function Table({ columns = [], data = [], caption }) {
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table role="table" style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead role="rowgroup">
          <tr role="row">
            {columns.map((col) => (
              <th
                key={col.key}
                role="columnheader"
                scope="col"
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderBottom: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                {col.title ?? col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {data.map((row, idx) => (
            <tr key={idx} role="row">
              {columns.map((col) => (
                <td key={col.key} role="cell" style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
                  {typeof col.render === 'function' ? col.render(row[col.dataIndex ?? col.key], row) : row[col.dataIndex ?? col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr role="row">
              <td role="cell" colSpan={columns.length} style={{ padding: 16, color: 'var(--text-muted)' }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
