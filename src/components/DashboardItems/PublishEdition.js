// // // // src/components/PublishEdition.js
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import { useAuth } from '../../contexts/AuthContext';
// // // import { auth, db, storage } from '../../firebase';
// // // import {
// // //   collection,
// // //   addDoc,
// // //   serverTimestamp,
// // // } from 'firebase/firestore';
// // // import {
// // //   ref as storageRef,
// // //   uploadBytes,
// // //   getDownloadURL,
// // // } from 'firebase/storage';
// // // import 'bootstrap/dist/css/bootstrap.min.css';

// // // const initialForm = {
// // //   editionName: '',
// // //   alias: '',
// // //   editionDate: '', // yyyy-mm-dd
// // //   metaTitle: '',
// // //   metaDescription: '',
// // //   category: 'Main Edition',
// // //   statusSelect: '', // '1' | '2' | '3' from select
// // //   uploadType: '', // 'Image' | 'PDF'
// // //   file: null,
// // //   scheduleDatetime: '', // when statusSelect === '2' (datetime-local value)
// // // };

// // // const slugify = (str) =>
// // //   (str || '')
// // //     .toLowerCase()
// // //     .trim()
// // //     .replace(/[^a-z0-9]+/g, '-')
// // //     .replace(/(^-|-$)/g, '');

// // // const formatDateDDMMYYYY = (yyyyMmDd) => {
// // //   if (!yyyyMmDd) return '';
// // //   const [y, m, d] = yyyyMmDd.split('-');
// // //   if (!y || !m || !d) return '';
// // //   return `${d}/${m}/${y}`;
// // // };

// // // export default function PublishEdition() {
// // //   const { currentUser: ctxUser } = useAuth?.() || {};
// // //   const currentUser = ctxUser || auth?.currentUser || null;

// // //   const [form, setForm] = useState(initialForm);
// // //   const [previewUrl, setPreviewUrl] = useState(null);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const fileInputRef = useRef(null);

// // //   // When editionName or editionDate changes, auto-prefill alias/meta fields if they are empty or still default value
// // //   useEffect(() => {
// // //     // auto alias only when alias is empty or equals previous generated alias
// // //     setForm((prev) => {
// // //       const dd = formatDateDDMMYYYY(prev.editionDate);
// // //       const generatedAlias = slugify(prev.editionName || '');
// // //       const generatedMetaTitle = dd ? `${dd} - ${prev.editionName} E-Paper : Read the latest epaper` : `${prev.editionName || ''} - Epaperdesk Demo`;
// // //       const generatedMetaDesc = dd
// // //         ? `Read todays ${dd} - ${prev.editionName} E-Paper  ePaper from ${dd} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`
// // //         : `Read todays ${prev.editionName} ePaper for the latest news and updates. Stay informed on local, national, and international stories all in one place.`;

// // //       // If alias is empty OR already matched the previously generated pattern, update it.
// // //       const aliasShouldUpdate = !prev.alias || prev.alias === slugify(prev.editionName || '');
// // //       const metaTitleShouldUpdate = !prev.metaTitle || prev.metaTitle.startsWith(dd) || prev.metaTitle.includes('Epaperdesk Demo');
// // //       const metaDescShouldUpdate = !prev.metaDescription || prev.metaDescription.includes('Epaperdesk Demo');

// // //       return {
// // //         ...prev,
// // //         alias: aliasShouldUpdate ? generatedAlias : prev.alias,
// // //         metaTitle: metaTitleShouldUpdate ? generatedMetaTitle : prev.metaTitle,
// // //         metaDescription: metaDescShouldUpdate ? generatedMetaDesc : prev.metaDescription,
// // //       };
// // //     });
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [form.editionName, form.editionDate]);

// // //   const handleFieldChange = (e) => {
// // //     const { name, value } = e.target;
// // //     // for scheduleDatetime we keep full datetime-local value
// // //     setForm((p) => ({ ...p, [name]: value }));
// // //     // Clear preview when changing uploadType will be handled where uploadType changes
// // //   };

// // //   const handleUploadTypeChange = (e) => {
// // //     const value = e.target.value;
// // //     // reset file & preview
// // //     setForm((p) => ({ ...p, uploadType: value, file: null }));
// // //     setPreviewUrl(null);
// // //     if (fileInputRef.current) fileInputRef.current.value = '';
// // //   };

// // //   const handleFilePick = (e) => {
// // //     const file = e.target.files?.[0] || null;
// // //     setForm((prev) => ({ ...prev, file }));
// // //     if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
// // //       setPreviewUrl(URL.createObjectURL(file));
// // //     } else {
// // //       setPreviewUrl(null);
// // //     }
// // //   };

// // //   const handleDrop = (e) => {
// // //     e.preventDefault();
// // //     const file = e.dataTransfer.files?.[0] || null;
// // //     if (!file) return;
// // //     setForm((prev) => ({ ...prev, file }));
// // //     if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
// // //       setPreviewUrl(URL.createObjectURL(file));
// // //     } else {
// // //       setPreviewUrl(null);
// // //     }
// // //   };

// // //   const preventDefault = (e) => e.preventDefault();

// // //   const resetForm = () => {
// // //     setForm(initialForm);
// // //     setPreviewUrl(null);
// // //     if (fileInputRef.current) fileInputRef.current.value = '';
// // //   };

// // //   const extFromFile = (f) => {
// // //     if (!f?.name) return 'bin';
// // //     const parts = f.name.split('.');
// // //     return parts.length > 1 ? parts.pop().toLowerCase() : 'bin';
// // //   };

