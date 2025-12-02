// // src/components/PublishEdition.js
// import React, { useState, useRef } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { auth, db, storage } from '../../firebase';
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
// } from 'firebase/firestore';
// import {
//   ref as storageRef,
//   uploadBytes,
//   getDownloadURL,
// } from 'firebase/storage';

// const initialForm = {
//   editionName: '',
//   alias: '',
//   editionDate: '', // yyyy-mm-dd
//   metaTitle: '',
//   metaDescription: '',
//   category: 'Main Edition',
//   status: '',
//   uploadType: '', // Image | PDF
//   file: null,     // image or pdf
// };

// const slugify = (str) =>
//   (str || '')
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '');

// const formatDateDDMMYYYY = (yyyyMmDd) => {
//   if (!yyyyMmDd) return '';
//   const [y, m, d] = yyyyMmDd.split('-');
//   return `${d}-${m}-${y}`;
// };

// function PublishEdition() {
//   const { currentUser: ctxUser } = useAuth?.() || {};
//   const currentUser = ctxUser || auth?.currentUser || null;

//   const [form, setForm] = useState(initialForm);
//   const [previewUrl, setPreviewUrl] = useState(null); // only for images
//   const [submitting, setSubmitting] = useState(false);
//   const fileInputRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const next = { ...form, [name]: value };
//     if (name === 'editionName' && !form.alias) next.alias = slugify(value);
//     setForm(next);
//   };

//   const handleFilePick = (e) => {
//     const file = e.target.files?.[0] || null;
//     setForm((prev) => ({ ...prev, file }));

//     if (file && form.uploadType === 'Image') {
//       setPreviewUrl(URL.createObjectURL(file));
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0] || null;
//     if (!file) return;
//     setForm((prev) => ({ ...prev, file }));
//     if (form.uploadType === 'Image') {
//       setPreviewUrl(URL.createObjectURL(file));
//     } else {
//       setPreviewUrl(null);
//     }
//   };
//   const preventDefault = (e) => e.preventDefault();

//   const resetForm = () => {
//     setForm(initialForm);
//     setPreviewUrl(null);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const extFromFile = (f) => {
//     if (!f?.name) return 'bin';
//     const parts = f.name.split('.');
//     return parts.length > 1 ? parts.pop().toLowerCase() : 'bin';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!currentUser?.uid) {
//       alert('You must be logged in.');
//       return;
//     }
//     if (!form.editionName || !form.category || !form.status || !form.uploadType) {
//       alert('Please fill all required fields (*)');
//       return;
//     }
//     if (!form.file) {
//       alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'Image'}.`);
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const uid = currentUser.uid;
//       const editionSlug = slugify(form.editionName);
//       const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

//       // 1) Upload file (Image or PDF) with proper contentType
//       const ext = extFromFile(form.file);
//       const filePath = `editions/${uid}/${editionSlug}-${Date.now()}.${ext}`;
//       const sRef = storageRef(storage, filePath);

//       const metadata = { contentType: form.file.type || (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream') };
//       await uploadBytes(sRef, form.file, metadata);
//       const fileUrl = await getDownloadURL(sRef);

//       // 2) Save Firestore doc
//       const itemsCol = collection(db, 'editions', uid, 'items');
//       const docData = {
//         editionName: form.editionName,
//         alias: form.alias,
//         editionDate: form.editionDate || null, // yyyy-mm-dd
//         editionDateDisplay: ddmmyyyy,          // dd-mm-yyyy
//         metaTitle: form.metaTitle || '',
//         metaDescription: form.metaDescription || '',
//         category: form.category,
//         status: form.status,
//         uploadType: form.uploadType, // Image | PDF
//         fileUrl,                     // image or pdf URL
//         storagePath: filePath,
//         createdBy: {
//           uid,
//           email: currentUser.email || '',
//           displayName: currentUser.displayName || '',
//         },
//         createdAt: serverTimestamp(),
//       };

