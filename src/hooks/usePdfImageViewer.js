
// // src/hooks/usePdfImageViewer.js
// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { getStorage, ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
// import { getAuth } from "firebase/auth";
// import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// // ✅ Use the official helper to convert % crops to display pixels
// import { convertToPixelCrop } from "react-image-crop";

// // --- PDF.js worker setup (required once globally) ---
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// // Tunables
// const DEFAULTS = {
//     PAGE_SCALE: 1.2,
//     PAGE_QUALITY: 0.85, // JPEG quality for PDF fallback images
//     THUMB_SCALE: 0.3,
//     THUMB_QUALITY: 0.7,
//     MAX_CACHE: 6,
// };

// export default function usePdfImageViewer(config = {}) {
//     const {
//         PAGE_SCALE,
//         PAGE_QUALITY,
//         THUMB_SCALE,
//         THUMB_QUALITY,
//         MAX_CACHE,
//     } = { ...DEFAULTS, ...config };

//     // Firebase
//     const auth = getAuth();
//     const user = auth.currentUser;
//     const storage = getStorage();

//     // Files listing & selection
//     const [allFiles, setAllFiles] = useState([]); // { name, url, ext, dateStr }
//     const [filteredFiles, setFilteredFiles] = useState([]);
//     const [selectedFile, setSelectedFile] = useState(null);

//     // Image-first vs PDF fallback
//     const [imagePages, setImagePages] = useState(null); // array of URLs (if present)
//     const [pdfDocRef, setPdfDocRef] = useState(null);   // PDFDocumentProxy (fallback)
//     const [totalPages, setTotalPages] = useState(0);
//     const [currentPage, setCurrentPage] = useState(0);  // zero-based index
//     const [loading, setLoading] = useState(false);
//     const [renderedImageDataUrl, setRenderedImageDataUrl] = useState(null); // pdf fallback rendered image

//     // Date filter (yyyy-mm-dd)
//     const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
//     const [calendarOpen, setCalendarOpen] = useState(false);

//     // Crop states (percent crop for UI; we’ll derive pixel crop properly)
//     const [isCropping, setIsCropping] = useState(false);
//     const [crop, setCrop] = useState(null);             // PercentCrop or PixelCrop (we’ll treat as percent)
//     const [percentCrop, setPercentCrop] = useState(null); // Explicitly track PercentCrop
//     const imgRef = useRef(null);
//     const [croppedDataUrl, setCroppedDataUrl] = useState(null);

//     // Caches
//     const pageImageCache = useRef(new Map()); // key: pageIndex -> dataURL
//     const thumbCache = useRef(new Map());     // key: pageIndex -> dataURL

//     // ---------- name helpers ----------
//     const extractTsFromName = useCallback((name) => {
//         const m = name.match(/-(\d{10,})\./);
//         if (!m) return null;
//         const ts = parseInt(m[1], 10);
//         return ts < 1e12 ? ts * 1000 : ts;
//     }, []);

//     const extractDateFromName = useCallback((name) => {
//         const ts = extractTsFromName(name);
//         if (!ts) return null;
//         const d = new Date(ts);
//         if (isNaN(d.getTime())) return null;
//         return d.toISOString().slice(0, 10); // yyyy-mm-dd
//     }, [extractTsFromName]);

//     const basenameNoExt = useCallback((name) => name.replace(/\.[^.]+$/, ""), []);

//     // ---------- clear state ----------
//     const clearViewerState = useCallback(() => {
//         setSelectedFile(null);
//         setPdfDocRef(null);
//         setTotalPages(0);
//         setCurrentPage(0);
//         setRenderedImageDataUrl(null);
//         setImagePages(null);
//         pageImageCache.current.clear();
//         thumbCache.current.clear();
//     }, []);

