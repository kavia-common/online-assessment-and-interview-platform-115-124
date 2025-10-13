import React, { useMemo, useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TemplateList shows test templates with section/weightage summary.
 * Provides navigation to TemplateEditor and stub delete action.
 */
export default function TemplateList() {
  const nav = useNavigate();
  const [items, setItems] = useState([
    { id: 'tpl1', name: 'Full Stack Screening', totalMarks: 100, sections: [{ name: 'MCQ', weight: 60 }, { name: 'Theory', weight: 40 }] },
    { id: 'tpl2', name: 'Frontend L1', totalMarks: 80, sections: [{ name: 'MCQ', weight: 50 }, { name: 'Theory', weight: 30 }] },
  ]);

  const onDelete = (row) => {
    if (window.confirm(`Delete template "${row.name}"?`)) {
      setItems((it) => it.filter((x) => x.id !== row.id));
    }
  };

  const columns = useMemo(
    () => [
      { key: 'name', title: 'Name', dataIndex: 'name' },
      {
        key: 'sections',
        title: 'Sections',
        dataIndex: 'sections',
        render: (v) => (v || []).map((s) => `${s.name} (${s.weight}%)`).join(', '),
      },
      { key: 'total', title: 'Total Marks', dataIndex: 'totalMarks' },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'id',
        render: (_, row) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => nav(`/admin/tests/templates/edit/${row.id}`)}>Edit</Button>
            <Button variant="ghost" onClick={() => onDelete(row)}>Delete</Button>
          </div>
        ),
      },
    ],
    [nav]
  );

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card
        title="Test Templates"
        extra={<Button onClick={() => nav('/admin/tests/templates/new')}>New Template</Button>}
      >
        <Table columns={columns} data={items} />
      </Card>
    </div>
  );
}
