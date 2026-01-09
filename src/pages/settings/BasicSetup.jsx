// import React, { useEffect, useState } from 'react';
// import useAuthUser from '../../hooks/useAuthUser';
// import useUserSettings from '../../hooks/useUserSettings';
// import { uploadIfFile } from '../../utils/uploadToStorage';

// const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Singapore'];
// const LANGUAGES = ['en', 'hi', 'te', 'ta', 'kn'];
// const TIMEZONES = ['Asia/Kolkata', 'Asia/Singapore', 'Europe/London', 'America/New_York'];

// export default function BasicSetup() {
//   const { uid, isSignedIn, authReady } = useAuthUser();
//   const { latest, loading, saving, error, save } = useUserSettings('basic');

//   const [form, setForm] = useState({
//     websiteName: '',
//     country: 'India',
//     timezone: 'Asia/Kolkata',
//     language: 'en',
//     creditBy: '',
//     faviconUrl: '',
//     logoUrl: '',
//   });
//   const [faviconFile, setFaviconFile] = useState(null);
//   const [logoFile, setLogoFile] = useState(null);
//   const [ok, setOk] = useState('');

//   useEffect(() => {
//     if (latest) {
//       setForm((prev) => ({
//         ...prev,
//         websiteName: latest.websiteName ?? prev.websiteName,
//         country: latest.country ?? prev.country,
//         timezone: latest.timezone ?? prev.timezone,
//         language: latest.language ?? prev.language,
//         creditBy: latest.creditBy ?? prev.creditBy,
//         faviconUrl: latest.faviconUrl ?? '',
//         logoUrl: latest.logoUrl ?? '',
//       }));
//     }
//   }, [latest]);

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setOk('');
//     if (!form.websiteName.trim()) return alert('Website Name is required');
//     const faviconUrl = await uploadIfFile(uid, faviconFile, 'editions', 'favicon');
//     const logoUrl = await uploadIfFile(uid, logoFile, 'editions', 'logo');
//     const res = await save({
//       ...form,
//       faviconUrl: faviconUrl ?? form.faviconUrl ?? null,
//       logoUrl: logoUrl ?? form.logoUrl ?? null,
//     }, { leftTab: 'basic', topTab: 'head' });
//     if (res.ok) setOk('Saved successfully ✅');
//   };

//   if (!authReady) return <div className="text-muted">Checking user…</div>;
//   if (!isSignedIn) return <div className="alert alert-warning">Please sign in to edit settings.</div>;
// //   if (loading) return <div className="text-muted">Loading…</div>;

//   return (
//     <div className="card shadow-sm">
//       <div className="card-header"><h5 className="m-0">Basic Setup</h5></div>
//       <div className="card-body">
//         <form onSubmit={onSubmit}>
//           {error && <div className="alert alert-danger">{error}</div>}
//           {ok && <div className="alert alert-success">{ok}</div>}

//           <div className="row g-3">
//             <div className="col-12">
//               <label className="form-label">Website Name</label>
//               <input name="websiteName" className="form-control" value={form.websiteName} onChange={onChange} required />
//             </div>

//             <div className="col-12 col-md-6">
//               <label className="form-label">Favicon</label>
//               <input type="file" accept="image/*" className="form-control"
//                      onChange={(e) => setFaviconFile(e.target.files?.[0] || null)} />
//               {form.faviconUrl && <img src={form.faviconUrl} alt="favicon" className="mt-2 rounded"
//                                        style={{ height: 40, width: 40, objectFit: 'contain' }} />}
//             </div>

//             <div className="col-12 col-md-6">
//               <label className="form-label">Epaper Logo</label>
//               <input type="file" accept="image/*" className="form-control"
//                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
//               {form.logoUrl && <img src={form.logoUrl} alt="logo" className="mt-2 rounded" style={{ height: 40 }} />}
//             </div>

//             <div className="col-12 col-md-6">
//               <label className="form-label">Country</label>
//               <select name="country" className="form-select" value={form.country} onChange={onChange}>
//                 {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>

//             <div className="col-12 col-md-6">
//               <label className="form-label">Timezone</label>
//               <select name="timezone" className="form-select" value={form.timezone} onChange={onChange}>
//                 {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
//               </select>
//             </div>

