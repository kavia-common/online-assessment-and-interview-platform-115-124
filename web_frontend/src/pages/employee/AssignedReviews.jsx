import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Tag from '../../components/common/Tag';

/**
 * AssignedReviews
 * PUBLIC_INTERFACE
 * A list page for employees to view their assigned candidate test reviews.
 * This is a placeholder implementation with mocked data.
 */
const AssignedReviews = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const t = setTimeout(() => {
      setReviews([
        {
          id: 'REV-1001',
          candidate: 'Alex Johnson',
          test: 'Frontend Developer Assessment',
          assignedAt: '2025-10-01',
          status: 'Pending',
          priority: 'High',
        },
        {
          id: 'REV-1002',
          candidate: 'Priya Patel',
          test: 'Backend Developer Assessment',
          assignedAt: '2025-10-02',
          status: 'In Progress',
          priority: 'Medium',
        },
        {
          id: 'REV-1003',
          candidate: 'Chen Li',
          test: 'Fullstack Developer Assessment',
          assignedAt: '2025-10-03',
          status: 'Completed',
          priority: 'Low',
        },
      ]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, []);

  const columns = [
    { header: 'Review ID', accessor: 'id' },
    { header: 'Candidate', accessor: 'candidate' },
    { header: 'Test', accessor: 'test' },
    { header: 'Assigned At', accessor: 'assignedAt' },
    {
      header: 'Priority',
      accessor: 'priority',
      cell: (row) => (
        <Tag color={row.priority === 'High' ? 'error' : row.priority === 'Medium' ? 'secondary' : 'success'}>
          {row.priority}
        </Tag>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <Tag color={row.status === 'Completed' ? 'success' : row.status === 'In Progress' ? 'secondary' : 'error'}>
          {row.status}
        </Tag>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" to={`/employee/reviews/${row.id}`}>
            Open
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card title="Assigned Reviews" subtitle="Manage and complete your candidate test evaluations.">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Note: This is a placeholder UI. Integrate with backend_api when available.
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Refresh</Button>
            <Button variant="primary">New Note</Button>
          </div>
        </div>
        <Table columns={columns} data={reviews} loading={loading} emptyMessage="No reviews assigned." />
      </Card>
    </div>
  );
};

export default AssignedReviews;