//     // ---------- list bucket items ----------
//     useEffect(() => {
//         if (!user) return;
//         const folder = storageRef(storage, `editions/${user.uid}`);
//         let cancelled = false;
//         (async () => {
//             try {
//                 const res = await listAll(folder);
//                 const mapped = await Promise.all(
//                     res.items.map(async (it) => {
//                         const url = await getDownloadURL(it);
//                         const name = it.name;
//                         const ext = name.split(".").pop().toLowerCase();
//                         const dateStr = extractDateFromName(name); // yyyy-mm-dd or null
//                         return { name, url, ext, dateStr };
//                     })
//                 );
//                 // newest first by embedded timestamp
//                 mapped.sort((a, b) => (extractTsFromName(b.name) ?? 0) - (extractTsFromName(a.name) ?? 0));
//                 if (!cancelled) setAllFiles(mapped);
//             } catch (err) {
//                 console.error("listAll error", err);
//             }
//         })();
//         return () => { cancelled = true; };
//     }, [user, storage, extractDateFromName, extractTsFromName]);

//     // ---------- find pre-rendered images ----------
//     const findPageImagesForPdf = useCallback((pdfName) => {
//         // Matches <slug>-<ts>-pageN.(webp|jpg|jpeg|png)
//         const base = basenameNoExt(pdfName);
//         const re = new RegExp(`^${base}-page(\\d+)\\.(webp|jpg|jpeg|png)$`, "i");
//         const matched = allFiles
//             .filter((f) => re.test(f.name))
//             .map((f) => ({ ...f, page: parseInt(f.name.match(re)[1], 10) }))
//             .sort((a, b) => a.page - b.page);
//         return matched.length ? matched.map((m) => m.url) : null;
//     }, [allFiles, basenameNoExt]);

//     // ---------- rendering helpers (PDF fallback) ----------
//     const renderPageToDataURL = useCallback(async (pdf, pageIndex, scale = PAGE_SCALE) => {
//         if (pageImageCache.current.has(pageIndex)) {
//             return pageImageCache.current.get(pageIndex);
//         }
//         const page = await pdf.getPage(pageIndex);
//         const viewport = page.getViewport({ scale });
//         const canvas = document.createElement("canvas");
//         canvas.width = Math.floor(viewport.width);
//         canvas.height = Math.floor(viewport.height);
//         const ctx = canvas.getContext("2d", { willReadFrequently: true });
//         await page.render({ canvasContext: ctx, viewport }).promise;
//         const dataURL = canvas.toDataURL("image/jpeg", PAGE_QUALITY);
//         pageImageCache.current.set(pageIndex, dataURL);
//         // simple LRU eviction
//         if (pageImageCache.current.size > MAX_CACHE) {
//             const keys = [...pageImageCache.current.keys()];
//             pageImageCache.current.delete(keys[0]);
//         }
//         return dataURL;
//     }, [PAGE_SCALE, PAGE_QUALITY, MAX_CACHE]);

//     const renderThumbToDataURL = useCallback(async (pdf, pageIndex, scale = THUMB_SCALE) => {
//         if (thumbCache.current.has(pageIndex)) {
//             return thumbCache.current.get(pageIndex);
//         }
//         const page = await pdf.getPage(pageIndex);
//         const viewport = page.getViewport({ scale });
//         const canvas = document.createElement("canvas");
//         canvas.width = Math.floor(viewport.width);
//         canvas.height = Math.floor(viewport.height);
//         const ctx = canvas.getContext("2d");
//         await page.render({ canvasContext: ctx, viewport }).promise;
//         const dataURL = canvas.toDataURL("image/jpeg", THUMB_QUALITY);
//         thumbCache.current.set(pageIndex, dataURL);
//         return dataURL;
//     }, [THUMB_SCALE, THUMB_QUALITY]);

//     const prefetchNeighbors = useCallback((pdf, pageIndex) => {
//         const toPrefetch = [pageIndex + 1, pageIndex - 1].filter(
//             (p) => p >= 1 && p <= pdf.numPages && !pageImageCache.current.has(p)
//         );
//         for (const p of toPrefetch) {
//             Promise.resolve().then(() => renderPageToDataURL(pdf, p).catch(() => { }));
//         }
//     }, [renderPageToDataURL]);

