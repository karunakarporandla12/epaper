// // import React, { useState, useRef, useCallback, useEffect } from 'react';
// // import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// // import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// // import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
// // import 'react-image-crop/dist/ReactCrop.css';
// // import CropModal from './CropModal';

// // pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // const ASPECT_OPTIONS = [
// //   { label: 'Freeform', value: 'free' },
// //   { label: '1 : 1', value: 1 },
// //   { label: '4 : 3', value: 4 / 3 },
// //   { label: '16 : 9', value: 16 / 9 },
// //   { label: 'Custom', value: 'custom' },
// // ];

// // export default function PdfImageViewer() {
// //   const [images, setImages] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const [loading, setLoading] = useState(false);

// //   const [crop, setCrop] = useState();
// //   const [pixelCrop, setPixelCrop] = useState(null);
// //   const imgRef = useRef(null);

// //   const [aspectMode, setAspectMode] = useState('free');
// //   const [customA, setCustomA] = useState(3);
// //   const [customB, setCustomB] = useState(2);

// //   const [croppedImage, setCroppedImage] = useState(null);
// //   const [title, setTitle] = useState('');

// //   const handleFileChange = async (event) => {
// //     const file = event.target.files?.[0];
// //     if (!file || file.type !== 'application/pdf') return;

// //     setLoading(true);
// //     const reader = new FileReader();
// //     reader.onload = async () => {
// //       const typedArray = new Uint8Array(reader.result);
// //       const pdf = await pdfjsLib.getDocument(typedArray).promise;
// //       const imageUrls = [];

// //       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
// //         const page = await pdf.getPage(pageNum);
// //         const viewport = page.getViewport({ scale: 1.5 });
// //         const canvas = document.createElement('canvas');
// //         const context = canvas.getContext('2d');
// //         canvas.width = viewport.width;
// //         canvas.height = viewport.height;
// //         await page.render({ canvasContext: context, viewport }).promise;
// //         imageUrls.push(canvas.toDataURL('image/png'));
// //       }

// //       setImages(imageUrls);
// //       setCurrentPage(0);
// //       setLoading(false);
// //       setCrop(undefined);
// //       setPixelCrop(null);
// //       setCroppedImage(null);
// //     };
// //     reader.readAsArrayBuffer(file);
// //   };

// //   const applyAspect = useCallback((imgEl, aspect) => {
// //     if (!imgEl || !aspect || aspect === 'free') {
// //       setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 60 });
// //       return;
// //     }
// //     const imgW = imgEl.naturalWidth;
// //     const imgH = imgEl.naturalHeight;
// //     const make = makeAspectCrop({ unit: '%', width: 80 }, Number(aspect), imgW, imgH);
// //     const centered = centerCrop(make, imgW, imgH);
// //     setCrop(centered);
// //   }, []);

// //   const onImageLoaded = useCallback((img) => {
// //     imgRef.current = img;
// //     applyAspect(img, aspectMode === 'custom' ? customA / customB : aspectMode);
// //   }, [applyAspect, aspectMode, customA, customB]);

// //   const onCropChange = useCallback((nextPixelCrop, nextPercentCrop) => {
// //     setCrop(nextPercentCrop);
// //     setPixelCrop(nextPixelCrop);
// //   }, []);

// //   const onAspectModeChange = (val) => {
// //     setAspectMode(val);
// //     if (imgRef.current) {
// //       applyAspect(imgRef.current, val === 'custom' ? customA / customB : val);
// //     }
// //   };

// //   const getCroppedImage = () => {
// //     if (!pixelCrop || !imgRef.current) return;

// //     const img = imgRef.current;
// //     const scaleX = img.naturalWidth / img.width;
// //     const scaleY = img.naturalHeight / img.height;
// //     const pixelRatio = window.devicePixelRatio || 1;

// //     const canvas = document.createElement('canvas');
// //     canvas.width = Math.round(pixelCrop.width * scaleX * pixelRatio);
// //     canvas.height = Math.round(pixelCrop.height * scaleY * pixelRatio);

// //     const ctx = canvas.getContext('2d');
// //     ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
// //     ctx.imageSmoothingQuality = 'high';

