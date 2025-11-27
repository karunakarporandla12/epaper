// src/components/PublishEdition.js
import React, { useState, useRef } from 'react';
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

const initialForm = {
  editionName: '',
  alias: '',
  editionDate: '', // yyyy-mm-dd
  metaTitle: '',
  metaDescription: '',
  category: 'Main Edition',
  status: '',
  uploadType: '', // Image | PDF
  file: null,     // image or pdf
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
  return `${d}-${m}-${y}`;
};

function PublishEdition() {
  const { currentUser: ctxUser } = useAuth?.() || {};
  const currentUser = ctxUser || auth?.currentUser || null;

  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState(null); // only for images
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    if (name === 'editionName' && !form.alias) next.alias = slugify(value);
    setForm(next);
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));

    if (file && form.uploadType === 'Image') {
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
    if (form.uploadType === 'Image') {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.uid) {
      alert('You must be logged in.');
      return;
    }
    if (!form.editionName || !form.category || !form.status || !form.uploadType) {
      alert('Please fill all required fields (*)');
      return;
    }
    if (!form.file) {
      alert(`Please upload a ${form.uploadType === 'PDF' ? 'PDF file' : 'Image'}.`);
      return;
    }

    setSubmitting(true);
    try {
      const uid = currentUser.uid;
      const editionSlug = slugify(form.editionName);
      const ddmmyyyy = formatDateDDMMYYYY(form.editionDate);

      // 1) Upload file (Image or PDF) with proper contentType
      const ext = extFromFile(form.file);
      const filePath = `editions/${uid}/${editionSlug}-${Date.now()}.${ext}`;
      const sRef = storageRef(storage, filePath);

      const metadata = { contentType: form.file.type || (form.uploadType === 'PDF' ? 'application/pdf' : 'application/octet-stream') };
      await uploadBytes(sRef, form.file, metadata);
      const fileUrl = await getDownloadURL(sRef);

      // 2) Save Firestore doc
      const itemsCol = collection(db, 'editions', uid, 'items');
      const docData = {
        editionName: form.editionName,
        alias: form.alias,
        editionDate: form.editionDate || null, // yyyy-mm-dd
        editionDateDisplay: ddmmyyyy,          // dd-mm-yyyy
        metaTitle: form.metaTitle || '',
        metaDescription: form.metaDescription || '',
        category: form.category,
        status: form.status,
        uploadType: form.uploadType, // Image | PDF
        fileUrl,                     // image or pdf URL
        storagePath: filePath,
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
      console.error(err);
      alert(`Failed to save edition: ${err.message}`);
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
                        placeholder="Aladin"
                        value={form.editionName}
                        onChange={handleChange}
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
                          placeholder="aladin"
                          value={form.alias}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label">EDITION DATE:</label>
                        <input
                          type="date"
                          className="form-control"
                          name="editionDate"
                          value={form.editionDate}
                          onChange={handleChange}
                          placeholder="dd-mm-yyyy"
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
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">META DESCRIPTION:</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        name="metaDescription"
                        value={form.metaDescription}
                        onChange={handleChange}
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
                          onChange={handleChange}
                          required
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
                          className="form-select"
                          name="status"
                          value={form.status}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select One</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Draft">Draft</option>
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
                          onChange={(e) => {
                            // reset preview when switching types
                            setPreviewUrl(null);
                            handleChange(e);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            setForm((prev) => ({ ...prev, file: null }));
                          }}
                          required
                        >
                          <option value="">Select One</option>
                          <option value="Image">Image</option>
                          <option value="PDF">PDF</option>
                        </select>
                      </div>
                    </div>
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
                          style={{ maxWidth: '220px', maxHeight: '220px' }}
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
      <img
        src="https://via.placeholderPLOAD" />
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



                      <div className="d-flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={acceptTypes}
                          className="form-control"
                          onChange={handleFilePick}
                          style={{ maxWidth: 280 }}
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

export default PublishEdition;
