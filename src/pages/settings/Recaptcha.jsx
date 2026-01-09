
// src/components/settings/Recaptcha.jsx
import React, { useEffect, useState } from 'react';
import useUserSettings from '../../hooks/useUserSettings';

export default function Recaptcha() {
  const { latest, loading, saving, error, save } = useUserSettings('recaptcha');
  const [form, setForm] = useState({ siteKey: '', secretKey: '' });
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (latest?.section === 'recaptcha') {
      setForm({ siteKey: latest.siteKey ?? '', secretKey: latest.secretKey ?? '' });
    }
  }, [latest]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await save(form, { leftTab: 'recaptcha', topTab: 'head' });
    if (res.ok) setOk('Saved successfully ✅');
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="m-0">Google reCAPTCHA</h5></div>
      <div className="card-body">
        {loading ? 'Loading…' : (
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Site Key</label>
                <input className="form-control" name="siteKey" value={form.siteKey} onChange={onChange} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Secret Key</label>
                <input className="form-control" name="secretKey" value={form.secretKey} onChange={onChange} />
              </div>
            </div>
            <div className="mt-3"><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