// //     ctx.drawImage(
// //       img,
// //       pixelCrop.x * scaleX,
// //       pixelCrop.y * scaleY,
// //       pixelCrop.width * scaleX,
// //       pixelCrop.height * scaleY,
// //       0,
// //       0,
// //       pixelCrop.width * scaleX,
// //       pixelCrop.height * scaleY
// //     );

// //     const dataUrl = canvas.toDataURL('image/png');
// //     setCroppedImage(dataUrl);
// //   };

// //   const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
// //   const goNext = () => setCurrentPage((p) => Math.min(p + 1, images.length - 1));

// //   return (
// //     <div className="pdf-viewer-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
// //       <h2>PDF → Image Viewer (Resizable Crop + Aspect Toggle)</h2>

// //       <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
// //         <input type="file" accept="application/pdf" onChange={handleFileChange} />
// //         {images.length > 0 && (
// //           <>
// //             <button onClick={goPrev} disabled={currentPage === 0}>◀ Prev</button>
// //             <button onClick={goNext} disabled={currentPage === images.length - 1}>Next ▶</button>
// //             <span>Page {currentPage + 1} / {images.length}</span>
// //           </>
// //         )}
// //       </div>

// //       {loading && <div>Rendering PDF pages…</div>}

// //       {!loading && images.length > 0 && (
// //         <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12 }}>
// //           <aside style={{ overflowY: 'auto', maxHeight: 480, borderRight: '1px solid #ddd' }}>
// //             {images.map((src, i) => (
// //               <div
// //                 key={i}
// //                 onClick={() => setCurrentPage(i)}
// //                 style={{
// //                   padding: 8,
// //                   cursor: 'pointer',
// //                   background: currentPage === i ? '#eef6ff' : 'transparent',
// //                   borderLeft: currentPage === i ? '3px solid #1677ff' : '3px solid transparent'
// //                 }}
// //               >
// //                 <img src={src} alt={`Page ${i + 1}`} style={{ width: '100%', display: 'block' }} />
// //                 <small>Page {i + 1}</small>
// //               </div>
// //             ))}
// //           </aside>

// //           <main>
// //             <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
// //               <label>Aspect:</label>
// //               <select value={aspectMode} onChange={(e) => onAspectModeChange(e.target.value)}>
// //                 {ASPECT_OPTIONS.map(opt => (
// //                   <option key={opt.label} value={opt.value}>{opt.label}</option>
// //                 ))}
// //               </select>

// //               {aspectMode === 'custom' && (
// //                 <>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     value={customA}
// //                     onChange={(e) => {
// //                       const v = Math.max(1, Number(e.target.value || 1));
// //                       setCustomA(v);
// //                       if (imgRef.current) applyAspect(imgRef.current, v / customB);
// //                     }}
// //                     style={{ width: 64 }}
// //                   />
// //                   <span>:</span>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     value={customB}
// //                     onChange={(e) => {
// //                       const v = Math.max(1, Number(e.target.value || 1));
// //                       setCustomB(v);
// //                       if (imgRef.current) applyAspect(imgRef.current, customA / v);
// //                     }}
// //                     style={{ width: 64 }}
// //                   />
// //                 </>
// //               )}

// //               <button onClick={getCroppedImage} style={{ marginLeft: 'auto' }}>
// //                 Apply Crop
// //               </button>
// //             </div>

// //             <div style={{ border: '1px solid #ddd', padding: 8, position: 'relative' }}>
// //               <ReactCrop crop={crop} onChange={onCropChange}>
// //                 <img src={images[currentPage]} alt={`Page ${currentPage + 1}`} onLoad={(e) => onImageLoaded(e.currentTarget)} />
// //               </ReactCrop>
// //             </div>
// //           </main>
// //         </div>
// //       )}

// //       {/* ✅ Popup Modal for Cropped Image */}
// //       {croppedImage && (
// //         <CropModal
// //           image={croppedImage}
// //           title={title}
// //           setTitle={setTitle}
// //           onClose={() => setCroppedImage(null)}
// //         />
// //       )}
// //     </div>
// //   );
// // }



// import React, { useState, useRef, useCallback } from 'react';
// import * as pdfjsLib from 'pdfjs-dist/build/pdf';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
// import CropModal from './CropModal';

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// const ASPECT_OPTIONS = [
//   { label: 'Freeform', value: 'free' },
//   { label: '1 : 1', value: 1 },
//   { label: '4 : 3', value: 4 / 3 },
//   { label: '16 : 9', value: 16 / 9 },
//   { label: 'Custom', value: 'custom' },
// ];

