
// src/hooks/useEditionViewer.js
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Small viewer hook:
 * - Uses pre-rendered images if present.
 * - Otherwise renders PDF pages lazily via PDF.js.
 * - Returns selectedFile, currentImage, totalPages, page, setPage, loading, error.
 */
export default function useEditionViewer(initialEdition) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePages, setImagePages] = useState([]);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [renderedImage, setRenderedImage] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cache = useRef(new Map());

    useEffect(() => {
        if (!initialEdition) return;
        (async () => {
            setLoading(true);
            setError(null);
            setImagePages([]);
            setPdfDoc(null);
            setRenderedImage(null);
            setTotalPages(0);
            setPage(0);
            cache.current.clear();

            try {
                const {
                    fileUrl,
                    storagePath,
                    images = [],
                    imagesCount = 0,
                    imagesFormat,
                    editionSlug = 'edition',
                } = initialEdition;

                // Images-first
                if (Array.isArray(images) && images.length > 0) {
                    const sanitized = images.filter(Boolean);
                    if (sanitized.length) {
                        setImagePages(sanitized);
                        setTotalPages(sanitized.length);
                        const name = storagePath ? storagePath.split('/').pop() : `${editionSlug}.${imagesFormat || 'webp'}`;
                        setSelectedFile({ name, url: sanitized[0], ext: imagesFormat || 'webp' });
                        return;
                    }
                }

                // Fallback to original file
                if (fileUrl) {
                    const ext = (fileUrl.split('?')[0].split('#')[0].split('.').pop() || '').toLowerCase();
                    const name = storagePath ? storagePath.split('/').pop() : `${editionSlug}.${ext || 'pdf'}`;
                    setSelectedFile({ name, url: fileUrl, ext: ext || 'pdf' });

                    if (ext.includes('pdf')) {
                        const pdf = await pdfjsLib.getDocument({
                            url: fileUrl,
                            disableStream: true,
                            disableAutoFetch: true,
                        }).promise;
                        setPdfDoc(pdf);
                        setTotalPages(pdf.numPages);
                        const img = await renderPageToDataURL(pdf, 1);
                        setRenderedImage(img);
                    } else {
                        setImagePages([fileUrl]);
                        setTotalPages(1);
                    }
                } else {
                    throw new Error('Edition has neither images nor fileUrl');
                }
            } catch (e) {
                setError(e.message || String(e));
            } finally {
                setLoading(false);
            }
        })();
    }, [initialEdition]);

    async function renderPageToDataURL(pdf, pageIndex, scale = 1.2, quality = 0.85) {
        if (cache.current.has(pageIndex)) return cache.current.get(pageIndex);
        const pageObj = await pdf.getPage(pageIndex);
        const viewport = pageObj.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        await pageObj.render({ canvasContext: ctx, viewport }).promise;
        const dataURL = canvas.toDataURL('image/jpeg', quality);
        cache.current.set(pageIndex, dataURL);
        if (cache.current.size > 8) {
            const firstKey = cache.current.keys().next().value;
            cache.current.delete(firstKey);
        }
        return dataURL;
    }

    // PDF rendering on page change
    useEffect(() => {
        (async () => {
            if (!pdfDoc || imagePages.length) return;
            const idx = page + 1;
            setLoading(true);
            try {
                const img = await renderPageToDataURL(pdfDoc, idx);
                setRenderedImage(img);
            } catch {
                setError('Failed to render page');
            } finally {
                setLoading(false);
            }
        })();
    }, [page, pdfDoc, imagePages]);

    const currentImage = imagePages.length ? imagePages[page] : renderedImage;

    return {
        selectedFile,
        currentImage,
        totalPages,
        page,
        setPage,
        loading,
        error,
    };
}
