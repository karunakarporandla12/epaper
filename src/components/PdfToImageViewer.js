// src/components/PdfToImageViewer.js
import React, { useState, useEffect, useRef } from "react";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CropModal from "./CropModal";

// --- PDF.js worker setup (required) ---
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Tunables
const PAGE_SCALE = 1.2;
const PAGE_QUALITY = 0.85;  // JPEG quality for PDF fallback images
const THUMB_SCALE = 0.3;
const THUMB_QUALITY = 0.7;
const MAX_CACHE = 6;

const PdfImageViewer = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  // Files listing & selection
  const [allFiles, setAllFiles] = useState([]);   // { name, url, ext, dateStr }
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Image-first vs PDF fallback
  const [imagePages, setImagePages] = useState(null); // array of URLs (if present)
  const [pdfDocRef, setPdfDocRef] = useState(null);   // PDFDocumentProxy (fallback)
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);  // zero-based index
  const [loading, setLoading] = useState(false);
  const [renderedImageDataUrl, setRenderedImageDataUrl] = useState(null); // pdf fallback rendered image

  // Date filter (yyyy-mm-dd)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Crop states
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState(null);
  const [pixelCrop, setPixelCrop] = useState(null);
  const imgRef = useRef(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState(null);

  // Caches
  const pageImageCache = useRef(new Map()); // key: pageIndex -> dataURL
  const thumbCache = useRef(new Map());     // key: pageIndex -> dataURL

  // ---------- list bucket items ----------
  useEffect(() => {
    if (!user) return;
    const folder = storageRef(storage, `editions/${user.uid}`);
    (async () => {
      try {
        const res = await listAll(folder);
        const mapped = await Promise.all(
          res.items.map(async (it) => {
            const url = await getDownloadURL(it);
            const name = it.name;
            const ext = name.split(".").pop().toLowerCase();
            const dateStr = extractDateFromName(name); // yyyy-mm-dd or null
            return { name, url, ext, dateStr };
          })
        );
        // newest first by embedded timestamp
        mapped.sort((a, b) => {
          const ta = extractTsFromName(a.name) ?? 0;
          const tb = extractTsFromName(b.name) ?? 0;
          return tb - ta;
        });
        setAllFiles(mapped);
      } catch (err) {
        console.error("listAll error", err);
      }
    })();
  }, [user, storage]);

  // ---------- apply date filter ----------
  useEffect(() => {
    if (!allFiles || allFiles.length === 0) {
      setFilteredFiles([]);
      clearViewerState();
      return;
    }
    const filtered = allFiles.filter((f) => f.dateStr === selectedDate);
    setFilteredFiles(filtered);
    if (filtered.length > 0) {
      selectFile(filtered[0]);
    } else {
      clearViewerState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFiles, selectedDate]);

  // ---------- name helpers ----------
  function extractTsFromName(name) {
    const m = name.match(/-(\d{10,})\./);
    if (!m) return null;
    const ts = parseInt(m[1], 10);
    return ts < 1e12 ? ts * 1000 : ts;
  }
  function extractDateFromName(name) {
    const ts = extractTsFromName(name);
    if (!ts) return null;
    const d = new Date(ts);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  }
  function basenameNoExt(name) {
    return name.replace(/\.[^.]+$/, '');
  }

  // ---------- clear state ----------
  function clearViewerState() {
    setSelectedFile(null);
    setPdfDocRef(null);
    setTotalPages(0);
    setCurrentPage(0);
    setRenderedImageDataUrl(null);
    setImagePages(null);
    pageImageCache.current.clear();
    thumbCache.current.clear();
  }

  // ---------- find pre-rendered images ----------
  function findPageImagesForPdf(pdfName) {
    // Matches <slug>-<ts>-pageN.(webp|jpg|jpeg|png)
    const base = basenameNoExt(pdfName); // "<slug>-<ts>"
    const re = new RegExp(`^${base}-page(\\d+)\\.(webp|jpg|jpeg|png)$`, 'i');
    const matched = allFiles
      .filter((f) => re.test(f.name))
      .map((f) => ({ ...f, page: parseInt(f.name.match(re)[1], 10) }))
      .sort((a, b) => a.page - b.page);
    return matched.length ? matched.map((m) => m.url) : null;
  }

  // ---------- select file ----------
  const selectFile = async (fileObj) => {
    if (!fileObj) return;
    setSelectedFile(fileObj);
    setLoading(true);
    setCurrentPage(0);
    setRenderedImageDataUrl(null);
    setImagePages(null);
    pageImageCache.current.clear();
    setPdfDocRef(null);
    setTotalPages(0);

    try {
      if (fileObj.ext === "pdf") {
        // Prefer pre-rendered images
        const pages = findPageImagesForPdf(fileObj.name);
        if (pages && pages.length > 0) {
          setImagePages(pages);
          setTotalPages(pages.length);
          setLoading(false);
          return;
        }

        // Fallback: PDF.js lazy render
        const pdf = await pdfjsLib.getDocument({
          url: fileObj.url,
          disableStream: true,
          disableAutoFetch: true,
        }).promise;
        setPdfDocRef(pdf);
        setTotalPages(pdf.numPages);
        const firstDataURL = await renderPageToDataURL(pdf, 1, PAGE_SCALE);
        setRenderedImageDataUrl(firstDataURL);
        prefetchNeighbors(pdf, 1);
      } else {
        // Single image epaper
        setImagePages([fileObj.url]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("render error", err);
      clearViewerState();
    } finally {
      setLoading(false);
    }
  };

  // ---------- rendering helpers (PDF fallback) ----------
  async function renderPageToDataURL(pdf, pageIndex, scale = PAGE_SCALE) {
    if (pageImageCache.current.has(pageIndex)) {
      return pageImageCache.current.get(pageIndex);
    }
    const page = await pdf.getPage(pageIndex);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataURL = canvas.toDataURL("image/jpeg", PAGE_QUALITY);
    pageImageCache.current.set(pageIndex, dataURL);
    // simple LRU eviction
    if (pageImageCache.current.size > MAX_CACHE) {
      const keys = [...pageImageCache.current.keys()];
      pageImageCache.current.delete(keys[0]);
    }
    return dataURL;
  }

  async function renderThumbToDataURL(pdf, pageIndex, scale = THUMB_SCALE) {
    if (thumbCache.current.has(pageIndex)) {
      return thumbCache.current.get(pageIndex);
    }
    const page = await pdf.getPage(pageIndex);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataURL = canvas.toDataURL("image/jpeg", THUMB_QUALITY);
    thumbCache.current.set(pageIndex, dataURL);
    return dataURL;
  }

  function prefetchNeighbors(pdf, pageIndex) {
    const toPrefetch = [pageIndex + 1, pageIndex - 1].filter(
      (p) => p >= 1 && p <= pdf.numPages && !pageImageCache.current.has(p)
    );
    for (const p of toPrefetch) {
      Promise.resolve().then(() => renderPageToDataURL(pdf, p).catch(() => {}));
    }
  }

  // Render on page change (PDF fallback)
  useEffect(() => {
    (async () => {
      if (!pdfDocRef || totalPages <= 0 || imagePages) return; // images mode doesn't need rendering
      const pageIndex = currentPage + 1;
      setLoading(true);
      try {
        const dataURL = await renderPageToDataURL(pdfDocRef, pageIndex, PAGE_SCALE);
        setRenderedImageDataUrl(dataURL);
        prefetchNeighbors(pdfDocRef, pageIndex);
      } catch (e) {
        console.error("page change render error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage, pdfDocRef, totalPages, imagePages]);

  // ---------- crop helpers ----------
  const onImageLoaded = (img) => { imgRef.current = img; };
  const onCropChange = (nextCrop, nextPixelCrop) => {
    setCrop(nextCrop || null);
    setPixelCrop(nextPixelCrop || null);
  };
  const getCroppedDataUrl = () => {
    if (!pixelCrop || !imgRef.current) return null;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const pixelRatio = window.devicePixelRatio || 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(pixelCrop.width * scaleX * pixelRatio);
    canvas.height = Math.round(pixelCrop.height * scaleY * pixelRatio);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      img,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY
    );
    return canvas.toDataURL("image/png");
  };
  const handleSaveCrop = () => {
    const d = getCroppedDataUrl();
    if (!d) {
      alert("Please select a crop area first.");
      return;
    }
    setCroppedDataUrl(d);
    setIsCropping(false);
    setCrop(null);
    setPixelCrop(null);
  };

  // ---------- download original PDF ----------
  const handleDownloadPdf = async () => {
    if (!selectedFile || selectedFile.ext !== "pdf") return;
    try {
      const res = await fetch(selectedFile.url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("download error", err);
      alert("Failed to download PDF.");
    }
  };

  // ---------- UI helpers ----------
  const pageSelectOptions = Array.from({ length: totalPages }, (_, i) => `Page ${i + 1}`);
  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const items = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - (maxVisible - 1));
    }
    for (let i = start; i <= end; i++) {
      items.push(
        <button
          key={i}
          className={`btn btn-sm me-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }
    return (
      <div className="d-inline-flex align-items-center">
        {items}
        {currentPage < totalPages - 1 && (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setCurrentPage(totalPages - 1)}
            title="Jump to last page"
          >
            ▸▸
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm my-2">
        <div className="card-body">
          {/* TOP TOOLBAR */}
          <div className="d-flex align-items-center gap-2 mb-3" id="top-toolbar">
            {/* Page select */}
            <div>
              <select
                className="form-select form-select-sm"
                style={{ width: 140 }}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                disabled={totalPages <= 1}
              >
                {pageSelectOptions.map((label, i) => (
                  <option key={i} value={i}>{label}</option>
                ))}
              </select>
            </div>

            {/* Page numbers */}
            <div className="ms-2">{renderPageNumbers()}</div>

            {/* PDF download */}
            <button
              className="btn btn-warning btn-sm ms-3"
              onClick={handleDownloadPdf}
              disabled={!selectedFile || selectedFile.ext !== "pdf"}
              title="Download full PDF"
            >
              <strong>PDF</strong>
            </button>

            {/* Right controls */}
            <div className="ms-auto position-relative d-flex align-items-center">
              <button
                className="btn btn-secondary btn-sm me-2"
                onClick={() => {
                  setIsCropping((p) => !p);
                  setTimeout(() => { setCrop(null); setPixelCrop(null); }, 0);
                }}
                title="Crop selection"
                disabled={!(imagePages?.length || renderedImageDataUrl)}
              >
                <i className="bi bi-scissors me-1" /> Clip
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setCalendarOpen((v) => !v)}
                title="Open archive calendar"
              >
                <i className="bi bi-calendar3 me-1" /> Archive
              </button>

              {calendarOpen && (
                <div
                  className="card position-absolute"
                  style={{ right: 0, top: "42px", zIndex: 1200, minWidth: 240, padding: 10 }}
                >
                  <div className="mb-2">
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => { setSelectedDate(new Date().toISOString().slice(0, 10)); }}
                    >
                      Today
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setCalendarOpen(false)}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="row">
            {/* Left: Thumbnails */}
            <div
              id="left-section-pages"
              className="col-3 hide-mobile"
              style={{ maxHeight: "65vh", overflowY: "auto", borderRight: "1px solid #eee" }}
            >
              {/* images mode */}
              {imagePages && imagePages.length > 0 && (
                <div>
                  <h6 className="mb-2">Pages</h6>
                  {imagePages.map((src, i) => (
                    <div
                      key={`imgthumb-${i}`}
                      className={`mb-2 p-1 ${i === currentPage ? "border border-primary" : "border border-light"}`}
                      style={{ cursor: "pointer", background: "#fff" }}
                      onClick={() => setCurrentPage(i)}
                      title={`Page ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`thumb-${i + 1}`}
                        style={{ width: "100%", display: "block", borderRadius: 4 }}
                      />
                      <small className={i === currentPage ? "text-primary" : ""}>Page {i + 1}</small>
                    </div>
                  ))}
                </div>
              )}

              {/* pdf fallback thumbnails */}
              {!imagePages && totalPages > 0 && pdfDocRef && (
                <div>
                  <h6 className="mb-2">Pages</h6>
                  <div>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <ThumbItem
                        key={`thumb-${i + 1}`}
                        pageIndex={i + 1}
                        isActive={i === currentPage}
                        onClick={() => setCurrentPage(i)}
                        getThumb={(p) => renderThumbToDataURL(pdfDocRef, p)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {totalPages === 0 && selectedFile && <div className="text-muted">No pages to show</div>}
            </div>

            {/* Right: Viewer */}
            <div className="col-9" style={{ maxHeight: "75vh", overflow: "auto" }}>
              {/* Title bar */}
              <div className="d-flex align-items-center justify-content-between bg bg-primary p-2 rounded-2">
                <div>
                  <h5 className="text-light">
                    {/* <h6 style={{ margin: 0 }}>{selectedFile ? selectedFile.name : "No file selected" } -<stong> {totalPages ? currentPage + 1 : 0}</stong> </h6> */}
                  
{selectedFile 
  ? selectedFile.name.replace(/\.[^/.]+$/, "") // remove extension
                    .split("-")[0]            // take first part before hyphen
                    .toUpperCase()            // convert to uppercase
  : "No file selected"} - {totalPages ? currentPage + 1 : 0} 

                  </h5>
                </div>
                <div>
                  <span className="me-2 text-light">
                    <strong>Page {totalPages ? currentPage + 1 : 0} / {totalPages}</strong>
                  </span>
                </div>
              </div>

              {/* Empty / Loading */}
              {filteredFiles.length === 0 && (
                <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
                  <div className="text-center text-muted">
                    <h5>No data available</h5>
                    <div>Select another date or upload files for this date.</div>
                  </div>
                </div>
              )}
              {filteredFiles.length > 0 && loading && (
                <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
                  Rendering page…
                </div>
              )}

              {/* Main viewer */}
              {filteredFiles.length > 0 && !loading && (
                <div className="border" style={{ minHeight: 400, padding: 10, background: "#fafafa" }}>
                  <div style={{ position: "relative" }}>
                    {imagePages && imagePages.length > 0 ? (
                      isCropping ? (
                        <ReactCrop crop={crop} onChange={onCropChange} onComplete={onCropChange}>
                          <img
                            src={imagePages[currentPage]}
                            alt={`page-${currentPage + 1}`}
                            style={{ width: "100%", display: "block" }}
                            onLoad={(e) => onImageLoaded(e.currentTarget)}
                          />
                        </ReactCrop>
                      ) : (
                        <img
                          src={imagePages[currentPage]}
                          alt={`page-${currentPage + 1}`}
                          style={{ width: "100%", display: "block" }}
                          onLoad={(e) => onImageLoaded(e.currentTarget)}
                        />
                      )
                    ) : (
                      renderedImageDataUrl && (
                        isCropping ? (
                          <ReactCrop crop={crop} onChange={onCropChange} onComplete={onCropChange}>
                            <img
                              src={renderedImageDataUrl}
                              alt="page"
                              style={{ width: "100%", display: "block" }}
                              onLoad={(e) => onImageLoaded(e.currentTarget)}
                            />
                          </ReactCrop>
                        ) : (
                          <img
                            src={renderedImageDataUrl}
                            alt="page"
                            style={{ width: "100%", display: "block" }}
                            onLoad={(e) => onImageLoaded(e.currentTarget)}
                          />
                        )
                      )
                    )}
                    {/* crop action buttons overlay (when cropping) */}
                    {isCropping && (
                      <div
                        style={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          display: "flex",
                          gap: 8,
                          zIndex: 9999,
                        }}
                      >
                        <button className="btn btn-success btn-sm" onClick={handleSaveCrop}>Save</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => { setIsCropping(false); setCrop(null); setPixelCrop(null); }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mobile arrows */}
                  {(imagePages?.length > 1 || totalPages > 1) && (
                    <>
                      <button
                        className="mobile-arrow left d-md-none"
                        onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        ‹
                      </button>
                      <button
                        className="mobile-arrow right d-md-none"
                        onClick={() => (imagePages ? currentPage < imagePages.length - 1 : currentPage < totalPages - 1) && setCurrentPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cropped result modal */}
      {croppedDataUrl && (
        <CropModal
          image={croppedDataUrl}
          title={selectedFile ? selectedFile.name.replace(/\.[^.]+$/, "") + "-crop" : "crop"}
          onClose={() => setCroppedDataUrl(null)}
        />
      )}
    </div>
  );
};

export default PdfImageViewer;

// --- Thumbnail item (PDF fallback) ---
const ThumbItem = ({ pageIndex, isActive, onClick, getThumb }) => {
  const [src, setSrc] = React.useState(null);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await getThumb(pageIndex);
        if (mounted) setSrc(d);
      } catch {
        /* ignore */
      }
    })();
    return () => { mounted = false; };
  }, [getThumb, pageIndex]);
  return (
    <div
      className={`mb-2 p-1 ${isActive ? "border border-primary" : "border border-light"}`}
      style={{ cursor: "pointer", background: "#fff" }}
      onClick={onClick}
      title={`Page ${pageIndex}`}
    >
      {src ? (
        <img
          src={src}
          alt={`thumb-${pageIndex}`}
          style={{ width: "100%", display: "block", borderRadius: 4 }}
        />
      ) : (
        <div style={{ width: "100%", height: 120, background: "#f3f3f3", borderRadius: 4 }} />
      )}
      <small className={isActive ? "text-primary" : ""}>Page {pageIndex}</small>
    </div>
  );
};