//     // ---------- select file ----------
//     const selectFile = useCallback(async (fileObj) => {
//         if (!fileObj) return;
//         setSelectedFile(fileObj);
//         setLoading(true);
//         setCurrentPage(0);
//         setRenderedImageDataUrl(null);
//         setImagePages(null);
//         pageImageCache.current.clear();
//         setPdfDocRef(null);
//         setTotalPages(0);

//         try {
//             if (fileObj.ext === "pdf") {
//                 // Prefer pre-rendered images
//                 const pages = findPageImagesForPdf(fileObj.name);
//                 if (pages && pages.length > 0) {
//                     setImagePages(pages);
//                     setTotalPages(pages.length);
//                     setLoading(false);
//                     return;
//                 }

//                 // Fallback: PDF.js lazy render
//                 const pdf = await pdfjsLib.getDocument({
//                     url: fileObj.url,
//                     disableStream: true,
//                     disableAutoFetch: true,
//                 }).promise;
//                 setPdfDocRef(pdf);
//                 setTotalPages(pdf.numPages);
//                 const firstDataURL = await renderPageToDataURL(pdf, 1, PAGE_SCALE);
//                 setRenderedImageDataUrl(firstDataURL);
//                 prefetchNeighbors(pdf, 1);
//             } else {
//                 // Single image epaper
//                 setImagePages([fileObj.url]);
//                 setTotalPages(1);
//             }
//         } catch (err) {
//             console.error("render error", err);
//             clearViewerState();
//         } finally {
//             setLoading(false);
//         }
//     }, [findPageImagesForPdf, clearViewerState, PAGE_SCALE, renderPageToDataURL, prefetchNeighbors]);

//     // ---------- render on page change (PDF fallback) ----------
//     useEffect(() => {
//         (async () => {
//             if (!pdfDocRef || totalPages <= 0 || imagePages) return; // images mode doesn't need rendering
//             const pageIndex = currentPage + 1;
//             setLoading(true);
//             try {
//                 const dataURL = await renderPageToDataURL(pdfDocRef, pageIndex, PAGE_SCALE);
//                 setRenderedImageDataUrl(dataURL);
//                 prefetchNeighbors(pdfDocRef, pageIndex);
//             } catch (e) {
//                 console.error("page change render error", e);
//             } finally {
//                 setLoading(false);
//             }
//         })();
//     }, [currentPage, pdfDocRef, totalPages, imagePages, renderPageToDataURL, PAGE_SCALE, prefetchNeighbors]);

//     // ---------- crop helpers (robust & version-agnostic) ----------
//     const onImageLoaded = useCallback((img) => { imgRef.current = img; }, []);

//     /**
//      * We capture both values from ReactCrop:
//      *  - `crop` (first arg): can be px or %, depending on how you drive it.
//      *  - `percentCrop` (second arg): reliably % in v10+; we store it and always convert via convertToPixelCrop.
//      * This avoids the “corner crop” caused by mixing display vs natural coordinates. [1](https://www.npmjs.com/package/react-image-crop)[2](https://www.jsdocs.io/package/react-image-crop)
//      */
//     const onCropChange = useCallback((nextCrop, nextPercentCrop) => {
//         setCrop(nextCrop ?? null);
//         setPercentCrop(nextPercentCrop ?? null);
//     }, []);

//     const ensureDefaultCropBox = useCallback(() => {
//         // 80% x 60% box starting at 10%, 10%
//         setCrop({ unit: "%", x: 10, y: 10, width: 80, height: 60 });
//         setPercentCrop({ unit: "%", x: 10, y: 10, width: 80, height: 60 });
//     }, []);

//     /**
//      * Convert percent crop -> display pixel crop -> NATURAL pixel crop.
//      * This uses the official `convertToPixelCrop` helper for the display size,
//      * then scales to natural pixels for canvas drawing. [2](https://www.jsdocs.io/package/react-image-crop)
//      */
//     const getNaturalPixelCrop = useCallback(() => {
//         const img = imgRef.current;
//         if (!img || !percentCrop) return null;