// // //   // Map select value to status string stored in Firestore
// // //   const statusFromSelect = (sel) => {
// // //     switch (sel) {
// // //       case '1': return 'Live Now';
// // //       case '2': return 'Scheduled';
// // //       case '3': return 'Draft';
// // //       default: return '';
// // //     }
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!currentUser?.uid) {
// // //       alert('You must be logged in to create an edition.');
// // //       return;
// // //     }

// // //     // Basic validation
// // //     if (!form.editionName.trim()) {
// // //       alert('Please enter Edition Name.');
// // //       return;
// // //     }
// // //     if (!form.editionDate) {
// // //       alert('Please select Edition Date.');
// // //       return;
// // //     }
// // //     if (!form.statusSelect) {
// // //       alert('Please select Status (Live Now / Make Schedule / Save in Draft).');
// // //       return;
// // //     }
// // //     // If schedule selected, require scheduleDatetime
// // //     if (form.statusSelect === '2' && !form.scheduleDatetime) {
// // //       alert('Please select schedule date and time since you chose "MAKE SCHEDULE".');
// // //       return;
// // //     }

// // //     // file is required for upload
// // //     if (!form.file) {
// // //       alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'file (image or PDF)'}.`);
// // //       return;
// // //     }
// // //     if (!form.uploadType) {
// // //       alert('Please select Upload Type (Image / PDF).');
// // //       return;
// // //     }

// // //     setSubmitting(true);

// // //     try {
// // //       const uid = currentUser.uid;
// // //       const editionSlug = form.alias || slugify(form.editionName);
// // //       const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

// // //       // Upload file to Firebase Storage
// // //       const ext = extFromFile(form.file);
// // //       const filePath = `editions/${uid}/${editionSlug}-${Date.now()}.${ext}`;
// // //       const sRef = storageRef(storage, filePath);
// // //       const metadata = { contentType: form.file.type || (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream') };

// // //       await uploadBytes(sRef, form.file, metadata);
// // //       const fileUrl = await getDownloadURL(sRef);

// // //       // Prepare Firestore doc
// // //       const itemsCol = collection(db, 'editions', uid, 'items');

// // //       // Determine status & scheduledAt
// // //       const status = statusFromSelect(form.statusSelect);
// // //       let scheduledAt = null;
// // //       let isScheduled = false;
// // //       if (form.statusSelect === '2') {
// // //         // user provided datetime-local => convert to JS Date
// // //         scheduledAt = form.scheduleDatetime ? new Date(form.scheduleDatetime) : null;
// // //         isScheduled = !!scheduledAt;
// // //       }

// // //       const docData = {
// // //         editionName: form.editionName,
// // //         alias: form.alias || editionSlug,
// // //         editionDate: form.editionDate, // yyyy-mm-dd
// // //         editionDateDisplay: ddmmyyyy,  // dd/mm/yyyy
// // //         metaTitle: form.metaTitle || `${ddmmyyyy} Epaperdesk Demo: Read the latest epaper`,
// // //         metaDescription: form.metaDescription || `Read todays ${form.editionName } ePaper from ${ddmmyyyy} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`,
// // //         category: form.category,
// // //         status,               // Live Now | Scheduled | Draft
// // //         uploadType: form.uploadType,
// // //         fileUrl,
// // //         storagePath: filePath,
// // //         isScheduled,
// // //         scheduledAt: scheduledAt || null,
// // //         createdBy: {
// // //           uid,
// // //           email: currentUser.email || '',
// // //           displayName: currentUser.displayName || '',
// // //         },
// // //         createdAt: serverTimestamp(),
// // //       };

// // //       await addDoc(itemsCol, docData);
// // //       alert('Edition saved successfully!');
// // //       resetForm();
// // //     } catch (err) {
// // //       console.error('PublishEdition error:', err);
// // //       alert(`Failed to save edition: ${err?.message || err}`);
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   const acceptTypes = form.uploadType === 'PDF' ? 'application/pdf' : 'image/*';

// // //   return (
// // //     <div className="container-fluid p-3">
// // //       <div className="row g-3">
// // //         <div className="col-12">
// // //           <div className="card shadow-sm">
// // //             <div className="card-body">
// // //               <h6 className="mb-4"><span className="me-2">📤</span> CREATE NEW EDITION</h6>

// // //               <form onSubmit={handleSubmit}>
// // //                 <div className="row g-3">
// // //                   {/* LEFT column */}
// // //                   <div className="col-12 col-lg-6">
// // //                     <div className="mb-3">
// // //                       <label className="form-label">
// // //                         EDITION NAME: <span className="text-danger">*</span>
// // //                       </label>
// // //                       <input
// // //                         type="text"
// // //                         className="form-control"
// // //                         name="editionName"
// // //                         placeholder="Etimes"
// // //                         value={form.editionName}
// // //                         onChange={(e) => handleFieldChange(e)}
// // //                         onBlur={(e) => setForm((p) => ({ ...p, alias: p.alias || slugify(e.target.value) }))}
// // //                         required
// // //                       />
// // //                     </div>

// // //                     <div className="row g-3">
// // //                       <div className="col-12 col-md-6">
// // //                         <label className="form-label">ALIAS (URL):</label>
// // //                         <input
// // //                           type="text"
// // //                           className="form-control"
// // //                           name="alias"
// // //                           placeholder="etimes"
// // //                           value={form.alias}
// // //                           onChange={handleFieldChange}
// // //                         />
// // //                       </div>

// // //                       <div className="col-12 col-md-6">
// // //                         <label className="form-label">EDITION DATE:</label>
// // //                         <input
// // //                           type="date"
// // //                           className="form-control"
// // //                           name="editionDate"
// // //                           value={form.editionDate}
// // //                           onChange={handleFieldChange}
// // //                         />
// // //                       </div>
// // //                     </div>

// // //                     <div className="mb-3 mt-3">
// // //                       <label className="form-label">META TITLE:</label>
// // //                       <input
// // //                         type="text"
// // //                         className="form-control"
// // //                         name="metaTitle"
// // //                         value={form.metaTitle}
// // //                         onChange={handleFieldChange}
// // //                       />
// // //                     </div>

// // //                     <div className="mb-3">
// // //                       <label className="form-label">META DESCRIPTION:</label>
// // //                       <textarea
// // //                         className="form-control"
// // //                         rows={3}
// // //                         name="metaDescription"
// // //                         value={form.metaDescription}
// // //                         onChange={handleFieldChange}
// // //                       />
// // //                     </div>

// // //                     <div className="row g-3">
// // //                       <div className="col-12 col-md-4">
// // //                         <label className="form-label">
// // //                           CATEGORY: <span className="text-danger">*</span>
// // //                         </label>
// // //                         <select
// // //                           className="form-select"
// // //                           name="category"
// // //                           value={form.category}
// // //                           onChange={handleFieldChange}
// // //                         >
// // //                           <option>Main Edition</option>
// // //                           <option>Special Edition</option>
// // //                           <option>Supplement</option>
// // //                         </select>
// // //                       </div>

// // //                       <div className="col-12 col-md-4">
// // //                         <label className="form-label">
// // //                           STATUS: <span className="text-danger">*</span>
// // //                         </label>
// // //                         <select
// // //                           className="form-control select2 form-select"
// // //                           name="statusSelect"
// // //                           value={form.statusSelect}
// // //                           onChange={handleFieldChange}
// // //                         >
// // //                           <option value="">Select One</option>
// // //                           <option value="1">LIVE NOW</option>
// // //                           <option value="2">MAKE SCHEDULE</option>
// // //                           <option value="3">SAVE IN DRAFT</option>
// // //                         </select>
// // //                       </div>

// // //                       <div className="col-12 col-md-4">
// // //                         <label className="form-label">
// // //                           UPLOAD TYPE: <span className="text-danger">*</span>
// // //                         </label>
// // //                         <select
// // //                           className="form-select"
// // //                           name="uploadType"
// // //                           value={form.uploadType}
// // //                           onChange={handleUploadTypeChange}
// // //                         >
// // //                           <option value="">Select One</option>
// // //                           <option value="Image">Image</option>
// // //                           <option value="PDF">PDF</option>
// // //                         </select>
// // //                       </div>
// // //                     </div>

// // //                     {/* Schedule datetime appears only when MAKE SCHEDULE selected */}
// // //                     {form.statusSelect === '2' && (
// // //                       <div className="mt-3">
// // //                         <label className="form-label">Schedule Date & Time:</label>
// // //                         <input
// // //                           type="datetime-local"
// // //                           className="form-control"
// // //                           name="scheduleDatetime"
// // //                           value={form.scheduleDatetime}
// // //                           onChange={handleFieldChange}
// // //                         />
// // //                         <small className="text-muted">Choose date and time to publish edition.</small>
// // //                       </div>
// // //                     )}
// // //                   </div>

// // //                   {/* RIGHT column (uploader) */}
// // //                   <div className="col-12 col-lg-6">
// // //                     <div
// // //                       className="border rounded p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
// // //                       style={{ borderStyle: 'dashed' }}
// // //                       onDrop={handleDrop}
// // //                       onDragOver={preventDefault}
// // //                       onDragEnter={preventDefault}
// // //                     >
// // //                       {/* Preview area */}
// // //                       {form.uploadType === 'Image' && previewUrl && (
// // //                         <img
// // //                           src={previewUrl}
// // //                           alt="Preview"
// // //                           style={{ maxWidth: '260px', maxHeight: '260px' }}
// // //                           className="mb-3 rounded"
// // //                         />
// // //                       )}

// // //                       {form.uploadType === 'PDF' && form.file && (
// // //                         <div className="mb-3">
// // //                           <div className="fw-semibold">PDF Selected:</div>
// // //                           <div>{form.file.name}</div>
// // //                           <small className="text-muted">
// // //                             {(form.file.size / (1024 * 1024)).toFixed(2)} MB
// // //                           </small>
// // //                         </div>
// // //                       )}

// // //                       {!form.file && (
// // //                         <>
// // //                           <div className="mb-2">
// // //                             {/* placeholder illustration */}
// // //                             <svg width="120" height="90" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
// // //                               <rect width="120" height="90" rx="8" fill="#f3f4f6" />
// // //                             </svg>
// // //                           </div>
// // //                           <p className="mb-2">
// // //                             Drop, Upload or Paste {form.uploadType || 'file'}
// // //                             <br />
// // //                             <small className="text-muted">
// // //                               {form.uploadType === 'PDF'
// // //                                 ? 'Supported format: PDF'
// // //                                 : 'Supported formats: JPG, PNG'}
// // //                             </small>
// // //                           </p>
// // //                         </>
// // //                       )}

// // //                       <div className="d-flex gap-2 mt-2">
// // //                         <input
// // //                           ref={fileInputRef}
// // //                           type="file"
// // //                           accept={acceptTypes}
// // //                           className="form-control"
// // //                           onChange={handleFilePick}
// // //                           style={{ maxWidth: 320 }}
// // //                           disabled={!form.uploadType}
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {/* Actions */}
// // //                   <div className="col-12 d-flex justify-content-end gap-2 mt-3">
// // //                     <button
// // //                       type="submit"
// // //                       className="btn btn-primary"
// // //                       disabled={submitting}
// // //                     >
// // //                       {submitting ? 'Uploading…' : 'Review & Upload →'}
// // //                     </button>
// // //                     <button
// // //                       type="button"
// // //                       className="btn btn-danger"
// // //                       onClick={resetForm}
// // //                       disabled={submitting}
// // //                     >
// // //                       Reset
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </form>

// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // src/components/PublishEdition.js
// // import React, { useState, useRef, useEffect } from 'react';
// // import { useAuth } from '../../contexts/AuthContext';
// // import { auth, db, storage } from '../../firebase';
// // import {
// //   collection,
// //   addDoc,
// //   serverTimestamp,
// // } from 'firebase/firestore';
// // import {
// //   ref as storageRef,
// //   uploadBytes,
// //   getDownloadURL,
// // } from 'firebase/storage';
// // import 'bootstrap/dist/css/bootstrap.min.css';


// // // --- PDF.js for first-page image generation (only when uploadType === 'PDF') ---
// // import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// // import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


// // const initialForm = {
// //   editionName: '',
// //   alias: '',
// //   editionDate: '', // yyyy-mm-dd
// //   metaTitle: '',
// //   metaDescription: '',
// //   category: 'Main Edition',
// //   statusSelect: '', // '1' | '2' | '3'
// //   uploadType: '',   // 'Image' | 'PDF'
// //   file: null,
// //   scheduleDatetime: '', // when statusSelect === '2'
// // };

// // const slugify = (str) =>
// //   (str || '')
// //     .toLowerCase()
// //     .trim()
// //     .replace(/[^\-a-z0-9]+/g, '-')
// //     .replace(/(^\-|\-$)/g, '');

// // const formatDateDDMMYYYY = (yyyyMmDd) => {
// //   if (!yyyyMmDd) return '';
// //   const [y, m, d] = yyyyMmDd.split('-');
// //   if (!y || !m || !d) return '';
// //   return `${d}/${m}/${y}`;
// // };

// // export default function PublishEdition() {
// //   const { currentUser: ctxUser } = useAuth?.() || {};
// //   const currentUser = ctxUser || auth?.currentUser || null;
// //   const [form, setForm] = useState(initialForm);
// //   const [previewUrl, setPreviewUrl] = useState(null);
// //   const [submitting, setSubmitting] = useState(false);
// //   const fileInputRef = useRef(null);

// //   // Auto meta/alias helpers
// //   useEffect(() => {
// //     setForm((prev) => {
// //       const dd = formatDateDDMMYYYY(prev.editionDate);
// //       const generatedAlias = slugify(prev.editionName || '');
// //       const generatedMetaTitle = dd
// //         ? `${dd} - ${prev.editionName} E-Paper : Read the latest epaper`
// //         : `${prev.editionName || ''} - Epaperdesk Demo`;
// //       const generatedMetaDesc = dd
// //         ? `Read todays ${dd} - ${prev.editionName} E-Paper ePaper from ${dd} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`
// //         : `Read todays ${prev.editionName} ePaper for the latest news and updates. Stay informed on local, national, and international stories all in one place.`;

// //       const aliasShouldUpdate = !prev.alias || prev.alias === slugify(prev.editionName || '');
// //       const metaTitleShouldUpdate =
// //         !prev.metaTitle || prev.metaTitle.startsWith(dd) || prev.metaTitle.includes('Epaperdesk Demo');
// //       const metaDescShouldUpdate =
// //         !prev.metaDescription || prev.metaDescription.includes('Epaperdesk Demo');

// //       return {
// //         ...prev,
// //         alias: aliasShouldUpdate ? generatedAlias : prev.alias,
// //         metaTitle: metaTitleShouldUpdate ? generatedMetaTitle : prev.metaTitle,
// //         metaDescription: metaDescShouldUpdate ? generatedMetaDesc : prev.metaDescription,
// //       };
// //     });
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [form.editionName, form.editionDate]);

