// // src/pages/EditionViewerPage.jsx
// import React from "react";
// import { useParams } from "react-router-dom";
// import { db } from "../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import PdfImageViewer from "../components/PdfToImageViewer";

// const EditionViewerPage = () => {
//   const { uid, editionId } = useParams();
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);
//   const [initialDate, setInitialDate] = React.useState(null);
//   const [initialBase, setInitialBase] = React.useState(null);

//   React.useEffect(() => {
//     let mounted = true;

//     const loadEdition = async () => {
//       if (!uid || !editionId) {
//         setError("Invalid route params");
//         setLoading(false);
//         return;
//       }
//       try {
//         const dref = doc(db, "editions", uid, "items", editionId);
//         const snap = await getDoc(dref);
//         if (!snap.exists()) {
//           setError("Edition not found");
//           setLoading(false);
//           return;
//         }
//         const ed = snap.data();

//         // storagePath example: "editions/<uid>/<slug>-<ts>.pdf"
//         const storagePath = ed.storagePath || "";
//         const baseNoExt = storagePath.replace(/\.[^.]+$/, ""); // editions/<uid>/<slug>-<ts>
//         const baseOnly = baseNoExt.split("/").pop(); // <slug>-<ts>

//         // Extract timestamp from baseOnly: '<slug>-<ts>'
//         // It looks like your naming uses trailing -<ts>. We’ll parse the last dash segment as ts.
//         const tail = (baseOnly || "").split("-").pop();
//         let tsMs = null;
//         if (tail && /^\d{10,}$/.test(tail)) {
//           const tsNum = parseInt(tail, 10);
//           tsMs = tsNum < 1e12 ? tsNum * 1000 : tsNum; // handle seconds vs ms
//         }

//         // Prefer computing ISO date from ts; otherwise, try a fallback
//         let isoDate = null;
//         if (tsMs) {
//           const d = new Date(tsMs);
//           if (!isNaN(d.getTime())) {
//             isoDate = d.toISOString().slice(0, 10); // yyyy-mm-dd
//           }
//         }
//         // Fallback: if you have edition.editionDateISO saved, use that; else try editionDateDisplay
//         if (!isoDate && ed.editionDateISO) {
//           isoDate = ed.editionDateISO; // expect yyyy-mm-dd
//         } else if (!isoDate && ed.editionDateDisplay) {
//           // try to normalize "dd/mm/yyyy" -> yyyy-mm-dd
//           const m = String(ed.editionDateDisplay).match(
//             /^(\d{2})\/(\d{2})\/(\d{4})$/
//           );
//           if (m) isoDate = `${m[3]}-${m[2]}-${m[1]}`;
//         }

//         if (mounted) {
//           setInitialBase(baseOnly || null);
//           setInitialDate(isoDate || null);
//           setLoading(false);
//         }
//       } catch (e) {
//         console.error("EditionViewer load error", e);
//         if (mounted) {
//           setError("Failed to load edition");
//           setLoading(false);
//         }
//       }
//     };

//     loadEdition();
//     return () => {
//       mounted = false;
//     };
//   }, [uid, editionId]);

//   if (loading) {
//     return <div className="p-4 text-center">Loading edition…</div>;
//   }
//   if (error) {
//     return <div className="p-4 text-center text-danger">{error}</div>;
//   }

//   // ✅ render the same Pdf viewer with our initial hints
//   return (
//     <div className="container-fluid">
//       <PdfImageViewer initialDate={initialDate} initialBase={initialBase} />
//     </div>
//   );
// };

// export default EditionViewerPage;

// src/pages/EditionViewerPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import PdfImageViewer from "../components/PdfToImageViewer";

export default function EditionViewerPage() {
  const { uid, date, base } = useParams();
  return (
    <PdfImageViewer
      initialUid={uid}
      initialDate={date} // yyyy-mm-dd
      initialBase={base} // filename without extension
    />
  );
}