//       await addDoc(itemsCol, docData);
//       alert('Edition saved successfully!');
//       resetForm();
//     } catch (err) {
//       console.error(err);
//       alert(`Failed to save edition: ${err.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const acceptTypes = form.uploadType === 'PDF' ? 'application/pdf' : 'image/*';

//   return (
//     <div className="container-fluid p-3">
//       <div className="row g-3">
//         <div className="col-12">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h6 className="mb-4"><span className="me-2">📤</span> CREATE NEW EDITION</h6>

//               <form onSubmit={handleSubmit}>
//                 <div className="row g-3">
//                   {/* LEFT column */}
//                   <div className="col-12 col-lg-6">
//                     <div className="mb-3">
//                       <label className="form-label">
//                         EDITION NAME: <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="editionName"
//                         placeholder="Aladin"
//                         value={form.editionName}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div className="row g-3">
//                       <div className="col-12 col-md-6">
//                         <label className="form-label">ALIAS (URL):</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           name="alias"
//                           placeholder="aladin"
//                           value={form.alias}
//                           onChange={handleChange}
//                         />
//                       </div>

//                       <div className="col-12 col-md-6">
//                         <label className="form-label">EDITION DATE:</label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           name="editionDate"
//                           value={form.editionDate}
//                           onChange={handleChange}
//                           placeholder="dd-mm-yyyy"
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-3 mt-3">
//                       <label className="form-label">META TITLE:</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="metaTitle"
//                         value={form.metaTitle}
//                         onChange={handleChange}
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">META DESCRIPTION:</label>
//                       <textarea
//                         className="form-control"
//                         rows={3}
//                         name="metaDescription"
//                         value={form.metaDescription}
//                         onChange={handleChange}
//                       />
//                     </div>

//                     <div className="row g-3">
//                       <div className="col-12 col-md-4">
//                         <label className="form-label">
//                           CATEGORY: <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className="form-select"
//                           name="category"
//                           value={form.category}
//                           onChange={handleChange}
//                           required
//                         >
//                           <option>Main Edition</option>
//                           <option>Special Edition</option>
//                           <option>Supplement</option>
//                         </select>
//                       </div>

//                       <div className="col-12 col-md-4">
//                         <label className="form-label">
//                           STATUS: <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className="form-select"
//                           name="status"
//                           value={form.status}
//                           onChange={handleChange}
//                           required
//                         >
//                           <option value="">Select One</option>
//                           <option value="Active">Active</option>
//                           <option value="Inactive">Inactive</option>
//                           <option value="Draft">Draft</option>
//                         </select>
//                       </div>

//                       <div className="col-12 col-md-4">
//                         <label className="form-label">
//                           UPLOAD TYPE: <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className="form-select"
//                           name="uploadType"
//                           value={form.uploadType}
//                           onChange={(e) => {
//                             // reset preview when switching types
//                             setPreviewUrl(null);
//                             handleChange(e);
//                             if (fileInputRef.current) fileInputRef.current.value = '';
//                             setForm((prev) => ({ ...prev, file: null }));
//                           }}
//                           required
//                         >
//                           <option value="">Select One</option>
//                           <option value="Image">Image</option>
//                           <option value="PDF">PDF</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* RIGHT column (uploader) */}
//                   <div className="col-12 col-lg-6">
//                     <div
//                       className="border rounded p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
//                       style={{ borderStyle: 'dashed' }}
//                       onDrop={handleDrop}
//                       onDragOver={preventDefault}
//                       onDragEnter={preventDefault}
//                     >
//                       {/* Preview area */}
//                       {form.uploadType === 'Image' && previewUrl && (
//                         <img
//                           src={previewUrl}
//                           alt="Preview"
//                           style={{ maxWidth: '220px', maxHeight: '220px' }}
//                           className="mb-3 rounded"
//                         />
//                       )}