// //   const handleFieldChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm((p) => ({ ...p, [name]: value }));
// //   };

// //   const handleUploadTypeChange = (e) => {
// //     const value = e.target.value;
// //     setForm((p) => ({ ...p, uploadType: value, file: null }));
// //     setPreviewUrl(null);
// //     if (fileInputRef.current) fileInputRef.current.value = '';
// //   };

// //   const handleFilePick = (e) => {
// //     const file = e.target.files?.[0] || null;
// //     setForm((prev) => ({ ...prev, file }));
// //     if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
// //       setPreviewUrl(URL.createObjectURL(file));
// //     } else {
// //       setPreviewUrl(null);
// //     }
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     const file = e.dataTransfer.files?.[0] || null;
// //     if (!file) return;
// //     setForm((prev) => ({ ...prev, file }));
// //     if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
// //       setPreviewUrl(URL.createObjectURL(file));
// //     } else {
// //       setPreviewUrl(null);
// //     }
// //   };

// //   const preventDefault = (e) => e.preventDefault();

// //   const resetForm = () => {
// //     setForm(initialForm);
// //     setPreviewUrl(null);
// //     if (fileInputRef.current) fileInputRef.current.value = '';
// //   };

// //   const extFromFile = (f) => {
// //     if (!f?.name) return 'bin';
// //     const parts = f.name.split('.');
// //     return parts.length > 1 ? parts.pop().toLowerCase() : 'bin';
// //   };

// //   const statusFromSelect = (sel) => {
// //     switch (sel) {
// //       case '1': return 'Live Now';
// //       case '2': return 'Scheduled';
// //       case '3': return 'Draft';
// //       default: return '';
// //     }
// //   };

// //   // --- Render first page of a PDF to JPEG Blob ---
// //   async function renderFirstPageJPEGBlob(file, scale = 1.4, quality = 0.85) {
// //     const ab = await file.arrayBuffer();
// //     const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
// //     const page = await pdf.getPage(1);
// //     const viewport = page.getViewport({ scale });

// //     const canvas = document.createElement('canvas');
// //     canvas.width = Math.floor(viewport.width);
// //     canvas.height = Math.floor(viewport.height);
// //     const ctx = canvas.getContext('2d', { willReadFrequently: true });
// //     await page.render({ canvasContext: ctx, viewport }).promise;

