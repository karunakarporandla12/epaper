// import React, { useState, useEffect, useRef } from "react";
// import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
// import { getAuth } from "firebase/auth";
// import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import ReactCrop from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
// import CropModal from "./CropModal";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// const PdfImageViewer = () => {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const storage = getStorage();

//   const [allFiles, setAllFiles] = useState([]); // { name, url, ext, dateStr }
//   const [filteredFiles, setFilteredFiles] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null); // file object from filteredFiles
//   const [pageImages, setPageImages] = useState([]); // dataURLs for pages or image url single
//   const [currentPage, setCurrentPage] = useState(0);

//   const [loading, setLoading] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

//   // Crop states
//   const [isCropping, setIsCropping] = useState(false);
//   const [crop, setCrop] = useState(null);
//   const [pixelCrop, setPixelCrop] = useState(null);
//   const imgRef = useRef(null);
//   const [croppedDataUrl, setCroppedDataUrl] = useState(null);
//   const [calendarOpen, setCalendarOpen] = useState(false);

//   // pagination controls UI (numbers)
//   const totalPages = pageImages.length;

//   // Fetch list on mount (if user exists)
//   useEffect(() => {
//     if (!user) return;
//     const folder = storageRef(storage, `editions/${user.uid}`);
//     (async () => {
//       try {
//         const res = await listAll(folder);
//         const mapped = await Promise.all(
//           res.items.map(async (it) => {
//             const url = await getDownloadURL(it);
//             const name = it.name;
//             const ext = name.split(".").pop().toLowerCase();
//             const dateStr = extractDateFromName(name); // yyyy-mm-dd or null
//             return { name, url, ext, dateStr };
//           })
//         );
//         // sort newest first by name timestamp (if present)
//         mapped.sort((a, b) => {
//           const ta = extractTsFromName(a.name) || 0;
//           const tb = extractTsFromName(b.name) || 0;
//           return tb - ta;
//         });
//         setAllFiles(mapped);
//       } catch (err) {
//         console.error("listAll error", err);
//       }
//     })();
//   }, [user, storage]);

//   // Apply filter when allFiles or selectedDate changes
//   useEffect(() => {
//     if (!allFiles || allFiles.length === 0) {
//       setFilteredFiles([]);
//       setSelectedFile(null);
//       setPageImages([]);
//       return;
//     }
//     const filtered = allFiles.filter((f) => f.dateStr === selectedDate);
//     setFilteredFiles(filtered);
//     if (filtered.length > 0) {
//       // auto-select first (most recent by sort above)
//       selectFile(filtered[0]);
//     } else {
//       // clear viewer
//       setSelectedFile(null);
//       setPageImages([]);
//       setCurrentPage(0);
//     }
//   }, [allFiles, selectedDate]);

//   // Helpers to parse name: expects a numeric timestamp somewhere like -1764406528686.pdf
//   function extractTsFromName(name) {
//     const m = name.match(/-(\d{10,})\./);
//     if (!m) return null;
//     const ts = parseInt(m[1], 10);
//     // if timestamp seems in seconds (10 digits), convert to ms
//     return ts < 1e12 ? ts * 1000 : ts;
//   }
//   function extractDateFromName(name) {
//     const ts = extractTsFromName(name);
//     if (!ts) return null;
//     const d = new Date(ts);
//     if (isNaN(d.getTime())) return null;
//     return d.toISOString().slice(0, 10); // yyyy-mm-dd
//   }