//         // 1) Percent -> display pixels (container/client size)
//         const displayPixelCrop = convertToPixelCrop(percentCrop, img.width, img.height);

//         // 2) Display -> NATURAL pixels
//         const scaleX = img.naturalWidth / img.width;
//         const scaleY = img.naturalHeight / img.height;

//         const natX = Math.round(displayPixelCrop.x * scaleX);
//         const natY = Math.round(displayPixelCrop.y * scaleY);
//         const natW = Math.round(displayPixelCrop.width * scaleX);
//         const natH = Math.round(displayPixelCrop.height * scaleY);

//         return {
//             x: Math.max(0, natX),
//             y: Math.max(0, natY),
//             width: Math.max(1, natW),
//             height: Math.max(1, natH),
//         };
//     }, [percentCrop]);

//     const getCroppedDataUrl = useCallback(() => {
//         const img = imgRef.current;
//         const nat = getNaturalPixelCrop();
//         if (!img || !nat) return null;

//         const pixelRatio = window.devicePixelRatio ?? 1;
//         const canvas = document.createElement("canvas");
//         canvas.width = Math.max(1, Math.round(nat.width * pixelRatio));
//         canvas.height = Math.max(1, Math.round(nat.height * pixelRatio));

//         const ctx = canvas.getContext("2d");
//         ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
//         ctx.imageSmoothingQuality = "high";

//         try {
//             ctx.drawImage(img, nat.x, nat.y, nat.width, nat.height, 0, 0, nat.width, nat.height);
//             return canvas.toDataURL("image/png");
//         } catch (err) {
//             console.error("toDataURL failed (likely CORS):", err);
//             alert(
//                 "Crop failed due to browser security (CORS).\n\n" +
//                 "Ensure <img crossOrigin=\"anonymous\"> and your Firebase Storage bucket CORS allow GET/HEAD from your origin."
//             );
//             return null;
//         }
//     }, [getNaturalPixelCrop]);

//     const handleConfirmCrop = useCallback(() => {
//         const d = getCroppedDataUrl();
//         if (!d) return;
//         setCroppedDataUrl(d);
//         setIsCropping(false);
//         setCrop(null);
//         setPercentCrop(null);
//     }, [getCroppedDataUrl]);

//     const startCropping = useCallback(() => {
//         setIsCropping(true);
//         ensureDefaultCropBox();
//     }, [ensureDefaultCropBox]);

//     const cancelCropping = useCallback(() => {
//         setIsCropping(false);
//         setCrop(null);
//         setPercentCrop(null);
//     }, []);

//     // ---------- download original PDF ----------
//     const handleDownloadPdf = useCallback(async () => {
//         if (!selectedFile || selectedFile.ext !== "pdf") return;
//         try {
//             const res = await fetch(selectedFile.url);
//             const blob = await res.blob();
//             const a = document.createElement("a");
//             a.href = URL.createObjectURL(blob);
//             a.download = selectedFile.name;
//             document.body.appendChild(a);
//             a.click();
//             a.remove();
//         } catch (err) {
//             console.error("download error", err);
//             alert("Failed to download PDF.");
//         }
//     }, [selectedFile]);

//     // ---------- UI helpers ----------
//     const pageSelectOptions = useMemo(
//         () => Array.from({ length: totalPages }, (_, i) => `Page ${i + 1}`),
//         [totalPages]
//     );

//     const closeCropModal = useCallback(() => setCroppedDataUrl(null), []);

//     const getThumb = useCallback((p) => {
//         if (!pdfDocRef) return Promise.resolve(null);
//         return renderThumbToDataURL(pdfDocRef, p);
//     }, [pdfDocRef, renderThumbToDataURL]);

