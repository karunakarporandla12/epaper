
// src/components/settings/PushNotification.jsx
import React, { useEffect, useState } from 'react';
import useUserSettings from '../../hooks/useUserSettings';

export default function PushNotification() {
  const { latest, loading, saving, error, save } = useUserSettings('push');
  const [form, setForm] = useState({ provider: 'FCM', serverKey: '', topic: '' });
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (latest?.section === 'push') {
      setForm({
        provider: latest.provider ?? 'FCM',
        serverKey: latest.serverKey ?? '',
        topic: latest.topic ?? '',
      });
    }
  }, [latest]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await save(form, { leftTab: 'push', topTab: 'head' });
    if (res.ok) setOk('Saved successfully ✅');
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="m-0">Push Notification</h5></div>
      <div className="card-body">
        {loading ? 'Loading…' : (
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Provider</label>
                <select className="form-select" name="provider" value={form.provider} onChange={onChange}>
                  <option>FCM</option>
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Server Key</label>
                <input className="form-control" name="serverKey" value={form.serverKey} onChange={onChange} />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label">Topic</label>
                <input className="form-control" name="topic" value={form.topic} onChange={onChange} />
              </div>
            </div>
            <div className="mt-3"><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button></div>
          </form>
        )}
      </div>
    </div>
  );
}
