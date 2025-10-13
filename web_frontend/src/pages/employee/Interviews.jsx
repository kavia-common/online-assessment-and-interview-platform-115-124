import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/forms/TextArea';

/**
 * Interviews
 * PUBLIC_INTERFACE
 * A page for employees to view scheduled interviews and maintain notes.
 */
const Interviews = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    // Simulate fetch
    const t = setTimeout(() => {
      setItems([
        {
          id: 'INT-2001',
          candidate: 'Ravi Kumar',
          time: '2025-10-12 10:00 AM',
          stage: 'Technical Interview',
          mode: 'Video',
          link: '#',
        },
        {
          id: 'INT-2002',
          candidate: 'Maria Garcia',
          time: '2025-10-13 2:00 PM',
          stage: 'HR Interview',
          mode: 'Onsite',
          link: '#',
        },
      ]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  const columns = [
    { header: 'Interview ID', accessor: 'id' },
    { header: 'Candidate', accessor: 'candidate' },
    { header: 'Time', accessor: 'time' },
    { header: 'Stage', accessor: 'stage' },
    { header: 'Mode', accessor: 'mode' },
    {
      header: 'Join/Details',
      accessor: 'actions',
      cell: (row) => (
        <Button as="a" href={row.link} target="_blank" rel="noreferrer" variant="primary" size="sm">
          Open
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card title="Interview Schedule" subtitle="Upcoming interviews assigned to you.">
        <Table columns={columns} data={items} loading={loading} emptyMessage="No upcoming interviews." />
      </Card>

      <Card title="Interview Notes" subtitle="Personal notes related to interviews. Placeholder UI.">
        <div className="space-y-3">
          <TextArea label="Notes" rows={5} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary">Save</Button>
            <Button variant="primary">Share with HR</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Interviews;