//                       {form.uploadType === 'PDF' && form.file && (
//                         <div className="mb-3">
//                           <div className="fw-semibold">PDF Selected:</div>
//                           <div>{form.file.name}</div>
//                           <small className="text-muted">
//                             {(form.file.size / (1024 * 1024)).toFixed(2)} MB
//                           </small>
//                         </div>
//                       )}

                     

// {!form.file && (
//   <>
//     <div className="mb-2">
//       <img
//         src="https://via.placeholderPLOAD" />
//     </div> 
//     <p className="mb-2">
//       Drop, Upload or Paste {form.uploadType || 'file'}
//       <br />
//       <small className="text-muted">
//         {form.uploadType === 'PDF'
//           ? 'Supported format: PDF'
//           : 'Supported formats: JPG, PNG'}
//       </small>
//     </p>
//   </>
// )}



//                       <div className="d-flex gap-2">
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept={acceptTypes}
//                           className="form-control"
//                           onChange={handleFilePick}
//                           style={{ maxWidth: 280 }}
//                           disabled={!form.uploadType}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="col-12 d-flex justify-content-end gap-2 mt-3">
//                     <button
//                       type="submit"
//                       className="btn btn-primary"
//                       disabled={submitting}
//                     >
//                       {submitting ? 'Uploading…' : 'Review & Upload →'}
//                     </button>
//                     <button
//                       type="button"
//                       className="btn btn-danger"
//                       onClick={resetForm}
//                       disabled={submitting}
//                     >
//                       Reset
//                     </button>
//                   </div>
//                 </div>
//               </form>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PublishEdition;
// src/components/PublishEdition.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db, storage } from '../../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialForm = {
  editionName: '',
  alias: '',
  editionDate: '', // yyyy-mm-dd
  metaTitle: '',
  metaDescription: '',
  category: 'Main Edition',
  statusSelect: '', // '1' | '2' | '3' from select
  uploadType: '', // 'Image' | 'PDF'
  file: null,
  scheduleDatetime: '', // when statusSelect === '2' (datetime-local value)
};

const slugify = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const formatDateDDMMYYYY = (yyyyMmDd) => {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
};

