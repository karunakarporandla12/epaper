// import React, { useEffect, useState } from 'react';
// import SocialIcons from './SocialIcons';
// import './CropModal.css';

// const CropModal = ({ image, title, setTitle, onClose }) => {
//   const [zoom, setZoom] = useState(1);
//   const [successMsg, setSuccessMsg] = useState('');

//   // ESC key closes modal
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   const downloadImage = () => {
//     const link = document.createElement('a');
//     link.href = image;
//     link.download = (title?.trim() || 'cropped_image') + '.png';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setSuccessMsg('✅ Image downloaded successfully!');
//     setTimeout(() => setSuccessMsg(''), 3000);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="close-btn" onClick={onClose}>✖</button>
//         <div className="image-container">
//           <img
//             src={image}
//             alt="Cropped Preview"
//             className="modal-image"
//             style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
//           />
//         </div>
//         <div className="zoom-controls">
//           <label>Zoom: {Math.round(zoom * 100)}%</label>
//           <input
//             type="range"
//             min="1"
//             max="3"
//             step="0.1"
//             value={zoom}
//             onChange={(e) => setZoom(Number(e.target.value))}
//           />
//         </div>
//         {/* <div className="  "> */}
//           <div className='d-flex flex-row gap-3'>
//             <SocialIcons />
//           <button className="download-btn" onClick={downloadImage}>
//             Download Cropped Image
//           </button>
//           </div>
//         {/* </div> */}
//         {successMsg && <div className="success-msg">{successMsg}</div>}
//       </div>
//     </div>
//   );
// };

// export default CropModal;

import React, { useEffect, useState } from 'react';
import SocialShareButtons from './share/SocialShareButtons'; // ✅ Updated import
import './CropModal.css';

const CropModal = ({ image, title, setTitle, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = (title?.trim() || 'cropped_image') + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg('✅ Image downloaded successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="image-container">
          <img
            src={image}
            alt="Cropped Preview"
            className="modal-image"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          />
        </div>

        <div className="zoom-controls">
          <label>Zoom: {Math.round(zoom * 100)}%</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        {/* ✅ Updated Section */}
        <div className="d-flex flex-row gap-3 align-items-center">
          <SocialShareButtons url={image} text={title} /> {/* NEW MULTI ICONS */}
          <button className="download-btn" onClick={downloadImage}>
            Download
          </button>
        </div>

        {successMsg && <div className="success-msg">{successMsg}</div>}
      </div>
    </div>
  );
};

export default CropModal;


