// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import SocialShareButtons from '../components/share/SocialShareButtons';
// import Header from './Header';
// import PdfImageViewer from '../components/PdfToImageViewer';

// function View() {
//     return

//     <div>
//         <div>
//             {/* <Header/>
//             <PdfImageViewer/>
//             <SocialShareButtons/> */}
//             {/* <footer */}
//             <h1>Hello</h1>
//         </div>
//     </div>

// }
// export default View()

// View.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Header from "./Header";
import PdfImageViewer from "../components/PdfToImageViewer";
import SocialShareButtons from "../components/share/SocialShareButtons";
import Footer from "./Footer";

const PUBLISHER_UID =
  process.env.REACT_APP_PUBLISHER_UID ||
  import.meta?.env?.VITE_PUBLISHER_UID ||
  null;

function View() {
  return (
    <>
      <Header />
      {/* <PdfImageViewer /> */}
      <PdfImageViewer initialUid={PUBLISHER_UID} />
      <SocialShareButtons />
      <Footer />
    </>
  );
}

export default View;