// export default function PdfImageViewer() {
//   const [images, setImages] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [crop, setCrop] = useState();
//   const [pixelCrop, setPixelCrop] = useState(null);
//   const imgRef = useRef(null);
//   const [isCropping, setIsCropping] = useState(false);
//   const [aspectMode, setAspectMode] = useState('free');
//   const [customA, setCustomA] = useState(3);
//   const [customB, setCustomB] = useState(2);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const [title, setTitle] = useState('');

//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file || file.type !== 'application/pdf') return;

//     setLoading(true);
//     const reader = new FileReader();
//     reader.onload = async () => {
//       const typedArray = new Uint8Array(reader.result);
//       const pdf = await pdfjsLib.getDocument(typedArray).promise;
//       const imageUrls = [];

//       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 1.5 });
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         await page.render({ canvasContext: context, viewport }).promise;
//         imageUrls.push(canvas.toDataURL('image/png'));
//       }

//       setImages(imageUrls);
//       setCurrentPage(0);
//       setLoading(false);
//       setCrop(undefined);
//       setPixelCrop(null);
//       setCroppedImage(null);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const applyAspect = useCallback((imgEl, aspect) => {
//     if (!imgEl || !aspect || aspect === 'free') {
//       setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 60 });
//       return;
//     }
//     const imgW = imgEl.naturalWidth;
//     const imgH = imgEl.naturalHeight;
//     const make = makeAspectCrop({ unit: '%', width: 80 }, Number(aspect), imgW, imgH);
//     const centered = centerCrop(make, imgW, imgH);
//     setCrop(centered);
//   }, []);

//   const onImageLoaded = useCallback((img) => {
//     imgRef.current = img;
//     // Do NOT apply crop automatically unless cropping is enabled
//   }, []);

//   const onCropChange = useCallback((nextPixelCrop, nextPercentCrop) => {
//     setCrop(nextPercentCrop);
//     setPixelCrop(nextPixelCrop);
//   }, []);

//   const onAspectModeChange = (val) => {
//     setAspectMode(val);
//     if (isCropping && imgRef.current) {
//       applyAspect(imgRef.current, val === 'custom' ? customA / customB : val);
//     }
//   };

//   const getCroppedImage = () => {
//     if (!pixelCrop || !imgRef.current) {
//       alert('Please select a crop area first!');
//       return;
//     }
//     const img = imgRef.current;
//     const scaleX = img.naturalWidth / img.width;
//     const scaleY = img.naturalHeight / img.height;
//     const pixelRatio = window.devicePixelRatio || 1;
//     const canvas = document.createElement('canvas');
//     canvas.width = Math.round(pixelCrop.width * scaleX * pixelRatio);
//     canvas.height = Math.round(pixelCrop.height * scaleY * pixelRatio);
//     const ctx = canvas.getContext('2d');
//     ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//     ctx.imageSmoothingQuality = 'high';
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
//     const dataUrl = canvas.toDataURL('image/png');
//     setCroppedImage(dataUrl);
//   };

//   const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
//   const goNext = () => setCurrentPage((p) => Math.min(p + 1, images.length - 1));

//   return (
//     <div className="pdf-viewer-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//       <h2>PDF → Image Viewer (Resizable Crop + Aspect Toggle)</h2>
//       <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//         <input type="file" accept="application/pdf" onChange={handleFileChange} />
//         {images.length > 0 && (
//           <>
//             <button onClick={goPrev} disabled={currentPage === 0}>◀ Prev</button>
//             <button onClick={goNext} disabled={currentPage === images.length - 1}>Next ▶</button>
//             <span>Page {currentPage + 1} / {images.length}</span>
//           </>
//         )}
//       </div>

//       {loading && <div>Rendering PDF pages…</div>}

//       {!loading && images.length > 0 && (
//         <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12 }}>
//           <aside style={{ overflowY: 'auto', maxHeight: 480, borderRight: '1px solid #ddd' }}>
//             {images.map((src, i) => (
//               <div
//                 key={i}
//                 onClick={() => setCurrentPage(i)}
//                 style={{
//                   padding: 8,
//                   cursor: 'pointer',
//                   background: currentPage === i ? '#eef6ff' : 'transparent',
//                   borderLeft: currentPage === i ? '3px solid #1677ff' : '3px solid transparent'
//                 }}
//               >
//                 <img src={src} alt={`Page ${i + 1}`} style={{ width: '100%', display: 'block' }} />
//                 <small>Page {i + 1}</small>
//               </div>
//             ))}
//           </aside>

