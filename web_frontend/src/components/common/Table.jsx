import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Table supporting density, zebra, and sticky header on overflow.
 */
const Table = ({
  columns = [],
  data = [],
  density = 'comfortable', // 'compact' | 'comfortable'
  zebra = false,
  stickyHeader = true,
  maxHeight, // optional for scroll
  style,
}) => {
  const densityClass = density === 'compact' ? 'density-compact' : 'density-comfortable';

  const wrapperStyle = {
    overflow: 'auto',
    maxHeight: maxHeight || undefined,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
  };

  return (
    <div style={wrapperStyle} className={`${stickyHeader ? 'table-sticky' : ''} ${zebra ? 'zebra' : ''} ${densityClass}`}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, ...style }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.accessor || c.key} style={{ textAlign: 'left', padding: 'var(--row-padding-y) var(--row-padding-x)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', position: stickyHeader ? 'sticky' : undefined, top: stickyHeader ? 0 : undefined }}>
                {c.Header || c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c) => (
                <td key={c.accessor || c.key} style={{ padding: 'var(--row-padding-y) var(--row-padding-x)', borderBottom: '1px solid var(--border)' }}>
                  {c.Cell ? c.Cell(row) : (c.render ? c.render(row[c.dataIndex || c.key], row) : row[c.accessor || c.key])}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 'var(--row-padding-y) var(--row-padding-x)', color: 'var(--text-muted)' }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