//   const selectFile = async (fileObj) => {
//     if (!fileObj) return;
//     setSelectedFile(fileObj);
//     setLoading(true);
//     setPageImages([]);
//     setCurrentPage(0);
//     try {
//       if (fileObj.ext === "pdf") {
//         // pdfjs can accept url directly
//         const pdf = await pdfjsLib.getDocument(fileObj.url).promise;
//         const imgs = [];
//         // render pages sequentially (could optimize)
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const viewport = page.getViewport({ scale: 1.5 });
//           const canvas = document.createElement("canvas");
//           canvas.width = viewport.width;
//           canvas.height = viewport.height;
//           const ctx = canvas.getContext("2d");
//           await page.render({ canvasContext: ctx, viewport }).promise;
//           imgs.push(canvas.toDataURL("image/png"));
//         }
//         setPageImages(imgs);
//       } else {
//         // image
//         setPageImages([fileObj.url]);
//       }
//     } catch (err) {
//       console.error("render error", err);
//       setPageImages([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Crop helpers
//   const onImageLoaded = (img) => {
//     imgRef.current = img;
//   };
//   const onCropChange = (nextPixelCrop, nextPercentCrop) => {
//     // react-image-crop's onChange signature varies; here we capture percent crop in crop, pixel in pixelCrop
//     setCrop(nextPercentCrop || nextPixelCrop);
//     setPixelCrop(nextPixelCrop || null);
//   };

//   const getCroppedDataUrl = () => {
//     if (!pixelCrop || !imgRef.current) return null;
//     const img = imgRef.current;
//     const scaleX = img.naturalWidth / img.width;
//     const scaleY = img.naturalHeight / img.height;
//     const pixelRatio = window.devicePixelRatio || 1;

//     const canvas = document.createElement("canvas");
//     canvas.width = Math.round(pixelCrop.width * scaleX * pixelRatio);
//     canvas.height = Math.round(pixelCrop.height * scaleY * pixelRatio);
//     const ctx = canvas.getContext("2d");
//     ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//     ctx.imageSmoothingQuality = "high";
//     ctx.drawImage(
//       img,
//       pixelCrop.x * scaleX,
//       pixelCrop.y * scaleY,
//       pixelCrop.width * scaleX,
//       pixelCrop.height * scaleY,
//       0,
//       0,
//       pixelCrop.width * scaleX,
//       pixelCrop.height * scaleY
//     );
//     return canvas.toDataURL("image/png");
//   };

//   const handleSaveCrop = () => {
//     const d = getCroppedDataUrl();
//     if (!d) {
//       alert("Please select a crop area first.");
//       return;
//     }
//     setCroppedDataUrl(d);
//     setIsCropping(false);
//     setCrop(null);
//     setPixelCrop(null);
//   };

//   // Download full original PDF file
//   const handleDownloadPdf = async () => {
//     if (!selectedFile || selectedFile.ext !== "pdf") return;
//     try {
//       const res = await fetch(selectedFile.url);
//       const blob = await res.blob();
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(blob);
//       a.download = selectedFile.name;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (err) {
//       console.error("download error", err);
//       alert("Failed to download PDF.");
//     }
//   };

//   // Page selector dropdown options
//   const pageSelectOptions = pageImages.map((_, i) => `Page ${i + 1}`);

//   // Top pagination number buttons (like screenshot)
//   const renderPageNumbers = () => {
//     if (totalPages <= 1) return null;
//     const items = [];
//     const maxVisible = 5;
//     // simple windowing
//     let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
//     let end = Math.min(totalPages - 1, start + maxVisible - 1);
//     if (end - start < maxVisible - 1) {
//       start = Math.max(0, end - (maxVisible - 1));
//     }
//     for (let i = start; i <= end; i++) {
//       items.push(
//         <button
//           key={i}
//           className={`btn btn-sm me-1 ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`}
//           onClick={() => setCurrentPage(i)}
//         >
//           {i + 1}
//         </button>
//       );
//     }
//     // forward/back double
//     return (
//       <div className="d-inline-flex align-items-center">
//         {items}
//         {currentPage < totalPages - 1 && (
//           <button className="btn btn-sm btn-outline-primary" onClick={() => setCurrentPage(totalPages - 1)}>
//             ▸▸
//           </button>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="container-fluid">
//       <div className="card shadow-sm my-2">
//         <div className="card-body">
//           {/* TOP TOOLBAR */}
//           <div className="d-flex align-items-center gap-2 mb-3">
//             {/* Page select dropdown */}
//             <div>
//               <select
//                 className="form-select form-select-sm"
//                 style={{ width: 140 }}
//                 value={currentPage}
//                 onChange={(e) => setCurrentPage(Number(e.target.value))}
//               >
//                 {pageSelectOptions.map((label, i) => (
//                   <option key={i} value={i}>
//                     {label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Page numbers */}
//             <div className="ms-2">{renderPageNumbers()}</div>