export default function PublishEdition() {
  const { currentUser: ctxUser } = useAuth?.() || {};
  const currentUser = ctxUser || auth?.currentUser || null;

  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // When editionName or editionDate changes, auto-prefill alias/meta fields if they are empty or still default value
  useEffect(() => {
    // auto alias only when alias is empty or equals previous generated alias
    setForm((prev) => {
      const dd = formatDateDDMMYYYY(prev.editionDate);
      const generatedAlias = slugify(prev.editionName || '');
      const generatedMetaTitle = dd ? `${dd} Epaperdesk Demo: Read the latest epaper` : `${prev.editionName || ''} - Epaperdesk Demo`;
      const generatedMetaDesc = dd
        ? `Read todays Epaperdesk Demo ePaper from ${dd} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`
        : `Read todays Epaperdesk Demo ePaper for the latest news and updates. Stay informed on local, national, and international stories all in one place.`;

      // If alias is empty OR already matched the previously generated pattern, update it.
      const aliasShouldUpdate = !prev.alias || prev.alias === slugify(prev.editionName || '');
      const metaTitleShouldUpdate = !prev.metaTitle || prev.metaTitle.startsWith(dd) || prev.metaTitle.includes('Epaperdesk Demo');
      const metaDescShouldUpdate = !prev.metaDescription || prev.metaDescription.includes('Epaperdesk Demo');

      return {
        ...prev,
        alias: aliasShouldUpdate ? generatedAlias : prev.alias,
        metaTitle: metaTitleShouldUpdate ? generatedMetaTitle : prev.metaTitle,
        metaDescription: metaDescShouldUpdate ? generatedMetaDesc : prev.metaDescription,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.editionName, form.editionDate]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    // for scheduleDatetime we keep full datetime-local value
    setForm((p) => ({ ...p, [name]: value }));
    // Clear preview when changing uploadType will be handled where uploadType changes
  };

  const handleUploadTypeChange = (e) => {
    const value = e.target.value;
    // reset file & preview
    setForm((p) => ({ ...p, uploadType: value, file: null }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
    if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (!file) return;
    setForm((prev) => ({ ...prev, file }));
    if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const preventDefault = (e) => e.preventDefault();

  const resetForm = () => {
    setForm(initialForm);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const extFromFile = (f) => {
    if (!f?.name) return 'bin';
    const parts = f.name.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : 'bin';
  };

  // Map select value to status string stored in Firestore
  const statusFromSelect = (sel) => {
    switch (sel) {
      case '1': return 'Live Now';
      case '2': return 'Scheduled';
      case '3': return 'Draft';
      default: return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid) {
      alert('You must be logged in to create an edition.');
      return;
    }

    // Basic validation
    if (!form.editionName.trim()) {
      alert('Please enter Edition Name.');
      return;
    }
    if (!form.editionDate) {
      alert('Please select Edition Date.');
      return;
    }
    if (!form.statusSelect) {
      alert('Please select Status (Live Now / Make Schedule / Save in Draft).');
      return;
    }
    // If schedule selected, require scheduleDatetime
    if (form.statusSelect === '2' && !form.scheduleDatetime) {
      alert('Please select schedule date and time since you chose "MAKE SCHEDULE".');
      return;
    }

    // file is required for upload
    if (!form.file) {
      alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'file (image or PDF)'}.`);
      return;
    }
    if (!form.uploadType) {
      alert('Please select Upload Type (Image / PDF).');
      return;
    }

    setSubmitting(true);

    try {
      const uid = currentUser.uid;
      const editionSlug = form.alias || slugify(form.editionName);
      const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

      // Upload file to Firebase Storage
      const ext = extFromFile(form.file);
      const filePath = `editions/${uid}/${editionSlug}-${Date.now()}.${ext}`;
      const sRef = storageRef(storage, filePath);
      const metadata = { contentType: form.file.type || (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream') };

      await uploadBytes(sRef, form.file, metadata);
      const fileUrl = await getDownloadURL(sRef);

      // Prepare Firestore doc
      const itemsCol = collection(db, 'editions', uid, 'items');

      // Determine status & scheduledAt
      const status = statusFromSelect(form.statusSelect);
      let scheduledAt = null;
      let isScheduled = false;
      if (form.statusSelect === '2') {
        // user provided datetime-local => convert to JS Date
        scheduledAt = form.scheduleDatetime ? new Date(form.scheduleDatetime) : null;
        isScheduled = !!scheduledAt;
      }

      const docData = {
        editionName: form.editionName,
        alias: form.alias || editionSlug,
        editionDate: form.editionDate, // yyyy-mm-dd
        editionDateDisplay: ddmmyyyy,  // dd/mm/yyyy
        metaTitle: form.metaTitle || `${ddmmyyyy} Epaperdesk Demo: Read the latest epaper`,
        metaDescription: form.metaDescription || `Read todays Epaperdesk Demo ePaper from ${ddmmyyyy} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`,
        category: form.category,
        status,               // Live Now | Scheduled | Draft
        uploadType: form.uploadType,
        fileUrl,
        storagePath: filePath,
        isScheduled,
        scheduledAt: scheduledAt || null,
        createdBy: {
          uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(itemsCol, docData);
      alert('Edition saved successfully!');
      resetForm();
    } catch (err) {
      console.error('PublishEdition error:', err);
      alert(`Failed to save edition: ${err?.message || err}`);
    } finally {
      setSubmitting(false);
    }
  };

  const acceptTypes = form.uploadType === 'PDF' ? 'application/pdf' : 'image/*';

  return (
    <div className="container-fluid p-3">
      <div className="row g-3">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="mb-4"><span className="me-2">📤</span> CREATE NEW EDITION</h6>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* LEFT column */}
                  <div className="col-12 col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        EDITION NAME: <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="editionName"
                        placeholder="Etimes"
                        value={form.editionName}
                        onChange={(e) => handleFieldChange(e)}
                        onBlur={(e) => setForm((p) => ({ ...p, alias: p.alias || slugify(e.target.value) }))}
                        required
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label">ALIAS (URL):</label>
                        <input
                          type="text"
                          className="form-control"
                          name="alias"
                          placeholder="etimes"
                          value={form.alias}
                          onChange={handleFieldChange}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">EDITION DATE:</label>
                        <input
                          type="date"
                          className="form-control"
                          name="editionDate"
                          value={form.editionDate}
                          onChange={handleFieldChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3 mt-3">
                      <label className="form-label">META TITLE:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="metaTitle"
                        value={form.metaTitle}
                        onChange={handleFieldChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">META DESCRIPTION:</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        name="metaDescription"
                        value={form.metaDescription}
                        onChange={handleFieldChange}
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-12 col-md-4">
                        <label className="form-label">
                          CATEGORY: <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="category"
                          value={form.category}
                          onChange={handleFieldChange}
                        >
                          <option>Main Edition</option>
                          <option>Special Edition</option>
                          <option>Supplement</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">
                          STATUS: <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control select2 form-select"
                          name="statusSelect"
                          value={form.statusSelect}
                          onChange={handleFieldChange}
                        >
                          <option value="">Select One</option>
                          <option value="1">LIVE NOW</option>
                          <option value="2">MAKE SCHEDULE</option>
                          <option value="3">SAVE IN DRAFT</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">
                          UPLOAD TYPE: <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="uploadType"
                          value={form.uploadType}
                          onChange={handleUploadTypeChange}
                        >
                          <option value="">Select One</option>
                          <option value="Image">Image</option>
                          <option value="PDF">PDF</option>
                        </select>
                      </div>
                    </div>

                    {/* Schedule datetime appears only when MAKE SCHEDULE selected */}
                    {form.statusSelect === '2' && (
                      <div className="mt-3">
                        <label className="form-label">Schedule Date & Time:</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="scheduleDatetime"
                          value={form.scheduleDatetime}
                          onChange={handleFieldChange}
                        />
                        <small className="text-muted">Choose date and time to publish edition.</small>
                      </div>
                    )}
                  </div>

                  {/* RIGHT column (uploader) */}
                  <div className="col-12 col-lg-6">
                    <div
                      className="border rounded p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
                      style={{ borderStyle: 'dashed' }}
                      onDrop={handleDrop}
                      onDragOver={preventDefault}
                      onDragEnter={preventDefault}
                    >
                      {/* Preview area */}
                      {form.uploadType === 'Image' && previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ maxWidth: '260px', maxHeight: '260px' }}
                          className="mb-3 rounded"
                        />
                      )}

                      {form.uploadType === 'PDF' && form.file && (
                        <div className="mb-3">
                          <div className="fw-semibold">PDF Selected:</div>
                          <div>{form.file.name}</div>
                          <small className="text-muted">
                            {(form.file.size / (1024 * 1024)).toFixed(2)} MB
                          </small>
                        </div>
                      )}

                      {!form.file && (
                        <>
                          <div className="mb-2">
                            {/* placeholder illustration */}
                            <svg width="120" height="90" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
                              <rect width="120" height="90" rx="8" fill="#f3f4f6" />
                            </svg>
                          </div>
                          <p className="mb-2">
                            Drop, Upload or Paste {form.uploadType || 'file'}
                            <br />
                            <small className="text-muted">
                              {form.uploadType === 'PDF'
                                ? 'Supported format: PDF'
                                : 'Supported formats: JPG, PNG'}
                            </small>
                          </p>
                        </>
                      )}

                      <div className="d-flex gap-2 mt-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={acceptTypes}
                          className="form-control"
                          onChange={handleFilePick}
                          style={{ maxWidth: 320 }}
                          disabled={!form.uploadType}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Uploading…' : 'Review & Upload →'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={resetForm}
                      disabled={submitting}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