// //     // Convert to JPEG Blob
// //     const dataUrl = canvas.toDataURL('image/jpeg', quality);
// //     const res = await fetch(dataUrl);
// //     const blob = await res.blob();
// //     return blob; // JPEG blob ready to upload
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!currentUser?.uid) {
// //       alert('You must be logged in to create an edition.');
// //       return;
// //     }

// //     // Basic validation
// //     if (!form.editionName.trim()) {
// //       alert('Please enter Edition Name.');
// //       return;
// //     }
// //     if (!form.editionDate) {
// //       alert('Please select Edition Date.');
// //       return;
// //     }
// //     if (!form.statusSelect) {
// //       alert('Please select Status (Live Now / Make Schedule / Save in Draft).');
// //       return;
// //     }
// //     if (form.statusSelect === '2' && !form.scheduleDatetime) {
// //       alert('Please select schedule date and time since you chose "MAKE SCHEDULE".');
// //       return;
// //     }
// //     if (!form.file) {
// //       alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'file (image or PDF)'}.`);
// //       return;
// //     }
// //     if (!form.uploadType) {
// //       alert('Please select Upload Type (Image / PDF).');
// //       return;
// //     }

// //     setSubmitting(true);

// //     try {
// //       const uid = currentUser.uid;
// //       const editionSlug = form.alias || slugify(form.editionName);
// //       const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

// //       // Upload the main file to Storage
// //       const ext = extFromFile(form.file);
// //       const ts = Date.now();
// //       const filePath = `editions/${uid}/${editionSlug}-${ts}.${ext}`;
// //       const sRef = storageRef(storage, filePath);

// //       const metadata = { contentType: form.file.type || (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream') };
// //       await uploadBytes(sRef, form.file, metadata);
// //       const fileUrl = await getDownloadURL(sRef);

// //       // If PDF, generate first-page JPEG and upload it
// //       let firstPageImageUrl = null;
// //       let firstPageImagePath = null;
// //       if (form.uploadType === 'PDF') {
// //         try {
// //           const jpegBlob = await renderFirstPageJPEGBlob(form.file, 1.3, 0.86);
// //           firstPageImagePath = `editions/${uid}/${editionSlug}-${ts}-page1.jpg`;
// //           const imgRef = storageRef(storage, firstPageImagePath);
// //           await uploadBytes(imgRef, jpegBlob, { contentType: 'image/jpeg' });
// //           firstPageImageUrl = await getDownloadURL(imgRef);
// //         } catch (imgErr) {
// //           console.warn('First page image generation failed; continuing without placeholder.', imgErr);
// //         }
// //       }

// //       // Prepare Firestore doc
// //       const itemsCol = collection(db, 'editions', uid, 'items');
// //       const status = statusFromSelect(form.statusSelect);
// //       let scheduledAt = null;
// //       let isScheduled = false;
// //       if (form.statusSelect === '2') {
// //         scheduledAt = form.scheduleDatetime ? new Date(form.scheduleDatetime) : null;
// //         isScheduled = !!scheduledAt;
// //       }

// //       const docData = {
// //         editionName: form.editionName,
// //         alias: form.alias || editionSlug,
// //         editionSlug,
// //         editionDate: form.editionDate,
// //         editionDateDisplay: ddmmyyyy,
// //         metaTitle: form.metaTitle || `${ddmmyyyy} Epaperdesk Demo: Read the latest epaper`,
// //         metaDescription:
// //           form.metaDescription ||
// //           `Read todays ${form.editionName} ePaper from ${ddmmyyyy} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`,
// //         category: form.category,
// //         status,              // Live Now | Scheduled | Draft
// //         uploadType: form.uploadType,
// //         fileUrl,             // PDF or image URL
// //         storagePath: filePath,
// //         // new fields to support instant first paint in viewer
// //         firstPageImageUrl: firstPageImageUrl || null,
// //         firstPageImagePath: firstPageImagePath || null,
// //         hasFirstPageImage: !!firstPageImageUrl,
// //         isScheduled,
// //         scheduledAt: scheduledAt || null,
// //         createdBy: {
// //           uid,
// //           email: currentUser.email || '',
// //           displayName: currentUser.displayName || '',
// //         },
// //         createdAt: serverTimestamp(),
// //       };

// //       await addDoc(itemsCol, docData);
// //       alert('Edition saved successfully!');
// //       resetForm();
// //     } catch (err) {
// //       console.error('PublishEdition error:', err);
// //       alert(`Failed to save edition: ${err?.message || err}`);
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const acceptTypes = form.uploadType === 'PDF' ? 'application/pdf' : 'image/*';

// //   return (
// //     <div className="container-fluid p-3">
// //       <div className="row g-3">
// //         <div className="col-12">
// //           <div className="card shadow-sm">
// //             <div className="card-body">
// //               <h6 className="mb-4"><span className="me-2">📤</span> CREATE NEW EDITION</h6>
// //               <form onSubmit={handleSubmit}>
// //                 <div className="row g-3">
// //                   {/* LEFT column */}
// //                   <div className="col-12 col-lg-6">
// //                     <div className="mb-3">
// //                       <label className="form-label">
// //                         EDITION NAME: <span className="text-danger">*</span>
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="form-control"
// //                         name="editionName"
// //                         placeholder="Etimes"
// //                         value={form.editionName}
// //                         onChange={(e) => handleFieldChange(e)}
// //                         onBlur={(e) => setForm((p) => ({ ...p, alias: p.alias || slugify(e.target.value) }))}
// //                         required
// //                       />
// //                     </div>

// //                     <div className="row g-3">
// //                       <div className="col-12 col-md-6">
// //                         <label className="form-label">ALIAS (URL):</label>
// //                         <input
// //                           type="text"
// //                           className="form-control"
// //                           name="alias"
// //                           placeholder="etimes"
// //                           value={form.alias}
// //                           onChange={handleFieldChange}
// //                         />
// //                       </div>
// //                       <div className="col-12 col-md-6">
// //                         <label className="form-label">EDITION DATE:</label>
// //                         <input
// //                           type="date"
// //                           className="form-control"
// //                           name="editionDate"
// //                           value={form.editionDate}
// //                           onChange={handleFieldChange}
// //                         />
// //                       </div>
// //                     </div>

// //                     <div className="mb-3 mt-3">
// //                       <label className="form-label">META TITLE:</label>
// //                       <input
// //                         type="text"
// //                         className="form-control"
// //                         name="metaTitle"
// //                         value={form.metaTitle}
// //                         onChange={handleFieldChange}
// //                       />
// //                     </div>

// //                     <div className="mb-3">
// //                       <label className="form-label">META DESCRIPTION:</label>
// //                       <textarea
// //                         className="form-control"
// //                         rows={3}
// //                         name="metaDescription"
// //                         value={form.metaDescription}
// //                         onChange={handleFieldChange}
// //                       />
// //                     </div>

// //                     <div className="row g-3">
// //                       <div className="col-12 col-md-4">
// //                         <label className="form-label">
// //                           CATEGORY: <span className="text-danger">*</span>
// //                         </label>
// //                         <select
// //                           className="form-select"
// //                           name="category"
// //                           value={form.category}
// //                           onChange={handleFieldChange}
// //                         >
// //                           <option>Main Edition</option>
// //                           <option>Special Edition</option>
// //                           <option>Supplement</option>
// //                         </select>
// //                       </div>
// //                       <div className="col-12 col-md-4">
// //                         <label className="form-label">
// //                           STATUS: <span className="text-danger">*</span>
// //                         </label>
// //                         <select
// //                           className="form-control select2 form-select"
// //                           name="statusSelect"
// //                           value={form.statusSelect}
// //                           onChange={handleFieldChange}
// //                         >
// //                           <option value="">Select One</option>
// //                           <option value="1">LIVE NOW</option>
// //                           <option value="2">MAKE SCHEDULE</option>
// //                           <option value="3">SAVE IN DRAFT</option>
// //                         </select>
// //                       </div>
// //                       <div className="col-12 col-md-4">
// //                         <label className="form-label">
// //                           UPLOAD TYPE: <span className="text-danger">*</span>
// //                         </label>
// //                         <select
// //                           className="form-select"
// //                           name="uploadType"
// //                           value={form.uploadType}
// //                           onChange={handleUploadTypeChange}
// //                         >
// //                           <option value="">Select One</option>
// //                           <option value="Image">Image</option>
// //                           <option value="PDF">PDF</option>
// //                         </select>
// //                       </div>
// //                     </div>

// //                     {/* Schedule datetime */}
// //                     {form.statusSelect === '2' && (
// //                       <div className="mt-3">
// //                         <label className="form-label">Schedule Date & Time:</label>
// //                         <input
// //                           type="datetime-local"
// //                           className="form-control"
// //                           name="scheduleDatetime"
// //                           value={form.scheduleDatetime}
// //                           onChange={handleFieldChange}
// //                         />
// //                         <small className="text-muted">Choose date and time to publish edition.</small>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* RIGHT column (uploader) */}
// //                   <div className="col-12 col-lg-6">
// //                     <div
// //                       className="border rounded p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
// //                       style={{ borderStyle: 'dashed' }}
// //                       onDrop={handleDrop}
// //                       onDragOver={preventDefault}
// //                       onDragEnter={preventDefault}
// //                     >
// //                       {/* Preview area */}
// //                       {form.uploadType === 'Image' && previewUrl && (
// //                         <img
// //                           src={previewUrl}
// //                           alt="Preview"
// //                           style={{ maxWidth: '260px', maxHeight: '260px' }}
// //                           className="mb-3 rounded"
// //                         />
// //                       )}

// //                       {form.uploadType === 'PDF' && form.file && (
// //                         <div className="mb-3">
// //                           <div className="fw-semibold">PDF Selected:</div>
// //                           <div>{form.file.name}</div>
// //                           <small className="text-muted">
// //                             {(form.file.size / (1024 * 1024)).toFixed(2)} MB
// //                           </small>
// //                         </div>
// //                       )}

// //                       {!form.file && (
// //                         <>
// //                           <div className="mb-2">
// //                             {/* placeholder illustration */}
// //                             <svg width="120" height="90" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
// //                               <rect width="120" height="90" rx="8" fill="#f3f4f6" />
// //                             </svg>
// //                           </div>
// //                           <p className="mb-2">
// //                             Drop, Upload or Paste {form.uploadType || 'file'}
// //                             <br />
// //                             <small className="text-muted">
// //                               {form.uploadType === 'PDF'
// //                                 ? 'Supported format: PDF'
// //                                 : 'Supported formats: JPG, PNG'}
// //                             </small>
// //                           </p>
// //                         </>
// //                       )}

// //                       <div className="d-flex gap-2 mt-2">
// //                         <input
// //                           ref={fileInputRef}
// //                           type="file"
// //                           accept={acceptTypes}
// //                           className="form-control"
// //                           onChange={handleFilePick}
// //                           style={{ maxWidth: 320 }}
// //                           disabled={!form.uploadType}
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Actions */}
// //                   <div className="col-12 d-flex justify-content-end gap-2 mt-3">
// //                     <button
// //                       type="submit"
// //                       className="btn btn-primary"
// //                       disabled={submitting}
// //                     >
// //                       {submitting ? 'Uploading…' : 'Review & Upload →'}
// //                     </button>
// //                     <button
// //                       type="button"
// //                       className="btn btn-danger"
// //                       onClick={resetForm}
// //                       disabled={submitting}
// //                     >
// //                       Reset
// //                     </button>
// //                   </div>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // src/components/PublishEdition.js
// import React, { useState, useRef, useEffect } from 'react';
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
// import 'bootstrap/dist/css/bootstrap.min.css';