//           <main>
//             <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
//               <label>Aspect:</label>
//               <select value={aspectMode} onChange={(e) => onAspectModeChange(e.target.value)}>
//                 {ASPECT_OPTIONS.map(opt => (
//                   <option key={opt.label} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//               {aspectMode === 'custom' && (
//                 <>
//                   <input
//                     type="number"
//                     min="1"
//                     value={customA}
//                     onChange={(e) => {
//                       const v = Math.max(1, Number(e.target.value || 1));
//                       setCustomA(v);
//                       if (isCropping && imgRef.current) applyAspect(imgRef.current, v / customB);
//                     }}
//                     style={{ width: 64 }}
//                   />
//                   <span>:</span>
//                   <input
//                     type="number"
//                     min="1"
//                     value={customB}
//                     onChange={(e) => {
//                       const v = Math.max(1, Number(e.target.value || 1));
//                       setCustomB(v);
//                       if (isCropping && imgRef.current) applyAspect(imgRef.current, customA / v);
//                     }}
//                     style={{ width: 64 }}
//                   />
//                 </>
//               )}
//               <button onClick={getCroppedImage} disabled={!pixelCrop} style={{ marginLeft: 'auto' }}>
//                 Apply Crop
//               </button>
//               <button
//                 className="crop-btn"
//                 onClick={() => {
//                   setIsCropping((prev) => {
//                     const next = !prev;
//                     if (next && imgRef.current) {
//                       applyAspect(imgRef.current, aspectMode === 'custom' ? customA / customB : aspectMode);
//                     } else {
//                       setCrop(undefined);
//                       setPixelCrop(null);
//                     }
//                     return next;
//                   });
//                 }}
//                 title={isCropping ? 'Exit Crop' : 'Crop'}
//               >
//                 ✂️ {isCropping ? 'Exit Crop' : 'Crop'}
//               </button>
//             </div>

//             <div style={{ border: '1px solid #ddd', padding: 8, position: 'relative' }}>
//               {isCropping ? (
                

//                 <ReactCrop crop={crop} onChange={onCropChange}>
                 
//                   <img
//                     src={images[currentPage]}
//                     alt={`Page ${currentPage + 1}`}
//                     onLoad={(e) => onImageLoaded(e.currentTarget)}
//                   />
//                 </ReactCrop>
//               ) : (
//                 <img
//                   src={images[currentPage]}
//                   alt={`Page ${currentPage + 1}`}
//                   onLoad={(e) => onImageLoaded(e.currentTarget)}
//                   style={{ maxWidth: '100%' }}
//                 />
//               )}
//             </div>
//           </main>
//         </div>
//       )}

//       {/* ✅ Popup Modal for Cropped Image */}
//       {croppedImage && (
//         <CropModal
//           image={croppedImage}
//           title={title}
//           setTitle={setTitle}
//           onClose={() => setCroppedImage(null)}
//         />
//       )}
//     </div>
//   );
// }