//             {/* PDF download button */}
//             <button
//               className="btn btn-warning btn-sm ms-3"
//               onClick={handleDownloadPdf}
//               disabled={!selectedFile || selectedFile.ext !== "pdf"}
//               title="Download full PDF"
//             >
//               <strong>PDF</strong>
//             </button>

//             {/* Crop button */}
//             <button
//               className="btn btn-secondary btn-sm ms-2"
//               onClick={() => {
//                 setIsCropping((p) => !p);
//                 // reset crop state when toggling on
//                 setTimeout(() => {
//                   setCrop(null);
//                   setPixelCrop(null);
//                 }, 0);
//               }}
//               title="Crop selection"
//             >
//               <i className="bi bi-scissors me-1" /> Clip
//             </button>

//             {/* Archive calendar toggle (right aligned) */}
//             <div className="ms-auto position-relative">
//               <button
//                 className="btn btn-primary btn-sm"
//                 onClick={() => setCalendarOpen((v) => !v)}
//                 title="Open archive calendar"
//               >
//                 <i className="bi bi-calendar3 me-1" /> Archive
//               </button>

//               {calendarOpen && (
//                 <div
//                   className="card position-absolute"
//                   style={{ right: 0, top: "42px", zIndex: 1200, minWidth: 240, padding: 10 }}
//                 >
//                   <div className="mb-2">
//                     <label className="form-label mb-1">Pick date</label>
//                     <input
//                       type="date"
//                       className="form-control form-control-sm"
//                       value={selectedDate}
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                     />
//                   </div>

//                   <div className="d-flex justify-content-between">
//                     <button
//                       className="btn btn-sm btn-outline-secondary"
//                       onClick={() => {
//                         setSelectedDate(new Date().toISOString().slice(0, 10));
//                       }}
//                     >
//                       Today
//                     </button>
//                     <button
//                       className="btn btn-sm btn-secondary"
//                       onClick={() => setCalendarOpen(false)}
//                     >
//                       Close
//                     </button>
//                   </div>

//                   <div className="mt-2">
//                     <small className="text-muted">Files for {selectedDate} : {filteredFiles.length}</small>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* MAIN LAYOUT: left thumbnails | right viewer */}
//           <div className="row">
//             {/* Left thumbnails (pages list) */}
//             <div className="col-3" style={{ maxHeight: "65vh", overflowY: "auto", borderRight: "1px solid #eee" }}>

//               {/* If no files for date */}
//               {filteredFiles.length === 0 && (
//                 <div className="alert alert-light">No data available for selected date.</div>
//               )}



//               {/* Page thumbnails (when a file selected) */}
//               <div>
//                 {/* <h6 className="mb-2">Pages</h6> */}
//                 {loading && <div>Rendering pages…</div>}
//                 {!loading && pageImages.length === 0 && selectedFile && (
//                   <div className="text-muted">No pages to show</div>
//                 )}
//                 {!loading &&
//                   pageImages.map((src, i) => (
//                     <div
//                       key={i}
//                       className={`mb-2 p-1 ${i === currentPage ? "border border-primary" : "border border-light"}`}
//                       style={{ cursor: "pointer", background: "#fff" }}
//                       onClick={() => setCurrentPage(i)}
//                     >
//                       <img src={src} alt={`thumb-${i}`} style={{ width: "100%", display: "block" }} />
//                       <small>Page {i + 1}</small>
//                     </div>
//                   ))}
//               </div>
//             </div>

//             {/* Right viewer */}
//             <div className="col-9" style={{ maxHeight: "75vh", overflow: "auto" }}>
//               <div className="d-flex align-items-center justify-content-between mb-2">