// // --- PDF.js for image generation ---
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // ---------- helpers ----------
// const initialForm = {
//   editionName: '',
//   alias: '',
//   editionDate: '', // yyyy-mm-dd
//   metaTitle: '',
//   metaDescription: '',
//   category: 'Main Edition',
//   statusSelect: '',         // '1' | '2' | '3'
//   uploadType: '',           // 'Image' | 'PDF'
//   file: null,
//   scheduleDatetime: '',     // only when statusSelect === '2'
// };

// const slugify = (str) =>
//   (str || '')
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-+|-+$)/g, '');

// const formatDateDDMMYYYY = (yyyyMmDd) => {
//   if (!yyyyMmDd) return '';
//   const [y, m, d] = yyyyMmDd.split('-');
//   if (!y || !m || !d) return '';
//   return `${d}/${m}/${y}`;
// };

// const canvasToBlob = (canvas, type = 'image/webp', quality = 0.82) =>
//   new Promise((resolve, reject) => {
//     if (!canvas) return reject(new Error('No canvas'));
//     canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type, quality);
//   });

// export default function PublishEdition() {
//   const { currentUser: ctxUser } = useAuth?.() || {};
//   const currentUser = ctxUser || auth?.currentUser || null;

//   const [form, setForm] = useState(initialForm);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [pageGenProgress, setPageGenProgress] = useState(null); // e.g., "5/24"
//   const fileInputRef = useRef(null);

//   // --- auto-fill alias / meta title / desc ---
//   useEffect(() => {
//     setForm((prev) => {
//       const dd = formatDateDDMMYYYY(prev.editionDate);
//       const generatedAlias = slugify(prev.editionName || '');
//       const generatedMetaTitle = dd
//         ? `${dd} - ${prev.editionName} E-Paper : Read the latest epaper`
//         : `${prev.editionName || ''} - Epaperdesk Demo`;
//       const generatedMetaDesc = dd
//         ? `Read todays ${dd} - ${prev.editionName} E-Paper ePaper from ${dd} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`
//         : `Read todays ${prev.editionName} ePaper for the latest news and updates. Stay informed on local, national, and international stories all in one place.`;

//       const aliasShouldUpdate = !prev.alias || prev.alias === slugify(prev.editionName || '');
//       const metaTitleShouldUpdate =
//         !prev.metaTitle || prev.metaTitle.startsWith(dd) || prev.metaTitle.includes('Epaperdesk Demo');
//       const metaDescShouldUpdate =
//         !prev.metaDescription || prev.metaDescription.includes('Epaperdesk Demo');

//       return {
//         ...prev,
//         alias: aliasShouldUpdate ? generatedAlias : prev.alias,
//         metaTitle: metaTitleShouldUpdate ? generatedMetaTitle : prev.metaTitle,
//         metaDescription: metaDescShouldUpdate ? generatedMetaDesc : prev.metaDescription,
//       };
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [form.editionName, form.editionDate]);

//   // ---------- field handlers ----------
//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const handleUploadTypeChange = (e) => {
//     const value = e.target.value;
//     setForm((p) => ({ ...p, uploadType: value, file: null }));
//     setPreviewUrl(null);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const handleFilePick = (e) => {
//     const file = e.target.files?.[0] || null;
//     setForm((prev) => ({ ...prev, file }));
//     if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
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
//     if (file && (form.uploadType === 'Image' || file.type.startsWith('image/'))) {
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

//   const statusFromSelect = (sel) => {
//     switch (sel) {
//       case '1': return 'Live Now';
//       case '2': return 'Scheduled';
//       case '3': return 'Draft';
//       default: return '';
//     }
//   };

//   // ---------- PDF→image helpers ----------
//   async function renderFirstPageJPEGBlob(file, scale = 1.3, quality = 0.86) {
//     const ab = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
//     const page = await pdf.getPage(1);
//     const viewport = page.getViewport({ scale });
//     const canvas = document.createElement('canvas');
//     canvas.width = Math.floor(viewport.width);
//     canvas.height = Math.floor(viewport.height);
//     const ctx = canvas.getContext('2d', { willReadFrequently: true });
//     await page.render({ canvasContext: ctx, viewport }).promise;

//     // Prefer toBlob; fallback to dataURL -> fetch
//     try {
//       const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
//       return blob;
//     } catch {
//       const dataUrl = canvas.toDataURL('image/jpeg', quality);
//       const res = await fetch(dataUrl);
//       return await res.blob();
//     }
//   }

//   async function renderAllPagesToWebPBlobs(file, scale = 1.2, quality = 0.82) {
//     const ab = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
//     const out = [];
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const viewport = page.getViewport({ scale });
//       const canvas = document.createElement('canvas');
//       canvas.width = Math.floor(viewport.width);
//       canvas.height = Math.floor(viewport.height);
//       const ctx = canvas.getContext('2d', { willReadFrequently: true });
//       await page.render({ canvasContext: ctx, viewport }).promise;
//       const blob = await canvasToBlob(canvas, 'image/webp', quality);
//       out.push({ index: i, blob });
//     }
//     return out; // [{index, blob}, ...]
//   }

//   // ---------- submit ----------
//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!currentUser?.uid) {
//   //     alert('You must be logged in to create an edition.');
//   //     return;
//   //   }
//   //   if (!form.editionName.trim()) {
//   //     alert('Please enter Edition Name.');
//   //     return;
//   //   }
//   //   if (!form.editionDate) {
//   //     alert('Please select Edition Date.');
//   //     return;
//   //   }
//   //   if (!form.statusSelect) {
//   //     alert('Please select Status (Live Now / Make Schedule / Save in Draft).');
//   //     return;
//   //   }
//   //   if (form.statusSelect === '2' && !form.scheduleDatetime) {
//   //     alert('Please select schedule date and time since you chose "MAKE SCHEDULE".');
//   //     return;
//   //   }
//   //   if (!form.file) {
//   //     alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'file (image or PDF)'}.`);
//   //     return;
//   //   }
//   //   if (!form.uploadType) {
//   //     alert('Please select Upload Type (Image / PDF).');
//   //     return;
//   //   }

//   //   setSubmitting(true);
//   //   try {
//   //     const uid = currentUser.uid;
//   //     const editionSlug = form.alias || slugify(form.editionName);
//   //     const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

//   //     // Upload original file
//   //     const ext = extFromFile(form.file);
//   //     const ts = Date.now();
//   //     const filePath = `editions/${uid}/${editionSlug}-${ts}.${ext}`;
//   //     const sRef = storageRef(storage, filePath);
//   //     const metadata = {
//   //       contentType: form.file.type || (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream'),
//   //     };
//   //     await uploadBytes(sRef, form.file, metadata);
//   //     const fileUrl = await getDownloadURL(sRef);

//   //     // First page placeholder (JPEG)
//   //     // let firstPageImageUrl = null;
//   //     // let firstPageImagePath = null;
//   //     // if (form.uploadType === 'PDF') {
//   //     //   try {
//   //     //     const jpegBlob = await renderFirstPageJPEGBlob(form.file, 1.3, 0.86);
//   //     //     firstPageImagePath = `editions/${uid}/${editionSlug}-${ts}-page1.jpg`;
//   //     //     const imgRef = storageRef(storage, firstPageImagePath);
//   //     //     await uploadBytes(imgRef, jpegBlob, { contentType: 'image/jpeg' });
//   //     //     firstPageImageUrl = await getDownloadURL(imgRef);
//   //     //   } catch (imgErr) {
//   //     //     console.warn('First page image generation failed; continuing without placeholder.', imgErr);
//   //     //   }
//   //     // }

//   //     let firstPageImageUrl = null;
//   //     let firstPageImagePath = null;

//   //     // ALL pages to WebP (sequential)
//   //     let images = [];
//   //     let imagesCount = 0;
//   //     let imagesFormat = null;
//   //     if (form.uploadType === 'PDF') {
//   //       try {
//   //         setPageGenProgress('starting…');
//   //         const blobs = await renderAllPagesToWebPBlobs(form.file, 1.2, 0.82);
//   //         for (let i = 0; i < blobs.length; i++) {
//   //           const pageNum = i + 1;
//   //           setPageGenProgress(`${pageNum}/${blobs.length}`);
//   //           const p = `editions/${uid}/${editionSlug}-${ts}-page${pageNum}.webp`;
//   //           const pRef = storageRef(storage, p);
//   //           await uploadBytes(pRef, blobs[i].blob, { contentType: 'image/webp' });
//   //           const url = await getDownloadURL(pRef);
//   //           images.push(url);
//   //         }
//   //         imagesCount = images.length;
//   //         imagesFormat = imagesCount ? 'webp' : null;
//   //       } catch (allErr) {
//   //         console.warn('Page images generation failed; viewer will fall back to PDF.js.', allErr);
//   //         images = [];
//   //         imagesCount = 0;
//   //         imagesFormat = null;
//   //       } finally {
//   //         setPageGenProgress(null);
//   //       }
//   //     }

