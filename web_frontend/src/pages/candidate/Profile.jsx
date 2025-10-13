import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TextField from '../../components/common/forms/TextField';
import SelectField from '../../components/common/forms/SelectField';
import TextArea from '../../components/common/forms/TextArea';
import { required, email as emailValidator, minLength } from '../../utils/validators';
import { candidateService } from '../../services/candidateService';

/**
 * PUBLIC_INTERFACE
 * Candidate Profile page - view and edit personal details.
 * Uses simple inline validation and saves via candidateService.
 */
export default function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    summary: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await candidateService.getProfile();
        setForm(profile);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setVal = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    e.name = required(form.name) || minLength(form.name, 2);
    e.email = required(form.email) || emailValidator(form.email);
    e.experience = required(form.experience);
    e.summary = form.summary && form.summary.length > 600 ? 'Max 600 characters' : '';
    Object.keys(e).forEach((k) => !e[k] && delete e[k]);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setSaved(false);
    if (!validate()) return;
    setSaving(true);
    try {
      await candidateService.updateProfile(form);
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="card p-24">Loading profile...</div></div>;
  }

  return (
    <div className="container" style={{ display: 'grid', gap: 16 }}>
      <Card title="My Profile">
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextField label="Full Name" name="name" value={form.name} onChange={(v) => setVal('name', v)} required error={errors.name} />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={(v) => setVal('email', v)} required error={errors.email} />
            <TextField label="Phone" name="phone" value={form.phone} onChange={(v) => setVal('phone', v)} placeholder="Optional" />
            <TextField label="Location" name="location" value={form.location} onChange={(v) => setVal('location', v)} placeholder="City, Country" />
            <SelectField
              label="Experience"
              name="experience"
              value={form.experience}
              onChange={(v) => setVal('experience', v)}
              options={['0-1 years', '1-3 years', '3-5 years', '5+ years']}
              required
              error={errors.experience}
            />
          </div>
          <TextArea label="Professional Summary" name="summary" value={form.summary} onChange={(v) => setVal('summary', v)} rows={6} placeholder="Brief summary (max 600 chars)" error={errors.summary} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
            {saved && <div style={{ color: 'var(--color-success)', marginRight: 'auto' }}>Saved successfully.</div>}
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