//               </div>

//               <div className="border" style={{ minHeight: 400, padding: 10, background: "#fafafa" }}>
//                 {filteredFiles.length === 0 && (
//                   <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
//                     <div className="text-center text-muted">
//                       <h5>No data available</h5>
//                       <div>Select another date or upload files for this date.</div>
//                     </div>
//                   </div>
//                 )}

//                 {filteredFiles.length > 0 && loading && (
//                   <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
//                     Rendering pages…
//                   </div>
//                 )}

//                 {filteredFiles.length > 0 && !loading && pageImages.length > 0 && (
//                   <div style={{ position: "relative" }}>
//                     {isCropping ? (
//                       <ReactCrop
//                         crop={crop}
//                         onChange={onCropChange}
//                         onComplete={onCropChange}
//                         renderSelectionAddon={() => (
//                           <div style={{ position: "absolute", left: 0, top: -35, zIndex: 9999 }}>
//                             <button className="btn btn-success btn-sm me-1" onClick={handleSaveCrop}>
//                               Save
//                             </button>
//                             <button
//                               className="btn btn-danger btn-sm"
//                               onClick={() => {
//                                 setIsCropping(false);
//                                 setCrop(null);
//                                 setPixelCrop(null);
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         )}
//                       >
//                         <img
//                           src={pageImages[currentPage]}
//                           alt="page"
//                           onLoad={(e) => onImageLoaded(e.currentTarget)}
//                           style={{ width: "100%", display: "block" }}
//                         />
//                       </ReactCrop>
//                     ) : (
//                       <img
//                         src={pageImages[currentPage]}
//                         alt="page"
//                         style={{ width: "100%", display: "block" }}
//                         onLoad={(e) => onImageLoaded(e.currentTarget)}
//                       />
//                     )}


//                     {/* Floating action (Save crop) */}
//                     {/* {isCropping && (
//                       <div style={{ position: "absolute", top: 12, left: 12, zIndex: 5 }}>
//                         <button className="btn btn-success btn-sm me-2" onClick={handleSaveCrop}>
//                           Save Crop
//                         </button>
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => {
//                             setIsCropping(false);
//                             setCrop(null);
//                             setPixelCrop(null);
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     )} */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Cropped result modal */}
//           {croppedDataUrl && (


//             <CropModal
//               image={croppedDataUrl}
//               title={selectedFile ? selectedFile.name.replace(/\.[^.]+$/, "") + "-crop" : "crop"}
//               onClose={() => setCroppedDataUrl(null)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfImageViewer;