//     // ---------- apply date filter ----------
//     useEffect(() => {
//         if (!allFiles || allFiles.length === 0) {
//             setFilteredFiles([]);
//             clearViewerState();
//             return;
//         }
//         const filtered = allFiles.filter((f) => f.dateStr === selectedDate);
//         setFilteredFiles(filtered);
//         if (filtered.length > 0) {
//             selectFile(filtered[0]);
//         } else {
//             clearViewerState();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [allFiles, selectedDate]);

//     return {
//         // state
//         allFiles,
//         filteredFiles,
//         selectedFile,
//         imagePages,
//         pdfDocRef,
//         totalPages,
//         currentPage,
//         loading,
//         renderedImageDataUrl,
//         selectedDate,
//         calendarOpen,
//         isCropping,
//         crop,
//         percentCrop,
//         croppedDataUrl,

//         // actions
//         setSelectedDate,
//         setCalendarOpen,
//         setCurrentPage,
//         selectFile,
//         handleDownloadPdf,
//         onImageLoaded,
//         onCropChange,
//         handleConfirmCrop,
//         closeCropModal,

//         // crop toggles
//         startCropping,
//         cancelCropping,

//         // helpers
//         pageSelectOptions,
//         getThumb,
//     };
// }
///////////////////////////////////////////////////////////////////////

// src/hooks/usePdfImageViewer.js
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStorage, ref as storageRef, listAll, getDownloadURL } from 'firebase/storage';

const DEFAULTS = {
    rootPath: 'editions',
    pagesDir: 'pages',
    thumbsDir: 'thumbs',
    imageExts: ['png', 'jpg', 'jpeg', 'webp'],
};

const todayYMD = () => new Date().toISOString().slice(0, 10);
const baseNoExt = (name) => name.replace(/\.[^.]+$/, '');
const extOf = (name) => {
    const i = name.lastIndexOf('.');
    return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
};

// Natural filename sort: page-1, page-2, ...
const naturalCompare = (a, b) => {
    const ax = []; const bx = [];
    a.replace(/(\d+)|(\D+)/g, (_, n, s) => ax.push([n || Infinity, s || '']));
    b.replace(/(\d+)|(\D+)/g, (_, n, s) => bx.push([n || Infinity, s || '']));
    while (ax.length && bx.length) {
        const an = ax.shift(); const bn = bx.shift();
        const numCmp = Number(an[0]) - Number(bn[0]);
        if (numCmp) return numCmp;
        if (an[1] !== bn[1]) return an[1] > bn[1] ? 1 : -1;
    }
    return ax.length - bx.length;
};

// Convert % crop to pixel crop in NATURAL pixels (for canvas)
const percentCropToPixels = (img, crop) => {
    if (!img || !crop) return null;
    const nw = img.naturalWidth, nh = img.naturalHeight;
    const x = ((crop.x ?? 0) / 100) * nw;
    const y = ((crop.y ?? 0) / 100) * nh;
    const w = ((crop.width ?? 0) / 100) * nw;
    const h = ((crop.height ?? 0) / 100) * nh;
    return {
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(w),
        height: Math.round(h),
    };
};

