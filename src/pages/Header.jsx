// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { db, storage } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { getDownloadURL, ref } from 'firebase/storage';
// import './Header.css';
// import Logo from '../assets/logo.jpg';
// import Image from '../assets/image.jpeg';

// export default function Header() {
//   const [config, setConfig] = useState(null);
//   const [logoSrc, setLogoSrc] = useState(null);
//   const [photoSrc, setPhotoSrc] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     async function loadHeader() {
//       try {
//         const snap = await getDoc(doc(db, 'siteConfig', 'header'));
//         if (!snap.exists()) throw new Error('Header config not found');
//         const data = snap.data();

//         // Resolve logo URL (supports gs:// or https)
//         const resolveUrl = async (url) => {
//           if (!url) return null;
//           if (url.startsWith('gs://')) {
//             const storageRef = ref(storage, url);
//             return await getDownloadURL(storageRef);
//           }
//           return url; // already https
//         };

//         const [logo, photo] = await Promise.all([
//           resolveUrl(data.logoUrl),
//           resolveUrl(data.photoUrl),
//         ]);

//         if (isMounted) {
//           setConfig(data);
//           setLogoSrc(logo);
//           setPhotoSrc(photo);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error('Header load error:', err);
//         if (isMounted) setLoading(false);
//       }
//     }

//     loadHeader();
//     return () => { isMounted = false; };
//   }, []);

//   if (loading) {
//     return (
//       <div className="header-bar skeleton">
//         <div className="header-inner container">
//           <div className="logo-box shimmer" />
//           <div className="photo-box shimmer" />
//         </div>
//       </div>
//     );
//   }

//   const bgColor = config?.bgColor || '#0A2A67';
//   const accentColor = config?.accentColor || '#F3A11C';
//   const bottomBorderColor = config?.bottomBorderColor || '#E6E6E6';
//   const height = config?.height || 200;
//   const paddingX = config?.paddingX ?? 16;

//   return (
//     <div
//       className="header-bar"
//       style={{
//         backgroundColor: bgColor,
//         borderBottom: `2px solid ${bottomBorderColor}`,
//         minHeight: height,
//       }}
//     >
//       <div className="header-inner container" style={{ paddingLeft: paddingX, paddingRight: paddingX }}>
//         {/* Left: logo block */}
//         <div className="" style={{ backgroundColor: accentColor }}>
//           {logoSrc ? (
//             <img src={logoSrc} alt="Logo" className="logo-img" />
//           ) : (
//             // <div className="logo-fallback">
//              <div className="">
//               <img src = {Logo} alt='image' style={{height: "120px"}} />
//               </div>
//           )}
//         </div>

//         {/* Spacer */}
//         <div className="flex-spacer" />

//         {/* Right: square photo */}
//         <div className="photo-box">
//           {photoSrc ? (
//             <img src={photoSrc} alt="Profile" className="photo-img" />
//           ) : (
//             <div className="photo-fallback" />

//           )}
//           <img src={Image} alt="Profile" className="photo-img" />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { db, storage } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

import "./Header.css";
import Logo from "../assets/logo.jpg";
import Image from "../assets/image.jpeg";

export default function Header() {
  const [config, setConfig] = useState(null);
  const [logoSrc, setLogoSrc] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHeader() {
      try {
        // Public Firestore read
        const snap = await getDoc(doc(db, "siteConfig", "header"));
        if (!snap.exists()) throw new Error("Header config not found");
        const data = snap.data();

        // Resolve Storage URLs: supports gs:// and https
        const resolveUrl = async (url) => {
          if (!url) return null;
          // Firebase v9's ref(storage, url) supports both gs:// and https download URLs
          const storageRef = ref(storage, url);
          return await getDownloadURL(storageRef);
        };

        const [logo, photo] = await Promise.all([
          resolveUrl(data.logoUrl),
          resolveUrl(data.photoUrl),
        ]);

        if (!isMounted) return;

        setConfig(data);
        setLogoSrc(logo || null);
        setPhotoSrc(photo || null);
        setErrMsg(null);
      } catch (err) {
        console.error("Header load error:", err);
        if (!isMounted) return;

        // Keep UI functional with safe defaults and local fallbacks
        setConfig({
          bgColor: "#0A2A67",
          accentColor: "#F3A11C",
          bottomBorderColor: "#E6E6E6",
          height: 200,
          paddingX: 16,
        });
        setLogoSrc(null); // will show local Logo fallback in render
        setPhotoSrc(null); // will show local Image fallback in render
        setErrMsg(err.message || "Header load failed");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHeader();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="header-bar skeleton">
        <div className="header-inner container">
          <div className="logo-box shimmer" />
          <div className="photo-box shimmer" />
        </div>
      </div>
    );
  }

  const bgColor = config?.bgColor || "#0A2A67";
  const accentColor = config?.accentColor || "#F3A11C";
  const bottomBorderColor = config?.bottomBorderColor || "#E6E6E6";
  const height = config?.height || 200;
  const paddingX = config?.paddingX ?? 16;

  return (
    <div
      className="header-bar"
      style={{
        backgroundColor: bgColor,
        borderBottom: `2px solid ${bottomBorderColor}`,
        minHeight: height,
      }}
    >
      <div
        className="header-inner container"
        style={{ paddingLeft: paddingX, paddingRight: paddingX }}
      >
        {/* Left: logo block */}
        <div className="" style={{ backgroundColor: accentColor }}>
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="logo-img" />
          ) : (
            <div className="">
              <img src={Logo} alt="Logo" style={{ height: "120px" }} />
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-spacer" />

        {/* Right: square photo */}
        <div className="photo-box">
          {photoSrc ? (
            <img src={photoSrc} alt="Profile" className="photo-img" />
          ) : (
            // Local fallback only if dynamic photo is missing/failed
            <img src={Image} alt="Profile" className="photo-img" />
          )}
        </div>
      </div>

      {/* Optional: small debug text; remove in production if you prefer */}
      {/* {errMsg && (
        <div className="container">
          <small className="text-warning">{errMsg}</small>
        </div>
      )} */}
    </div>
  );
}
