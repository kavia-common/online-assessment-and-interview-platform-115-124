import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SelectField from '../../components/common/forms/SelectField';

/**
 * PUBLIC_INTERFACE
 * Export - placeholder screen for export presets/formats.
 */
export default function Export() {
  const [fmt, setFmt] = React.useState('csv');

  const doExport = () => {
    // Would wire to hrService.exportResults or other endpoints
    alert(`Exporting in ${fmt.toUpperCase()} format (mock)`);
  };

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Export Center">
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr auto' }}>
          <SelectField label="Format" value={fmt} onChange={setFmt} options={[
            { value: 'csv', label: 'CSV' },
            { value: 'xlsx', label: 'Excel (.xlsx)' },
            { value: 'pdf', label: 'PDF' },
          ]} />
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <Button onClick={doExport}>Export</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
