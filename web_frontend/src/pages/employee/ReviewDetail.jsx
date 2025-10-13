import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/common/Card';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import TextArea from '../../components/common/forms/TextArea';
import TextField from '../../components/common/forms/TextField';
import Tag from '../../components/common/Tag';

/**
 * EvaluationForm
 * PUBLIC_INTERFACE
 * A simple evaluation form placeholder with scoring and comments.
 */
const EvaluationForm = ({ onSubmit, defaultValues }) => {
  const [scores, setScores] = useState(defaultValues?.scores || { technical: 0, problemSolving: 0, communication: 0 });
  const [summary, setSummary] = useState(defaultValues?.summary || '');
  const [recommendation, setRecommendation] = useState(defaultValues?.recommendation || 'Undecided');

  const totalScore = useMemo(
    () => Number(scores.technical || 0) + Number(scores.problemSolving || 0) + Number(scores.communication || 0),
    [scores]
  );

  const handleChange = (field) => (e) => {
    setScores((s) => ({ ...s, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ scores, summary, recommendation, totalScore });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextField
          label="Technical"
          type="number"
          min="0"
          max="10"
          value={scores.technical}
          onChange={handleChange('technical')}
        />
        <TextField
          label="Problem Solving"
          type="number"
          min="0"
          max="10"
          value={scores.problemSolving}
          onChange={handleChange('problemSolving')}
        />
        <TextField
          label="Communication"
          type="number"
          min="0"
          max="10"
          value={scores.communication}
          onChange={handleChange('communication')}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="font-medium">Total Score:</div>
        <Tag color={totalScore >= 24 ? 'success' : totalScore >= 15 ? 'secondary' : 'error'}>{totalScore}/30</Tag>
      </div>

      <TextArea
        label="Summary"
        placeholder="Provide a brief evaluation summary..."
        rows={4}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Recommendation</label>
          <select
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
          >
            <option>Strong Hire</option>
            <option>Hire</option>
            <option>Undecided</option>
            <option>No Hire</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button">
          Save Draft
        </Button>
        <Button variant="primary" type="submit">
          Submit Evaluation
        </Button>
      </div>
    </form>
  );
};

/**
 * ReviewDetail
 * PUBLIC_INTERFACE
 * Detailed view of a single assigned review with tabs for details, evaluation, and notes.
 */
const ReviewDetail = () => {
  const { reviewId } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [review, setReview] = useState(null);

  useEffect(() => {
    // Simulate fetch review by id
    const t = setTimeout(() => {
      setReview({
        id: reviewId,
        candidate: 'Alex Johnson',
        test: 'Frontend Developer Assessment',
        assignedAt: '2025-10-01',
        status: 'In Progress',
        artifacts: [
          { name: 'Screen Recording', url: '#', type: 'video' },
          { name: 'Camera Feed', url: '#', type: 'video' },
          { name: 'Answer Sheet', url: '#', type: 'pdf' },
        ],
      });
    }, 300);
    return () => clearTimeout(t);
  }, [reviewId]);

  const tabs = [
    { key: 'details', label: 'Details' },
    { key: 'evaluation', label: 'Evaluation' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-4">
      <Card title={`Review ${reviewId}`} subtitle="Review the candidate's test submission and provide evaluation.">
        {!review ? (
          <div className="text-sm text-gray-500">Loading review...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Candidate</div>
                <div className="font-medium">{review.candidate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Test</div>
                <div className="font-medium">{review.test}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Assigned</div>
                <div className="font-medium">{review.assignedAt}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <Tag color={review.status === 'Completed' ? 'success' : 'secondary'}>{review.status}</Tag>
              </div>
            </div>

            <div className="mt-4">
              <Tabs activeKey={activeTab} onChange={setActiveTab} tabs={tabs} />
            </div>

            {activeTab === 'details' && (
              <div className="mt-4 space-y-3">
                <div className="text-sm text-gray-600">
                  This is a placeholder. Replace with artifact viewers and detailed test metadata.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {review.artifacts.map((a, idx) => (
                    <a
                      key={idx}
                      href={a.url}
                      className="rounded-md border border-gray-200 p-3 hover:bg-gray-50 transition"
                    >
                      <div className="text-sm text-gray-500">{a.type.toUpperCase()}</div>
                      <div className="font-medium">{a.name}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'evaluation' && (
              <div className="mt-4">
                <EvaluationForm
                  onSubmit={(payload) => {
                    // TODO: integrate with backend_api to persist evaluation
                    // eslint-disable-next-line no-console
                    console.log('Evaluation submitted:', payload);
                    alert('Evaluation submitted (placeholder). Check console for payload.');
                  }}
                />
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="mt-4 space-y-3">
                <TextArea label="Internal Notes" placeholder="Add internal notes..." rows={5} />
                <div className="flex justify-end">
                  <Button variant="secondary">Save Notes</Button>
                </div>
                <div className="text-xs text-gray-500">
                  Note: Notes are private to employees/HR and not visible to candidates. Placeholder only.
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ReviewDetail;