//   //     // Firestore doc
//   //     const itemsCol = collection(db, 'editions', uid, 'items');
//   //     const status = statusFromSelect(form.statusSelect);
//   //     let scheduledAt = null;
//   //     let isScheduled = false;
//   //     if (form.statusSelect === '2') {
//   //       scheduledAt = form.scheduleDatetime ? new Date(form.scheduleDatetime) : null;
//   //       isScheduled = !!scheduledAt;
//   //     }

//   //     const docData = {
//   //       editionName: form.editionName,
//   //       alias: form.alias || editionSlug,
//   //       editionSlug,
//   //       editionDate: form.editionDate,           // yyyy-mm-dd
//   //       editionDateDisplay: ddmmyyyy,            // dd/mm/yyyy
//   //       metaTitle: form.metaTitle || `${ddmmyyyy} Epaperdesk Demo: Read the latest epaper`,
//   //       metaDescription:
//   //         form.metaDescription ||
//   //         `Read todays ${form.editionName} ePaper from ${ddmmyyyy} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`,
//   //       category: form.category,
//   //       status,                                  // Live Now | Scheduled | Draft
//   //       uploadType: form.uploadType,
//   //       fileUrl,                                 // original PDF or image URL
//   //       storagePath: filePath,

//   //       // image-first viewer support
//   //       firstPageImageUrl: firstPageImageUrl || null,
//   //       firstPageImagePath: firstPageImagePath || null,
//   //       hasFirstPageImage: !!firstPageImageUrl,
//   //       images,                                  // array of per-page WebP URLs (in order)
//   //       imagesCount,
//   //       imagesFormat,                            // 'webp' | null

//   //       isScheduled,
//   //       scheduledAt: scheduledAt || null,
//   //       createdBy: {
//   //         uid,
//   //         email: currentUser.email || '',
//   //         displayName: currentUser.displayName || '',
//   //       },
//   //       createdAt: serverTimestamp(),
//   //     };

//   //     await addDoc(itemsCol, docData);
//   //     alert('Edition saved successfully!');
//   //     resetForm();
//   //   } catch (err) {
//   //     console.error('PublishEdition error:', err);
//   //     alert(`Failed to save edition: ${err?.message || err}`);
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // };
  
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // --- validations ---
//   if (!currentUser?.uid) {
//     alert('You must be logged in to create an edition.');
//     return;
//   }
//   if (!form.editionName.trim()) {
//     alert('Please enter Edition Name.');
//     return;
//   }
//   if (!form.editionDate) {
//     alert('Please select Edition Date.');
//     return;
//   }
//   if (!form.statusSelect) {
//     alert('Please select Status (Live Now / Make Schedule / Save in Draft).');
//     return;
//   }
//   if (form.statusSelect === '2' && !form.scheduleDatetime) {
//     alert('Please select schedule date and time since you chose "MAKE SCHEDULE".');
//     return;
//   }
//   if (!form.file) {
//     alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'file (image or PDF)'}.`);
//     return;
//   }
//   if (!form.uploadType) {
//     alert('Please select Upload Type (Image / PDF).');
//     return;
//   }

//   setSubmitting(true);
//   try {
//     const uid = currentUser.uid;
//     const editionSlug = form.alias || slugify(form.editionName);
//     const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

//     // --- upload original file (PDF or image) ---
//     const ext = extFromFile(form.file);
//     const ts = Date.now();
//     const filePath = `editions/${uid}/${editionSlug}-${ts}.${ext}`;
//     const sRef = storageRef(storage, filePath);
//     const metadata = {
//       contentType:
//         form.file.type ||
//         (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream'),
//     };
//     await uploadBytes(sRef, form.file, metadata);
//     const fileUrl = await getDownloadURL(sRef);

//     // --- placeholders & images info ---
//     let firstPageImageUrl = null;   // will point to page1.webp (preferred) or JPEG fallback
//     let firstPageImagePath = null;  // JPEG path only if fallback used
//     let images = [];                // ordered URLs of per-page images (webp)
//     let imagesCount = 0;
//     let imagesFormat = null;

//     // --- Option A: generate ALL WebP pages first, use page1.webp as placeholder ---
//     if (form.uploadType === 'PDF') {
//       try {
//         setPageGenProgress('starting…');

//         // Render all pages to WebP blobs (sequential)
//         const blobs = await renderAllPagesToWebPBlobs(form.file, 1.2, 0.82);

//         // Upload each page and collect URLs
//         for (let i = 0; i < blobs.length; i++) {
//           const pageNum = i + 1;
//           setPageGenProgress(`${pageNum}/${blobs.length}`);

//           const pagePath = `editions/${uid}/${editionSlug}-${ts}-page${pageNum}.webp`;
//           const pageRef = storageRef(storage, pagePath);

//           await uploadBytes(pageRef, blobs[i].blob, { contentType: 'image/webp' });
//           const pageUrl = await getDownloadURL(pageRef);
//           images.push(pageUrl);
//         }

//         imagesCount = images.length;
//         imagesFormat = imagesCount ? 'webp' : null;

//         // Use page1.webp as the first-page image (no separate JPEG)
//         if (imagesCount > 0) {
//           firstPageImageUrl = images[0];
//           firstPageImagePath = null; // no JPEG created
//         }
//       } catch (allErr) {
//         console.warn('Page images generation failed; viewer will fall back to PDF.js.', allErr);

//         images = [];
//         imagesCount = 0;
//         imagesFormat = null;

//         // --- Fallback: generate ONLY a JPEG placeholder for page 1 ---
//         try {
//           const jpegBlob = await renderFirstPageJPEGBlob(form.file, 1.3, 0.86);
//           firstPageImagePath = `editions/${uid}/${editionSlug}-${ts}-page1.jpg`;
//           const imgRef = storageRef(storage, firstPageImagePath);
//           await uploadBytes(imgRef, jpegBlob, { contentType: 'image/jpeg' });
//           firstPageImageUrl = await getDownloadURL(imgRef);
//         } catch (imgErr) {
//           console.warn('First page JPEG fallback failed.', imgErr);
//         }
//       } finally {
//         setPageGenProgress(null);
//       }
//     }

//     // --- Firestore doc ---
//     const itemsCol = collection(db, 'editions', uid, 'items');
//     const status = statusFromSelect(form.statusSelect);
//     let scheduledAt = null;
//     let isScheduled = false;
//     if (form.statusSelect === '2') {
//       scheduledAt = form.scheduleDatetime ? new Date(form.scheduleDatetime) : null;
//       isScheduled = !!scheduledAt;
//     }

//     const docData = {
//       editionName: form.editionName,
//       alias: form.alias || editionSlug,
//       editionSlug,
//       editionDate: form.editionDate,            // yyyy-mm-dd
//       editionDateDisplay: ddmmyyyy,             // dd/mm/yyyy
//       metaTitle: form.metaTitle || `${ddmmyyyy} Epaperdesk Demo: Read the latest epaper`,
//       metaDescription:
//         form.metaDescription ||
//         `Read todays ${form.editionName} ePaper from ${ddmmyyyy} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`,
//       category: form.category,
//       status,                                   // Live Now | Scheduled | Draft
//       uploadType: form.uploadType,
//       fileUrl,                                  // original PDF or image URL
//       storagePath: filePath,

//       // image-first viewer fields
//       firstPageImageUrl: firstPageImageUrl || null,
//       firstPageImagePath: firstPageImagePath || null, // will be null when using webp
//       hasFirstPageImage: !!firstPageImageUrl,
//       images,                                   // array of per-page WebP URLs (ordered)
//       imagesCount,
//       imagesFormat,                             // 'webp' | null

//       isScheduled,
//       scheduledAt: scheduledAt || null,
//       createdBy: {
//         uid,
//         email: currentUser.email || '',
//         displayName: currentUser.displayName || '',
//       },
//       createdAt: serverTimestamp(),
//     };

