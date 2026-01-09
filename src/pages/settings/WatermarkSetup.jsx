
// src/components/settings/WatermarkSetup.jsx
import React, { useEffect, useState } from 'react';
import useUserSettings from '../../hooks/useUserSettings';

export default function WatermarkSetup() {
  const { latest, loading, saving, error, save } = useUserSettings('watermark');
  const [form, setForm] = useState({ enabled: false, text: '', opacity: 50 });
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (latest?.section === 'watermark') {
      setForm({
        enabled: !!latest.enabled,
        text: latest.text ?? '',
        opacity: Number(latest.opacity ?? 50),
      });
    }
  }, [latest]);

  const onChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: e.target.type === 'range' ? Number(val) : val });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await save(form, { leftTab: 'watermark', topTab: 'head' });
    if (res.ok) setOk('Saved successfully ✅');
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="m-0">Watermark Setup</h5></div>
      <div className="card-body">
        {loading ? 'Loading…' : (
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="wmEnabled" name="enabled" checked={!!form.enabled} onChange={onChange} />
              <label className="form-check-label" htmlFor="wmEnabled">Enable Watermark</label>
            </div>
            <div className="mb-3">
              <label className="form-label">Text</label>
              <input className="form-control" name="text" value={form.text} onChange={onChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Opacity: {form.opacity}%</label>
              <input type="range" className="form-range" min="0" max="100" name="opacity" value={form.opacity} onChange={onChange} />
            </div>
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </form>
        )}
      </div>
    </div>
  );
}