export default function usePdfImageViewer(userOptions) {
    const opts = { ...DEFAULTS, ...(userOptions || {}) };
    const storage = getStorage();

    // ✅ Read params at top-level (public deep-links supported)
    const { uid: uidParam, date: dateParam, base: baseParam, editionId: editionIdParam } = useParams();

    // Public state (no auth dependency)
    const [uid, setUid] = useState(uidParam || null);
    const [selectedDate, setSelectedDate] = useState(dateParam || todayYMD());
    const [calendarOpen, setCalendarOpen] = useState(false);

    const [filteredFiles, setFilteredFiles] = useState([]); // [{name, url, ext, fullPath}]
    const [selectedFile, setSelectedFile] = useState(null);

    const [imagePages, setImagePages] = useState([]);       // page image URLs if present
    const [renderedImageDataUrl, setRenderedImageDataUrl] = useState(null); // unused here (no pdfjs fallback)
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Crop
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState(null);
    const [croppedDataUrl, setCroppedDataUrl] = useState(null);
    const imageElRef = useRef(null);

    // ---- Path builders ----
    const pathListForDate = useCallback(
        (uidArg, dateYMD) => `${opts.rootPath}/${uidArg}/${dateYMD}/`,
        [opts.rootPath]
    );
    const pathPagesForBase = useCallback(
        (uidArg, dateYMD, base) => `${opts.rootPath}/${uidArg}/${dateYMD}/${base}/${opts.pagesDir}/`,
        [opts.rootPath, opts.pagesDir]
    );
    const pathThumbsForBase = useCallback(
        (uidArg, dateYMD, base) => `${opts.rootPath}/${uidArg}/${dateYMD}/${base}/${opts.thumbsDir}/`,
        [opts.rootPath, opts.thumbsDir]
    );

    // ---- List files for current date ----
    const listEditionFiles = useCallback(async () => {
        if (!uid || !selectedDate) return;
        try {
            const dirRef = storageRef(storage, pathListForDate(uid, selectedDate));
            const listing = await listAll(dirRef);
            const items = await Promise.all(
                listing.items.map(async (itemRef) => ({
                    name: itemRef.name,
                    url: await getDownloadURL(itemRef),
                    ext: extOf(itemRef.name),
                    fullPath: itemRef.fullPath,
                }))
            );
            items.sort((a, b) => a.name.localeCompare(b.name));
            setFilteredFiles(items);
            // reset selection
            setSelectedFile(null);
            setImagePages([]);
            setRenderedImageDataUrl(null);
            setTotalPages(0);
            setCurrentPage(0);
        } catch (err) {
            console.error('Failed to list edition files:', err);
            setFilteredFiles([]);
        }
    }, [storage, uid, selectedDate, pathListForDate]);

    useEffect(() => { listEditionFiles(); }, [listEditionFiles]);

    // ---- Auto-select from URL (:base or :editionId) AFTER files load ----
    useEffect(() => {
        const preselect = baseParam || editionIdParam;
        if (!preselect || !filteredFiles.length) return;
        const match = filteredFiles.find((f) => baseNoExt(f.name) === preselect);
        if (match) selectFile(match);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseParam, editionIdParam, filteredFiles]);

    // ---- Select file & load page images if any ----
    const selectFile = useCallback(async (file) => {
        if (!file) return;
        setSelectedFile(file);
        setLoading(true);
        setImagePages([]);
        setRenderedImageDataUrl(null);
        setTotalPages(0);
        setCurrentPage(0);

        const base = baseNoExt(file.name);
        const isImage = opts.imageExts.includes(file.ext);
        const isPdf = file.ext === 'pdf';

        try {
            if (isImage) {
                setImagePages([file.url]);
                setTotalPages(1);
            } else if (isPdf) {
                // Look for pre-rendered pages
                const pagesDirRef = storageRef(storage, pathPagesForBase(uid, selectedDate, base));
                const list = await listAll(pagesDirRef);
                if (list.items.length > 0) {
                    const pageFiles = await Promise.all(
                        list.items.map(async (item) => ({ name: item.name, url: await getDownloadURL(item) }))
                    );
                    pageFiles.sort((a, b) => naturalCompare(a.name, b.name));
                    setImagePages(pageFiles.map((pf) => pf.url));
                    setTotalPages(pageFiles.length);
                } else {
                    // No pre-rendered pages found -> keep 0 pages; viewer will show fallback thumbs if you provide getThumb
                    setImagePages([]);
                    setTotalPages(0);
                    setRenderedImageDataUrl(null);
                }
            } else {
                // Unknown => treat like single-image
                setImagePages([file.url]);
                setTotalPages(1);
            }
            setCurrentPage(0);
        } catch (err) {
            console.error('Failed to load file/pages:', err);
        } finally {
            setLoading(false);
        }
    }, [storage, uid, selectedDate, pathPagesForBase, opts.imageExts]);

    // ---- Thumbnails (for PDF fallback) ----
    const getThumb = useCallback(async (pageIndexOneBased) => {
        if (!selectedFile || !uid) return null;
        const base = baseNoExt(selectedFile.name);
        const thumbsDir = pathThumbsForBase(uid, selectedDate, base);
        const candidates = [
            `${thumbsDir}page-${pageIndexOneBased}.png`,
            `${thumbsDir}${pageIndexOneBased}.png`,
            `${thumbsDir}thumb-${pageIndexOneBased}.png`,
        ];
        for (const p of candidates) {
            try {
                const url = await getDownloadURL(storageRef(storage, p));
                return url;
            } catch {/* try next */ }
        }
        return null;
    }, [storage, selectedFile, uid, selectedDate, pathThumbsForBase]);

    // ---- Page select options ----
    const pageSelectOptions = useMemo(() => {
        const count = imagePages?.length ? imagePages.length : totalPages;
        return Array.from({ length: count }, (_, i) => `Page ${i + 1}`);
    }, [imagePages, totalPages]);

    // ---- Crop helpers ----
    const onImageLoaded = useCallback((imgEl) => {
        imageElRef.current = imgEl;
        if (!crop) setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
    }, [crop]);

    const onCropChange = useCallback((nextCrop) => {
        if (!nextCrop) return;
        setCrop({
            unit: '%',
            x: nextCrop.x ?? 0,
            y: nextCrop.y ?? 0,
            width: nextCrop.width ?? 0,
            height: nextCrop.height ?? 0,
        });
    }, []);

    const startCropping = useCallback(() => {
        setIsCropping(true);
        if (!crop) setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 });
    }, [crop]);

    const cancelCropping = useCallback(() => {
        setIsCropping(false);
        // leave current selection
    }, []);

    const handleConfirmCrop = useCallback(() => {
        const imgEl = imageElRef.current;
        if (!imgEl || !crop) return;
        const px = percentCropToPixels(imgEl, crop);
        if (!px || px.width <= 0 || px.height <= 0) return;
        const canvas = document.createElement('canvas');
        canvas.width = px.width; canvas.height = px.height;
        const ctx = canvas.getContext('2d');
        try {
            ctx.drawImage(imgEl, px.x, px.y, px.width, px.height, 0, 0, px.width, px.height);
            const dataUrl = canvas.toDataURL('image/png');
            setCroppedDataUrl(dataUrl);
            setIsCropping(false);
        } catch (err) {
            console.error('Crop failed:', err);
        }
    }, [crop]);

    const closeCropModal = useCallback(() => setCroppedDataUrl(null), []);

    // ---- Download original PDF ----
    const handleDownloadPdf = useCallback(() => {
        if (!selectedFile || selectedFile.ext !== 'pdf') return;
        const a = document.createElement('a');
        a.href = selectedFile.url;
        a.download = selectedFile.name;
        a.rel = 'noopener';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
    }, [selectedFile]);

    // ---- Page clamp ----
    const setCurrentPageClamped = useCallback((idx) => {
        const count = imagePages?.length ? imagePages.length : totalPages;
        const safe = count > 0 ? Math.max(0, Math.min(idx, count - 1)) : 0;
        setCurrentPage(safe);
    }, [imagePages, totalPages]);

    return {
        // state
        filteredFiles,
        selectedFile,
        imagePages,
        totalPages,
        currentPage,
        loading,
        renderedImageDataUrl,
        selectedDate,
        calendarOpen,
        isCropping,
        crop,
        croppedDataUrl,

        // actions
        setSelectedDate,
        setCalendarOpen,
        setCurrentPage: setCurrentPageClamped,
        handleDownloadPdf,
        onImageLoaded,
        onCropChange,
        handleConfirmCrop,
        closeCropModal,

        // crop toggles
        startCropping,
        cancelCropping,

        // helpers
        pageSelectOptions,
        getThumb,
        selectFile,

        // optional: override uid when not using URL params
        setUid,
    };
}