import React, { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CropModal from './CropModal';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ASPECT_OPTIONS = [
  { label: 'Freeform', value: 'free' },
  { label: '1 : 1', value: 1 },
  { label: '4 : 3', value: 4 / 3 },
  { label: '16 : 9', value: 16 / 9 },
  { label: 'Custom', value: 'custom' },
];

// Convert dataURL to File (needed for Web Share files)
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export const PdfImageViewer = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState();
  const [pixelCrop, setPixelCrop] = useState(null);
  const imgRef = useRef(null);

  const [aspectMode, setAspectMode] = useState('free');
  const [customA, setCustomA] = useState(3);
  const [customB, setCustomB] = useState(2);

  const [croppedImage, setCroppedImage] = useState(null);
  const [title, setTitle] = useState('');

  // Load PDF → pages → dataURLs
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const imageUrls = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        imageUrls.push(canvas.toDataURL('image/png'));
      }

      setImages(imageUrls);
      setCurrentPage(0);
      setLoading(false);

      // Reset crop state
      setIsCropping(false);
      setCrop(undefined);
      setPixelCrop(null);
      setCroppedImage(null);
    };
    reader.readAsArrayBuffer(file);
  };

  // Create an initial crop based on aspect
  const applyAspect = useCallback((imgEl, aspect) => {
    if (!imgEl || !aspect || aspect === 'free') {
      setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 60 });
      return;
    }
    const imgW = imgEl.naturalWidth;
    const imgH = imgEl.naturalHeight;
    const make = makeAspectCrop({ unit: '%', width: 80 }, Number(aspect), imgW, imgH);
    const centered = centerCrop(make, imgW, imgH);
    setCrop(centered);
  }, []);

  const onImageLoaded = useCallback((img) => {
    imgRef.current = img; // Do NOT apply crop automatically
  }, []);

  const onCropChange = useCallback((nextPixelCrop, nextPercentCrop) => {
    setCrop(nextPercentCrop);
    setPixelCrop(nextPixelCrop);
  }, []);

  const onAspectModeChange = (val) => {
    setAspectMode(val);
    if (isCropping && imgRef.current) {
      applyAspect(imgRef.current, val === 'custom' ? customA / customB : val);
    }
  };

  // -- Cropping utils --
  const getCroppedDataUrl = () => {
    if (!pixelCrop || !imgRef.current) return null;

    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const pixelRatio = window.devicePixelRatio || 1;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(pixelCrop.width * scaleX * pixelRatio);
    canvas.height = Math.round(pixelCrop.height * scaleY * pixelRatio);
    const ctx = canvas.getContext('2d');

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      img,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0, 0,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY
    );

    return canvas.toDataURL('image/png');
  };

  const getCroppedImage = () => {
    const dataUrl = getCroppedDataUrl();
    if (!dataUrl) {
      alert('Please select a crop area first!');
      return;
    }
    setCroppedImage(dataUrl); // Opens the modal
  };

  const shareCroppedSelection = async () => {
    const dataUrl = getCroppedDataUrl();
    if (!dataUrl) {
      alert('Please select a crop area first!');
      return;
    }

    try {
      if (navigator.share && navigator.canShare) {
        const file = dataURLtoFile(dataUrl, 'cropped.png');
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Cropped Image',
            text: 'Here is the cropped selection.',
            files: [file],
          });
          return;
        }
      }
      // Fallback: trigger download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'cropped.png';
      a.click();
    } catch (err) {
      console.error('Share failed:', err);
      alert('Sharing failed. The image will be downloaded instead.');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'cropped.png';
      a.click();
    }
  };

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, images.length - 1));

  // Buttons INSIDE selection (this is what makes them stick and move)
  const renderSelectionAddon = () => {
    return (
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: -50,
          display: 'flex',
          gap: 8,
          padding: '6px 8px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 6,
          color: '#fff',
          alignItems: 'center',
          zIndex: 2,
        }}
        // Ensure addon receives pointer events
        className="crop-selection-toolbar"
      >
        <button
          // onClick={getCroppedImage}
          

  onClick={() => {
    // First perform share logic
    getCroppedImage();

    // Then cancel crop selection
    setIsCropping(false);
    setCrop(undefined);
    setPixelCrop(null);
  }}

          


          disabled={!pixelCrop}
          style={{
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 4,
            cursor: pixelCrop ? 'pointer' : 'not-allowed',
          }}
        >
          