// src/components/PdfImageViewer.jsx
import React, { useState, useEffect, useRef } from "react";
import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CropModal from "./CropModal";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfImageViewer = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  const [allFiles, setAllFiles] = useState([]); // { name, url, ext, dateStr }
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // file object from filteredFiles
  const [pageImages, setPageImages] = useState([]); // dataURLs for pages or image url single
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Crop states
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState(null);
  const [pixelCrop, setPixelCrop] = useState(null);
  const imgRef = useRef(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // pagination controls UI (numbers)
  const totalPages = pageImages.length;

  // Fetch list on mount (if user exists)
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
        // sort newest first by name timestamp (if present)
        mapped.sort((a, b) => {
          const ta = extractTsFromName(a.name) || 0;
          const tb = extractTsFromName(b.name) || 0;
          return tb - ta;
        });
        setAllFiles(mapped);
      } catch (err) {
        console.error("listAll error", err);
      }
    })();
  }, [user, storage]);

  // Apply filter when allFiles or selectedDate changes
  useEffect(() => {
    if (!allFiles || allFiles.length === 0) {
      setFilteredFiles([]);
      setSelectedFile(null);
      setPageImages([]);
      return;
    }
    const filtered = allFiles.filter((f) => f.dateStr === selectedDate);
    setFilteredFiles(filtered);
    if (filtered.length > 0) {
      // auto-select first (most recent by sort above)
      selectFile(filtered[0]);
    } else {
      // clear viewer
      setSelectedFile(null);
      setPageImages([]);
      setCurrentPage(0);
    }
  }, [allFiles, selectedDate]);

  // Helpers to parse name: expects a numeric timestamp somewhere like -1764406528686.pdf
  function extractTsFromName(name) {
    const m = name.match(/-(\d{10,})\./);
    if (!m) return null;
    const ts = parseInt(m[1], 10);
    // if timestamp seems in seconds (10 digits), convert to ms
    return ts < 1e12 ? ts * 1000 : ts;
  }
  function extractDateFromName(name) {
    const ts = extractTsFromName(name);
    if (!ts) return null;
    const d = new Date(ts);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  }

  const selectFile = async (fileObj) => {
    if (!fileObj) return;
    setSelectedFile(fileObj);
    setLoading(true);
    setPageImages([]);
    setCurrentPage(0);
    try {
      if (fileObj.ext === "pdf") {
        // pdfjs can accept url directly
        const pdf = await pdfjsLib.getDocument(fileObj.url).promise;
        const imgs = [];
        // render pages sequentially (could optimize)
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL("image/png"));
        }
        setPageImages(imgs);
      } else {
        // image
        setPageImages([fileObj.url]);
      }
    } catch (err) {
      console.error("render error", err);
      setPageImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Crop helpers
  const onImageLoaded = (img) => {
    imgRef.current = img;
  };
  const onCropChange = (nextPixelCrop, nextPercentCrop) => {
    // react-image-crop's onChange signature varies; here we capture percent crop in crop, pixel in pixelCrop
    setCrop(nextPercentCrop || nextPixelCrop);
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

  // Download full original PDF file
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

  // Page selector dropdown options
  const pageSelectOptions = pageImages.map((_, i) => `Page ${i + 1}`);

  // Top pagination number buttons (like screenshot)
  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;
    const items = [];
    const maxVisible = 5;
    // simple windowing
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
    // forward/back double
    return (
      <div className="d-inline-flex align-items-center">
        {items}
        {currentPage < totalPages - 1 && (
          <button className="btn btn-sm btn-outline-primary" onClick={() => setCurrentPage(totalPages - 1)}>
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
          <div className="d-flex align-items-center gap-2 mb-3">
            {/* Page select dropdown */}
            <div>
              <select
                className="form-select form-select-sm"
                style={{ width: 140 }}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              >
                {pageSelectOptions.map((label, i) => (
                  <option key={i} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Page numbers */}
            <div className="ms-2">{renderPageNumbers()}</div>

            {/* PDF download button */}
            <button
              className="btn btn-warning btn-sm ms-3"
              onClick={handleDownloadPdf}
              disabled={!selectedFile || selectedFile.ext !== "pdf"}
              title="Download full PDF"
            >
              <strong>PDF</strong>
            </button>

            {/* Crop button */}
            <button
              className="btn btn-secondary btn-sm ms-2"
              onClick={() => {
                setIsCropping((p) => !p);
                // reset crop state when toggling on
                setTimeout(() => {
                  setCrop(null);
                  setPixelCrop(null);
                }, 0);
              }}
              title="Crop selection"
            >
              <i className="bi bi-scissors me-1" /> Clip
            </button>

            {/* Archive calendar toggle (right aligned) */}
            <div className="ms-auto position-relative">
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
                    <label className="form-label mb-1">Pick date</label>
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
                      onClick={() => {
                        setSelectedDate(new Date().toISOString().slice(0, 10));
                      }}
                    >
                      Today
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setCalendarOpen(false)}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-2">
                    <small className="text-muted">Files for {selectedDate} : {filteredFiles.length}</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIN LAYOUT: left thumbnails | right viewer */}
          <div className="row">
            {/* Left thumbnails (pages list) */}
            <div className="col-3" style={{ maxHeight: "65vh", overflowY: "auto", borderRight: "1px solid #eee" }}>
              {/* <div className="mb-2">
                <h6 className="mb-1">Thumbnails</h6>
                <small className="text-muted">{selectedFile ? selectedFile.name : "No file selected"}</small>
              </div> */}

              {/* If no files for date */}
              {filteredFiles.length === 0 && (
                <div className="alert alert-light">No data available for selected date.</div>
              )}

              {/* File list by date */}
              {/* {filteredFiles.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1"><strong>Files (by time)</strong></div>
                  {filteredFiles.map((f, idx) => (
                    <div
                      key={f.name}
                      className={`p-2 mb-2 rounded ${selectedFile && selectedFile.name === f.name ? "bg-primary text-white" : "bg-light"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => selectFile(f)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div style={{ fontSize: 12 }}>{f.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>{f.dateStr || "—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )} */}

              {/* Page thumbnails (when a file selected) */}
              <div>
                {/* <h6 className="mb-2">Pages</h6> */}
                {loading && <div>Rendering pages…</div>}
                {!loading && pageImages.length === 0 && selectedFile && (
                  <div className="text-muted">No pages to show</div>
                )}
                {!loading &&
                  pageImages.map((src, i) => (
                    <div
                      key={i}
                      className={`mb-2 p-1 ${i === currentPage ? "border border-primary" : "border border-light"}`}
                      style={{ cursor: "pointer", background: "#fff" }}
                      onClick={() => setCurrentPage(i)}
                    >
                      <img src={src} alt={`thumb-${i}`} style={{ width: "100%", display: "block" }} />
                      <small>Page {i + 1}</small>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right viewer */}
            <div className="col-9" style={{ maxHeight: "75vh", overflow: "auto" }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <small className="text-muted">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </small>
                </div>

                <div>
                  <span className="me-2">Page {pageImages.length ? currentPage + 1 : 0} / {pageImages.length}</span>
                </div>
              </div>

              <div className="border" style={{ minHeight: 400, padding: 10, background: "#fafafa" }}>
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
                    Rendering pages…
                  </div>
                )}

                {filteredFiles.length > 0 && !loading && pageImages.length > 0 && (
                  <div style={{ position: "relative" }}>
                    {/* {isCropping ? (
                      <ReactCrop crop={crop} onChange={onCropChange} onComplete={onCropChange}>
                        <img
                          src={pageImages[currentPage]}
                          alt="page"
                          onLoad={(e) => onImageLoaded(e.currentTarget)}
                          style={{ width: "100%", display: "block" }}
                        />
                      </ReactCrop>
                    ) : (
                      <img
                        src={pageImages[currentPage]}
                        alt="page"
                        style={{ width: "100%", display: "block" }}
                        onLoad={(e) => onImageLoaded(e.currentTarget)}
                      />
                    )} */}

                    {isCropping ? (
                      <ReactCrop
                        crop={crop}
                        onChange={onCropChange}
                        onComplete={onCropChange}
                        renderSelectionAddon={() => (
                          <div style={{ position: "absolute", left: 0, top: -35, zIndex: 9999 }}>
                            <button className="btn btn-success btn-sm me-1" onClick={handleSaveCrop}>
                              Save
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setIsCropping(false);
                                setCrop(null);
                                setPixelCrop(null);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      >
                        <img
                          src={pageImages[currentPage]}
                          alt="page"
                          onLoad={(e) => onImageLoaded(e.currentTarget)}
                          style={{ width: "100%", display: "block" }}
                        />
                      </ReactCrop>
                    ) : (
                      <img
                        src={pageImages[currentPage]}
                        alt="page"
                        style={{ width: "100%", display: "block" }}
                        onLoad={(e) => onImageLoaded(e.currentTarget)}
                      />
                    )}


                    {/* Floating action (Save crop) */}
                    {/* {isCropping && (
                      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 5 }}>
                        <button className="btn btn-success btn-sm me-2" onClick={handleSaveCrop}>
                          Save Crop
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setIsCropping(false);
                            setCrop(null);
                            setPixelCrop(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )} */}
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default PdfImageViewer;
