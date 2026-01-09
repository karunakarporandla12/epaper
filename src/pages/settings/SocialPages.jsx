
// src/components/settings/SocialPages.jsx
import React, { useEffect, useState } from 'react';
import useUserSettings from '../../hooks/useUserSettings';

const KEYS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

export default function SocialPages() {
  const { latest, loading, saving, error, save } = useUserSettings('social');
  const [form, setForm] = useState({ facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' });
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (latest?.section === 'social') {
      setForm(KEYS.reduce((acc, k) => ({ ...acc, [k]: latest[k] ?? '' }), {}));
    }
  }, [latest]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setOk('');
    const res = await save(form, { leftTab: 'social', topTab: 'head' });
    if (res.ok) setOk('Saved successfully ✅');
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="m-0">Social Pages</h5></div>
      <div className="card-body">
        {loading ? 'Loading…' : (
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}
            <div className="row g-3">
              {KEYS.map((k) => (
                <div className="col-12 col-md-6" key={k}>
                  <label className="form-label">{k[0].toUpperCase() + k.slice(1)} URL</label>
                  <input className="form-control" name={k} value={form[k]} onChange={onChange} />
                </div>
              ))}
            </div>
            <div className="mt-3"><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