<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path fill="#fff" fill-rule="nonzero" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 14 5a2.99 2.99 0 0 0 1.96.77l-7.05 4.11a2.5 2.5 0 0 0 0 1.39l7.05 4.11c.52-.47 1.2-.77 1.96-.77a3 3 0 1 0 0-6c-.76 0-1.44.3-1.96.77l-7.05-4.11a2.99 2.99 0 1 0-1.96 5.23c.76 0 1.44-.3 1.96-.77l7.05 4.11c.52-.47 1.2-.77 1.96-.77a3 3 0 1 0 0 6z"/>
          {/* <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a2.5 2.5 0 0 0 0-1.39l7.05-4.11A2.99 2.99 0 1 0 14 5a2.99 2.99 0 0 0 1.96.77l-7.05 4.11a2.5 2.5 0 0 0 0 1.39l7.05 4.11c.52-.47 1.2-.77 1.96-.77a3 3 0 1 0 0-6c-.76 0-1.44.3-1.96.77l-7.05-4.11a2.99 2.99 0 1 0-1.96 5.23c.76 0 1.44-.3 1.96-.77l7.05 4.11c.52-.47 1.2-.77 1.96-.77a3 3 0 1 0 0 6z"/> */}
        </svg>


          Share
        </button>
        <button
          onClick={() => {
            setIsCropping(false);
            setCrop(undefined);
            setPixelCrop(null);
          }}
          style={{
            background: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        {/* <button
          onClick={shareCroppedSelection}
          disabled={!pixelCrop}
          style={{
            background: '#00b894',
            color: '#fff',
            border: 'none',
            padding: '6px 10px',
            borderRadius: 4,
            cursor: pixelCrop ? 'pointer' : 'not-allowed',
          }}
          title="Share cropped selection"
        >
          Share
        </button> */}
      </div>
    );
  };

  return (
    <div className="pdf-viewer-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>PDF → Image Viewer (Crop with Floating Actions)</h2>

      {/* Top controls: file + paging */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {images.length > 0 && (
          <>
            <button className='btn btn-primary' onClick={goPrev} disabled={currentPage === 0}>◀ Prev</button>
            <button className='btn btn-primary' onClick={goNext} disabled={currentPage === images.length - 1}>Next ▶</button>
            <span>Page {currentPage + 1} / {images.length}</span>
          </>
        )}

         <button
                className="crop-btn btn btn-warning"
                onClick={() => {
                  setIsCropping((prev) => {
                    const next = !prev;
                    if (next && imgRef.current) {
                      applyAspect(imgRef.current, aspectMode === 'custom' ? customA / customB : aspectMode);
                    } else {
                      setCrop(undefined);
                      setPixelCrop(null);
                    }
                    return next;
                  });
                }}
                title={isCropping ? 'Cancel' : 'Crop'}
                style={{ marginLeft: 'auto' }}
              >
                ✂️ {isCropping ? 'Cancel' : 'Crop'}
              </button>


      </div>

      {loading && <div>Rendering PDF pages…</div>}

      {!loading && images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12 }}>
          {/* Thumbnails */}
          <aside style={{ overflowY: 'auto', maxHeight: 480, borderRight: '1px solid #ddd' }}>
            {images.map((src, i) => (
              <div
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  padding: 8,
                  cursor: 'pointer',
                  background: currentPage === i ? '#eef6ff' : 'transparent',
                  borderLeft: currentPage === i ? '3px solid #1677ff' : '3px solid transparent'
                }}
              >
                <img src={src} alt={`Page ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                <small>Page {i + 1}</small>
              </div>
            ))}
          </aside>

          {/* Main */}
          <main>
            {/* Aspect + Crop toggle row */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
           

              {/* Crop toggle */}
              {/* <button
                className="crop-btn"
                onClick={() => {
                  setIsCropping((prev) => {
                    const next = !prev;
                    if (next && imgRef.current) {
                      applyAspect(imgRef.current, aspectMode === 'custom' ? customA / customB : aspectMode);
                    } else {
                      setCrop(undefined);
                      setPixelCrop(null);
                    }
                    return next;
                  });
                }}
                title={isCropping ? 'Cancel' : 'Crop'}
                style={{ marginLeft: 'auto' }}
              >
                ✂️ {isCropping ? 'Cancel' : 'Crop'}
              </button> */}
            </div>

            {/* Image + crop (selection addon renders here) */}
            <div style={{ border: '1px solid #ddd', padding: 8, position: 'relative' }}>
              {isCropping ? (
                <ReactCrop
                  crop={crop}
                  onChange={onCropChange}
                  renderSelectionAddon={renderSelectionAddon}
                >
                  <img
                    src={images[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    onLoad={(e) => onImageLoaded(e.currentTarget)}
                  />
                </ReactCrop>
              ) : (
                <img
                  src={images[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  onLoad={(e) => onImageLoaded(e.currentTarget)}
                  style={{ maxWidth: '100%' }}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* Modal shows the resulting cropped image */}
      {croppedImage && (
        <CropModal
          image={croppedImage}
          title={title}
          setTitle={setTitle}
          onClose={() => setCroppedImage(null)}
        />
      )}
    </div>
  );
}
export default PdfImageViewer;