//             <div className="col-12 col-md-6">
//               <label className="form-label">Language</label>
//               <select name="language" className="form-select" value={form.language} onChange={onChange}>
//                 {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
//               </select>
//             </div>

//             <div className="col-12 col-md-6">
//               <label className="form-label">Credit By</label>
//               <input name="creditBy" className="form-control" value={form.creditBy} onChange={onChange} />
//             </div>
//           </div>

//           <div className="mt-3">
//             <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// src/components/settings/BasicSetup.jsx
import React, { useEffect, useState } from 'react';
import useAuthUser from '../../hooks/useAuthUser';
// ⬇️ use the new hook (collection 'data')
import useUserDataCollection from '../../hooks/useUserDataCollection';
import { uploadIfFile } from '../../utils/uploadToStorage';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Singapore'];
const LANGUAGES = ['en', 'hi', 'te', 'ta', 'kn'];
const TIMEZONES = ['Asia/Kolkata', 'Asia/Singapore', 'Europe/London', 'America/New_York'];

export default function BasicSetup() {
  const { uid, isSignedIn, authReady } = useAuthUser();
  const { latest, loading, saving, error, save } = useUserDataCollection('basic');

  const [form, setForm] = useState({
    websiteName: '',
    country: 'India',
    timezone: 'Asia/Kolkata',
    language: 'en',
    creditBy: '',
    faviconUrl: '',
    logoUrl: '',
  });
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [ok, setOk] = useState('');

  useEffect(() => {
    if (latest) {
      setForm((prev) => ({
        ...prev,
        websiteName: latest.websiteName ?? prev.websiteName,
        country: latest.country ?? prev.country,
        timezone: latest.timezone ?? prev.timezone,
        language: latest.language ?? prev.language,
        creditBy: latest.creditBy ?? prev.creditBy,
        faviconUrl: latest.faviconUrl ?? '',
        logoUrl: latest.logoUrl ?? '',
      }));
    }
  }, [latest]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setOk('');
    if (!authReady || !isSignedIn || !uid) return alert('Please sign in.');
    if (!form.websiteName.trim()) return alert('Website Name is required');

    const faviconUrl = await uploadIfFile(uid, faviconFile, 'favicon'); // path: editions/{uid}/assets/favicon.ext
    const logoUrl = await uploadIfFile(uid, logoFile, 'logo');          // path: editions/{uid}/assets/logo.ext

    const res = await save({
      ...form,
      faviconUrl: faviconUrl ?? form.faviconUrl ?? null,
      logoUrl: logoUrl ?? form.logoUrl ?? null,
    });
    if (res.ok) setOk('Saved successfully ✅');
  };

//   if (!authReady) return <div className="text-muted">Checking user…</div>;
//   if (!isSignedIn) return <div className="alert alert-warning">Please sign in to edit settings.</div>;
  // if (loading) return <div className="text-muted">Loading…</div>; // optional spinner

  return (
    <div className="card shadow-sm">
      <div className="card-header"><h5 className="m-0">Basic Setup</h5></div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {ok && <div className="alert alert-success">{ok}</div>}

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Website Name</label>
              <input name="websiteName" className="form-control" value={form.websiteName} onChange={onChange} required />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Favicon</label>
              <input type="file" accept="image/*" className="form-control"
                onChange={(e) => setFaviconFile(e.target.files?.[0] || null)} />
              {form.faviconUrl && (
                <img src={form.faviconUrl} alt="favicon" className="mt-2 rounded"
                     style={{ height: 40, width: 40, objectFit: 'contain' }} />
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Epaper Logo</label>
              <input type="file" accept="image/*" className="form-control"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
              {form.logoUrl && <img src={form.logoUrl} alt="logo" className="mt-2 rounded" style={{ height: 40 }} />}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Country</label>
              <select name="country" className="form-select" value={form.country} onChange={onChange}>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Timezone</label>
              <select name="timezone" className="form-select" value={form.timezone} onChange={onChange}>
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Language</label>
              <select name="language" className="form-select" value={form.language} onChange={onChange}>
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Credit By</label>
              <input name="creditBy" className="form-control" value={form.creditBy} onChange={onChange} />
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