//     await addDoc(itemsCol, docData);
//     alert('Edition saved successfully!');
//     resetForm();
//   } catch (err) {
//     console.error('PublishEdition error:', err);
//     alert(`Failed to save edition: ${err?.message || err}`);
//   } finally {
//     setSubmitting(false);
//   }
// };


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
//                         placeholder="Etimes"
//                         value={form.editionName}
//                         onChange={(e) => handleFieldChange(e)}
//                         onBlur={(e) => setForm((p) => ({ ...p, alias: p.alias || slugify(e.target.value) }))}
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
//                           placeholder="etimes"
//                           value={form.alias}
//                           onChange={handleFieldChange}
//                         />
//                       </div>
//                       <div className="col-12 col-md-6">
//                         <label className="form-label">EDITION DATE:</label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           name="editionDate"
//                           value={form.editionDate}
//                           onChange={handleFieldChange}
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
//                         onChange={handleFieldChange}
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">META DESCRIPTION:</label>
//                       <textarea
//                         className="form-control"
//                         rows={3}
//                         name="metaDescription"
//                         value={form.metaDescription}
//                         onChange={handleFieldChange}
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
//                           onChange={handleFieldChange}
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
//                           className="form-control select2 form-select"
//                           name="statusSelect"
//                           value={form.statusSelect}
//                           onChange={handleFieldChange}
//                         >
//                           <option value="">Select One</option>
//                           <option value="1">LIVE NOW</option>
//                           <option value="2">MAKE SCHEDULE</option>
//                           <option value="3">SAVE IN DRAFT</option>
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
//                           onChange={handleUploadTypeChange}
//                         >
//                           <option value="">Select One</option>
//                           <option value="Image">Image</option>
//                           <option value="PDF">PDF</option>
//                         </select>
//                       </div>
//                     </div>

//                     {/* schedule datetime */}
//                     {form.statusSelect === '2' && (
//                       <div className="mt-3">
//                         <label className="form-label">Schedule Date & Time:</label>
//                         <input
//                           type="datetime-local"
//                           className="form-control"
//                           name="scheduleDatetime"
//                           value={form.scheduleDatetime}
//                           onChange={handleFieldChange}
//                         />
//                         <small className="text-muted">Choose date and time to publish edition.</small>
//                       </div>
//                     )}
//                   </div>

//                   {/* RIGHT column - uploader */}
//                   <div className="col-12 col-lg-6">
//                     <div
//                       className="border rounded p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
//                       style={{ borderStyle: 'dashed' }}
//                       onDrop={handleDrop}
//                       onDragOver={preventDefault}
//                       onDragEnter={preventDefault}
//                     >
//                       {/* Preview */}
//                       {form.uploadType === 'Image' && previewUrl && (
//                         <img
//                           src={previewUrl}
//                           alt="Preview"
//                           style={{ maxWidth: '260px', maxHeight: '260px' }}
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
//                       {!form.file && (
//                         <>
//                           <div className="mb-2">
//                             <svg width="120" height="90" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
//                               <rect width="120" height="90" rx="8" fill="#f3f4f6" />
//                             </svg>
//                           </div>
//                           <p className="mb-2">
//                             Drop, Upload or Paste {form.uploadType || 'file'}
//                             <br />
//                             <small className="text-muted">
//                               {form.uploadType === 'PDF' ? 'Supported format: PDF' : 'Supported formats: JPG, PNG, WebP'}
//                             </small>
//                           </p>
//                         </>
//                       )}

//                       <div className="d-flex gap-2 mt-2">
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept={acceptTypes}
//                           className="form-control"
//                           onChange={handleFilePick}
//                           style={{ maxWidth: 320 }}
//                           disabled={!form.uploadType}
//                         />
//                       </div>

//                       {/* show progress for page images */}
//                       {pageGenProgress && (
//                         <div className="mt-3 small text-muted">
//                           Generating page images… {pageGenProgress}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* actions */}
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
//             </div>{/* card-body */}
//           </div>{/* card */}
//         </div>
//       </div>
//     </div>
//   );
// }



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

// --- PDF.js for image generation ---
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ---------- form & helpers ----------
const initialForm = {
  editionName: '',
  alias: '',
  editionDate: '', // yyyy-mm-dd
  metaTitle: '',
  metaDescription: '',
  category: 'Main Edition',
  statusSelect: '',         // '1' | '2' | '3'
  uploadType: '',           // 'Image' | 'PDF'
  file: null,
  scheduleDatetime: '',     // only when statusSelect === '2'
};

const slugify = (str) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');

const formatDateDDMMYYYY = (yyyyMmDd) => {
  if (!yyyyMmDd) return '';
  const [y, m, d] = yyyyMmDd.split('-');
  if (!y || !m || !d) return '';
  return `${d}/${m}/${y}`;
};

const extFromFile = (f) => {
  if (!f?.name) return 'bin';
  const parts = f.name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : 'bin';
};

const statusFromSelect = (sel) => {
  switch (sel) {
    case '1': return 'Live Now';
    case '2': return 'Scheduled';
    case '3': return 'Draft';
    default: return '';
  }
};

// ---------- Image optimization tunables ----------
const MAX_TARGET_WIDTH = 1600;          // px (use 1280 for mobile-first)
const MAX_KB_PER_PAGE = 380;            // target max size per page (adjust 280–450 as needed)
const START_QUALITY = 0.80;             // starting WebP quality
const MIN_QUALITY = 0.68;               // lower bound
const QUALITY_STEP = 0.04;              // decrement step
const ENABLE_GRAYSCALE = false;         // set true if your pages are mostly B/W

// ---------- canvas helpers ----------
const canvasToBlob = (canvas, type = 'image/webp', quality = 0.82) =>
  new Promise((resolve, reject) => {
    if (!canvas) return reject(new Error('No canvas'));
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), type, quality);
  });

function downscaleCanvas(srcCanvas, maxW) {
  const ratio = maxW / srcCanvas.width;
  if (ratio >= 1) return srcCanvas; // already small enough

  const dst = document.createElement('canvas');
  dst.width = Math.round(srcCanvas.width * ratio);
  dst.height = Math.round(srcCanvas.height * ratio);

  const ctx = dst.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(srcCanvas, 0, 0, dst.width, dst.height);
  return dst;
}

function toGrayscale(srcCanvas) {
  const c = document.createElement('canvas');
  c.width = srcCanvas.width;
  c.height = srcCanvas.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(srcCanvas, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const data = img.data;
  for (let i = 0; i < data.length; i += 4) {
    // Luminosity method
    const y = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = y;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function canvasToWebPBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('WebP toBlob failed'))),
      'image/webp',
      quality
    );
  });
}

async function compressToTarget(canvas, startQ, minQ, step, maxKB) {
  let q = startQ;
  let bestBlob = null;

  while (q >= minQ) {
    const blob = await canvasToWebPBlob(canvas, q);
    if (!bestBlob || blob.size < bestBlob.size) bestBlob = blob;
    const kb = blob.size / 1024;
    if (kb <= maxKB) {
      return blob; // good enough
    }
    q = +(q - step).toFixed(2);
  }
  return bestBlob; // return smallest we got
}

// ---------- PDF→image helpers ----------
async function renderFirstPageJPEGBlob(file, scale = 1.3, quality = 0.86) {
  const ab = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  await page.render({ canvasContext: ctx, viewport }).promise;

  try {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    return blob;
  } catch {
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const res = await fetch(dataUrl);
    return await res.blob();
  }
}

/**
 * Render ALL pages to optimized WebP blobs.
 * Accepts an optional progress callback: onProgress(current, total)
 */
async function renderAllPagesToWebPBlobs(file, scale = 1.2, onProgress) {
  const ab = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
  const out = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale }); // initial render

    // Render at possibly higher res, then downscale
    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = Math.floor(viewport.width);
    renderCanvas.height = Math.floor(viewport.height);
    const rctx = renderCanvas.getContext('2d', { willReadFrequently: true });
    await page.render({ canvasContext: rctx, viewport }).promise;

    let workCanvas = downscaleCanvas(renderCanvas, MAX_TARGET_WIDTH);
    if (ENABLE_GRAYSCALE) workCanvas = toGrayscale(workCanvas);

    const blob = await compressToTarget(
      workCanvas,
      START_QUALITY,
      MIN_QUALITY,
      QUALITY_STEP,
      MAX_KB_PER_PAGE
    );

    out.push({ index: i, blob });
    if (onProgress) onProgress(i, pdf.numPages); // render progress
  }

  return out; // [{ index, blob }, ...]
}

