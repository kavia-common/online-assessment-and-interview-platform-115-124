import React from 'react';

const TabBtn: React.FC<{ active?: boolean; onClick?: () => void }> = ({ active, onClick, children }) => (
  <button className={`btn ${active ? 'btn-primary' : 'btn-ghost'}`} onClick={onClick} aria-pressed={!!active} style={{ borderRadius: 999 }}>
    {children}
  </button>
);

/**
 * QuestionBankShell: tabs for MCQ/Theory, Import/Export with placeholders.
 */
const QuestionBankShell: React.FC = () => {
  const [tab, setTab] = React.useState<'mcq' | 'theory' | 'import' | 'export'>('mcq');

  return (
    <div className="container">
      <h1 className="h1">Question Bank</h1>
      <p className="muted">Manage MCQ and theory questions. Import and export question banks.</p>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <TabBtn active={tab === 'mcq'} onClick={() => setTab('mcq')}>MCQ</TabBtn>
          <TabBtn active={tab === 'theory'} onClick={() => setTab('theory')}>Theory</TabBtn>
          <TabBtn active={tab === 'import'} onClick={() => setTab('import')}>Import</TabBtn>
          <TabBtn active={tab === 'export'} onClick={() => setTab('export')}>Export</TabBtn>
        </div>

        <div style={{ marginTop: 16 }}>
          {tab === 'mcq' && <div><strong>MCQ</strong> - list, add, edit placeholders.</div>}
          {tab === 'theory' && <div><strong>Theory</strong> - list, add, edit placeholders.</div>}
          {tab === 'import' && <div><strong>Import</strong> - upload JSON/CSV placeholder.</div>}
          {tab === 'export' && <div><strong>Export</strong> - download JSON/CSV placeholder.</div>}
        </div>
      </div>
    </div>
  );
};

export default QuestionBankShell;
