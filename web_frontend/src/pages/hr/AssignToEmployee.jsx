import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import SelectField from '../../components/common/forms/SelectField';
import { hrService } from '../../services/hrService';

/**
 * PUBLIC_INTERFACE
 * AssignToEmployee - assign candidates/results to employees for review.
 */
export default function AssignToEmployee() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [items, setItems] = useState([
    { id: 'rs1', candidate: 'Alex P.', test: 'Frontend L1', score: 78, status: 'Passed' },
    { id: 'rs3', candidate: 'Taylor Q.', test: 'Frontend L1', score: 42, status: 'Failed' },
  ]);
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    (async () => {
      const emps = await hrService.listEmployees();
      setEmployees(emps);
      setSelectedEmployee(emps[0]?.id || '');
    })();
  }, []);

  const toggle = (id) => setSelectedRows((s) => ({ ...s, [id]: !s[id] }));
  const assign = async () => {
    const ids = Object.keys(selectedRows).filter((k) => selectedRows[k]);
    if (!selectedEmployee) return alert('Choose an employee');
    if (ids.length === 0) return alert('Select at least one item');
    await hrService.assignToEmployee({ employeeId: selectedEmployee, itemIds: ids });
    alert('Assigned (mock)');
    setSelectedRows({});
  };

  const columns = useMemo(() => [
    { key: 'select', title: '', dataIndex: 'id', render: (v) => <input type="checkbox" checked={!!selectedRows[v]} onChange={() => toggle(v)} /> },
    { key: 'candidate', title: 'Candidate', dataIndex: 'candidate' },
    { key: 'test', title: 'Test', dataIndex: 'test' },
    { key: 'score', title: 'Score', dataIndex: 'score' },
    { key: 'status', title: 'Status', dataIndex: 'status' },
  ], [selectedRows]);

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Assign to Employee" extra={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <SelectField
            label="Employee"
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            options={employees.map((e) => ({ value: e.id, label: e.name }))}
          />
          <Button onClick={assign}>Assign Selected</Button>
        </div>
      }>
        <Table columns={columns} data={items} />
      </Card>
    </div>
  );
}