export default function PublishEdition() {
  const { currentUser: ctxUser } = useAuth?.() || {};
  const currentUser = ctxUser || auth?.currentUser || null;

  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Converting pages state (for progress bar & spinner)
  const [convertingPages, setConvertingPages] = useState(false);
  const [pageGenProgress, setPageGenProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef(null);

  // --- auto-fill alias/meta ---
  useEffect(() => {
    setForm((prev) => {
      const dd = formatDateDDMMYYYY(prev.editionDate);
      const generatedAlias = slugify(prev.editionName || '');
      const generatedMetaTitle = dd
        ? `${dd} - ${prev.editionName} E-Paper : Read the latest epaper`
        : `${prev.editionName || ''} - Epaperdesk Demo`;
      const generatedMetaDesc = dd
        ? `Read todays ${dd} - ${prev.editionName} E-Paper ePaper from ${dd} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`
        : `Read todays ${prev.editionName} ePaper for the latest news and updates. Stay informed on local, national, and international stories all in one place.`;

      const aliasShouldUpdate = !prev.alias || prev.alias === slugify(prev.editionName || '');
      const metaTitleShouldUpdate =
        !prev.metaTitle || prev.metaTitle.startsWith(dd) || prev.metaTitle.includes('Epaperdesk Demo');
      const metaDescShouldUpdate =
        !prev.metaDescription || prev.metaDescription.includes('Epaperdesk Demo');

      return {
        ...prev,
        alias: aliasShouldUpdate ? generatedAlias : prev.alias,
        metaTitle: metaTitleShouldUpdate ? generatedMetaTitle : prev.metaTitle,
        metaDescription: metaDescShouldUpdate ? generatedMetaDesc : prev.metaDescription,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.editionName, form.editionDate]);

  // ---------- field handlers ----------
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleUploadTypeChange = (e) => {
    const value = e.target.value;
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
    setConvertingPages(false);
    setPageGenProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const acceptTypes = form.uploadType === 'PDF' ? 'application/pdf' : 'image/*';

  // ---------- Option A: full handleSubmit with progress ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- validations ---
    if (!currentUser?.uid) {
      alert('You must be logged in to create an edition.');
      return;
    }
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
    if (form.statusSelect === '2' && !form.scheduleDatetime) {
      alert('Please select schedule date and time since you chose "MAKE SCHEDULE".');
      return;
    }
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

      // --- upload original file (PDF or image) ---
      const ext = extFromFile(form.file);
      const ts = Date.now();
      const filePath = `editions/${uid}/${editionSlug}-${ts}.${ext}`;
      const sRef = storageRef(storage, filePath);
      const metadata = {
        contentType:
          form.file.type ||
          (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream'),
      };
      await uploadBytes(sRef, form.file, metadata);
      const fileUrl = await getDownloadURL(sRef);

      // --- placeholders & images info ---
      let firstPageImageUrl = null;   // page1.webp (preferred) or JPEG fallback
      let firstPageImagePath = null;  // only populated if JPEG fallback is used
      let images = [];                // ordered URLs for per-page images (webp)
      let imagesCount = 0;
      let imagesFormat = null;

      // --- Generate ALL WebP pages first, show converting progress ---
      if (form.uploadType === 'PDF') {
        try {
          setConvertingPages(true);
          setPageGenProgress({ current: 0, total: 0 });

          // Render all pages with per-page progress
          const blobs = await renderAllPagesToWebPBlobs(
            form.file,
            1.2,
            (current, total) => setPageGenProgress({ current, total })
          );

          // Upload each page and update progress on upload too
          for (let i = 0; i < blobs.length; i++) {
            const pageNum = i + 1;
            const pagePath = `editions/${uid}/${editionSlug}-${ts}-page${pageNum}.webp`;
            const pageRef = storageRef(storage, pagePath);

            await uploadBytes(pageRef, blobs[i].blob, { contentType: 'image/webp' });
            const pageUrl = await getDownloadURL(pageRef);
            images.push(pageUrl);

            // update progress to reflect upload completion
            setPageGenProgress({ current: pageNum, total: blobs.length });
          }

          imagesCount = images.length;
          imagesFormat = imagesCount ? 'webp' : null;

          // Use page1.webp as the first page image (no separate JPEG)
          if (imagesCount > 0) {
            firstPageImageUrl = images[0];
            firstPageImagePath = null;
          }
        } catch (allErr) {
          console.warn('Page images generation failed; viewer will fall back to PDF.js.', allErr);

          images = [];
          imagesCount = 0;
          imagesFormat = null;

          // --- Fallback: generate ONLY a JPEG placeholder for page 1 ---
          try {
            const jpegBlob = await renderFirstPageJPEGBlob(form.file, 1.3, 0.86);
            firstPageImagePath = `editions/${uid}/${editionSlug}-${ts}-page1.jpg`;
            const imgRef = storageRef(storage, firstPageImagePath);
            await uploadBytes(imgRef, jpegBlob, { contentType: 'image/jpeg' });
            firstPageImageUrl = await getDownloadURL(imgRef);
          } catch (imgErr) {
            console.warn('First page JPEG fallback failed.', imgErr);
          }
        } finally {
          setConvertingPages(false);
          setPageGenProgress({ current: 0, total: 0 });
        }
      }

      // --- Firestore doc ---
      const itemsCol = collection(db, 'editions', uid, 'items');
      const status = statusFromSelect(form.statusSelect);
      let scheduledAt = null;
      let isScheduled = false;
      if (form.statusSelect === '2') {
        scheduledAt = form.scheduleDatetime ? new Date(form.scheduleDatetime) : null;
        isScheduled = !!scheduledAt;
      }

      const docData = {
        editionName: form.editionName,
        alias: form.alias || editionSlug,
        editionSlug,
        editionDate: form.editionDate,            // yyyy-mm-dd
        editionDateDisplay: ddmmyyyy,             // dd/mm/yyyy
        metaTitle: form.metaTitle || `${ddmmyyyy} Epaperdesk Demo: Read the latest epaper`,
        metaDescription:
          form.metaDescription ||
          `Read todays ${form.editionName} ePaper from ${ddmmyyyy} for the latest news and updates. Stay informed on local, national, and international stories all in one place.`,
        category: form.category,
        status,                                   // Live Now | Scheduled | Draft
        uploadType: form.uploadType,
        fileUrl,                                  // original PDF or image URL
        storagePath: filePath,

        // image-first viewer fields
        firstPageImageUrl: firstPageImageUrl || null,
        firstPageImagePath: firstPageImagePath || null, // null when using webp
        hasFirstPageImage: !!firstPageImageUrl,
        images,                                   // per-page WebP URLs (ordered)
        imagesCount,
        imagesFormat,                             // 'webp' | null

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
      setConvertingPages(false);
      setPageGenProgress({ current: 0, total: 0 });
    }
  };

  // ---------- UI ----------
  const progressPercent =
    pageGenProgress.total > 0
      ? Math.round((pageGenProgress.current / pageGenProgress.total) * 100)
      : 0;

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

                    {/* schedule datetime */}
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

                  {/* RIGHT column - uploader */}
                  <div className="col-12 col-lg-6">
                    <div
                      className="border rounded p-4 h-100 d-flex flex-column align-items-center justify-content-center text-center"
                      style={{ borderStyle: 'dashed' }}
                      onDrop={handleDrop}
                      onDragOver={preventDefault}
                      onDragEnter={preventDefault}
                    >
                      {/* Preview */}
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
                            <svg width="120" height="90" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
                              <rect width="120" height="90" rx="8" fill="#f3f4f6" />
                            </svg>
                          </div>
                          <p className="mb-2">
                            Drop, Upload or Paste {form.uploadType || 'file'}
                            <br />
                            <small className="text-muted">
                              {form.uploadType === 'PDF' ? 'Supported format: PDF' : 'Supported formats: JPG, PNG, WebP'}
                            </small>
                          </p>
                        </>
                      )}

                      <div className="d-flex gap-2 mt-2" style={{ width: '100%', maxWidth: 360 }}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={acceptTypes}
                          className="form-control"
                          onChange={handleFilePick}
                          disabled={!form.uploadType}
                        />
                      </div>

                      {/* Converting progress UI */}
                      {convertingPages && (
                        <div className="mt-3 w-100" style={{ maxWidth: 480 }}>
                          <div className="d-flex align-items-center mb-2">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                            <strong>Converting pages…</strong>
                            <span className="ms-2 text-muted">
                              ({pageGenProgress.current}/{pageGenProgress.total})
                            </span>
                          </div>
                          <div className="progress" style={{ height: 8 }}>
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated"
                              role="progressbar"
                              style={{ width: `${progressPercent}%` }}
                              aria-valuenow={progressPercent}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* actions */}
                  <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting || convertingPages}
                      title={convertingPages ? 'Please wait until conversion finishes' : 'Upload'}
                    >
                      {submitting ? 'Uploading…' : (convertingPages ? 'Converting…' : 'Review & Upload →')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={resetForm}
                      disabled={submitting || convertingPages}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>{/* card-body */}
          </div>{/* card */}
        </div>
      </div>
    </div>
  );
}
