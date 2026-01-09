
// src/components/settings/SEOSetup.jsx
import React, { useEffect, useState } from 'react';
import useUserSettings from '../../hooks/useUserSettings';
import { uploadIfFile } from '../../utils/uploadToStorage';

export default function SEOSetup() {
  const { uid, latest, loading, saving, error, save } = useUserSettings('seo');
  const [form, setForm] = useState({ metaTitle: '', metaDescription: '', ogImageUrl: '' });
  const [ogFile, setOgFile] = useState(null);
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (latest?.section === 'seo') {
      setForm({
        metaTitle: latest.metaTitle ?? '',
        metaDescription: latest.metaDescription ?? '',
        ogImageUrl: latest.ogImageUrl ?? '',
      });
    }
  }, [latest]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk('');
    const ogImageUrl = await uploadIfFile(uid, ogFile, 'editions', 'ogimage');
    const res = await save({ ...form, ogImageUrl: ogImageUrl ?? form.ogImageUrl }, { leftTab: 'seo', topTab: 'head' });
    if (res.ok) setOk('Saved successfully ✅');
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="m-0">SEO Setup</h5></div>
      <div className="card-body">
        {loading ? 'Loading…' : (
          <form onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {ok && <div className="alert alert-success">{ok}</div>}

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Meta Title</label>
                <input className="form-control" name="metaTitle" value={form.metaTitle} onChange={onChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Meta Description</label>
                <textarea className="form-control" name="metaDescription" rows={3} value={form.metaDescription} onChange={onChange} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">OG Image</label>
                <input type="file" accept="image/*" className="form-control" onChange={(e) => setOgFile(e.target.files?.[0] || null)} />
                {form.ogImageUrl && <img src={form.ogImageUrl} alt="og" className="mt-2 rounded" style={{ height: 60 }} />}
              </div>
            </div>

            <div className="mt-3">
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}