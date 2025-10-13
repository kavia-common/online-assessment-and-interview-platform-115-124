import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextField from '../../components/common/forms/TextField';
import SelectField from '../../components/common/forms/SelectField';
import TextArea from '../../components/common/forms/TextArea';
import { required } from '../../utils/validators';
import { candidateService } from '../../services/candidateService';

/**
 * PUBLIC_INTERFACE
 * Questionnaire - dynamic form based on schema from backend, with basic validation.
 */
export default function Questionnaire() {
  const [schema, setSchema] = useState({ fields: [], values: {} });
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const q = await candidateService.getQuestionnaire();
        setSchema(q);
        setValues(q.values || {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setVal = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const validate = () => {
    const e = {};
    for (const f of schema.fields) {
      if (f.required) {
        const r = required(values[f.key]);
        if (r) e[f.key] = r;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await candidateService.submitQuestionnaire(values);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (f) => {
    const common = {
      key: f.key,
      name: f.key,
      label: f.label,
      value: values[f.key] ?? '',
      onChange: (v) => setVal(f.key, v),
      required: !!f.required,
      error: errors[f.key],
    };
    switch (f.type) {
      case 'select':
        return <SelectField {...common} options={f.options || []} />;
      case 'textarea':
        return <TextArea {...common} rows={6} />;
      default:
        return <TextField {...common} />;
    }
  };

  if (loading) {
    return <div className="container"><div className="card p-24">Loading questionnaire...</div></div>;
  }

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="Candidate Questionnaire">
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            {schema.fields.map((f) => renderField(f))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            {submitted && <div style={{ color: 'var(--color-success)', marginRight: 'auto' }}>Responses saved.</div>}
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
