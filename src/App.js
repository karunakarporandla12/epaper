// // // // import logo from './logo.svg';
// // // // import './App.css';
// // // // import PdfToImageViewer from './components/PdfToImageViewer';

// // // // function App() {
// // // //   return (
// // // //     <div className="App">
// // // //        <PdfToImageViewer />
// // // //        <Router>

// // // //        </Router>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default App;


// // // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // // import AuthProvider, { useAuth } from './contexts/AuthContext';
// // // import Login from './pages/Login';
// // // import Register from './pages/Register';
// // // // import Dashboard from './components/Dashboard/UserDashboard';
// // // import PdfImageViewer from './components/PdfToImageViewer'
// // // // import UserDashboard from './components/Dashboard/UserDashboard';
// // // import PublishEdition from './components/DashboardItems/PublishEdition';
// // // import DashboardLayout from './components/Dashboard/DashboardLayout';
// // // import ManageEditions from './components/DashboardItems/ManageEditions';
// // // import About from './pages/About';
// // // import ContactUs from './pages/ContactUs';
// // // import Contact from './pages/Contact';
// // // import Home from './pages/Home';
// // // import Navbar from './components/Navbar';
// // // import EpaperSettings from './components/DashboardItems/EpaperSettings';
// // // import BasicSetup from './pages/settings/BasicSetup';
// // // import View from './pages/View';
// // // import Home1 from './pages/Home1'
// // // import EditionViewerPage from './pages/EditionViewerPage.jsx';

// // // function ProtectedRoute({ children }) {
// // //   const { currentUser } = useAuth();
// // //   return currentUser ? children : <Navigate to="/login" replace />;
// // // }

// // // export default function App() {
// // //   return (

// // //     <AuthProvider>
// // //       <BrowserRouter>
// // //         {/* <Navbar /> */}
// // //         <Routes>
// // //           <Route path="/content" element={<PdfImageViewer />} />
// // //           <Route path="/" element={<Home1 />} />
// // //           <Route path="/home" element={<Home />} />
// // //           <Route path="/about" element={<About />} />
// // //           <Route path="/contact-us" element={<ContactUs />} />
// // //           <Route path="/contact" element={<Contact />} />



// // //           <Route path="/login" element={<Login />} />
// // //           <Route path="/register" element={<Register />} />
// // //           <Route
// // //             path="/dashboard"
// // //             element={
// // //               <ProtectedRoute>
// // //                 {/* <UserDashboard /> */}
// // //                 <DashboardLayout />
// // //               </ProtectedRoute>
// // //             }
// // //           />
// // //           {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}

// // //           <Route path="/publish" element={<PublishEdition />} />
// // //           <Route path="/manage" element={<ManageEditions />} />
// // //           <Route path="/epaper-setting" element={<EpaperSettings />} />
// // //           <Route path="/viewer/:uid/:editionId" element={<EditionViewerPage />} />
// // //           <Route path="/view" element={<View />} />




// // //           {/* setting */}
// // //           <Route path="/basic-setting" element={<BasicSetup />} />




// // //           {/* <Route path="/" element={<DashboardLayout />}></Route> */}
// // //         </Routes>
// // //       </BrowserRouter>
// // //     </AuthProvider>
// // //   );
// // // }


// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import AuthProvider, { useAuth } from './contexts/AuthContext';

// // // Pages & components
// // import Login from './pages/Login';
// // import Register from './pages/Register';
// // import PdfImageViewer from './components/PdfToImageViewer';
// // import PublishEdition from './components/DashboardItems/PublishEdition';
// // import DashboardLayout from './components/Dashboard/DashboardLayout';
// // import ManageEditions from './components/DashboardItems/ManageEditions';
// // import About from './pages/About';
// // import ContactUs from './pages/ContactUs';
// // import Contact from './pages/Contact';
// // import Home from './pages/Home';
// // import Home1 from './pages/Home1';
// // import EpaperSettings from './components/DashboardItems/EpaperSettings';
// // import BasicSetup from './pages/settings/BasicSetup';
// // import View from './pages/View';
// // import EditionViewerPage from './pages/EditionViewerPage.jsx';

// // function ProtectedRoute({ children }) {
// //   const { currentUser } = useAuth();
// //   return currentUser ? children : <Navigate to="/login" replace />;
// // }

// // export default function App() {
// //   return (
// //     <AuthProvider>
// //       <BrowserRouter>
// //         <Routes>
// //           {/* Public routes */}
// //           <Route path="/" element={<Home1 />} />
// //           <Route path="/home" element={<Home />} />
// //           <Route path="/about" element={<About />} />
// //           <Route path="/contact-us" element={<ContactUs />} />
// //           <Route path="/contact" element={<Contact />} />

// //           {/* Auth routes */}
// //           <Route path="/login" element={<Login />} />
// //           <Route path="/register" element={<Register />} />

// //           {/* Dashboard (protected) */}
// //           <Route
// //             path="/dashboard"
// //             element={
// //               <ProtectedRoute>
// //                 <DashboardLayout />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* Epaper admin routes */}
// //           <Route path="/publish" element={<PublishEdition />} />
// //           <Route path="/manage" element={<ManageEditions />} />
// //           <Route path="/epaper-setting" element={<EpaperSettings />} />
// //           <Route path="/basic-setting" element={<BasicSetup />} />

// //           {/* Viewer routes */}
// //           {/* A generic content route (if you still want the archive-only viewer) */}
// //           <Route path="/content" element={<PdfImageViewer />} />
// //           {/* Doc-mode route: opens a specific edition */}
// //           <Route path="/viewer/:uid/:editionId" element={<EditionViewerPage />} />

// //           {/* Legacy or additional view page */}
// //           <Route path="/view" element={<View />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </AuthProvider>
// //   );
// // }


// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import AuthProvider, { useAuth } from './contexts/AuthContext';

// import Login from './pages/Login';
// import Register from './pages/Register';
// import PdfImageViewer from './components/PdfToImageViewer.js'; // optional: archive-only viewer
// import PublishEdition from './components/DashboardItems/PublishEdition';
// import DashboardLayout from './components/Dashboard/DashboardLayout';
// import ManageEditions from './components/DashboardItems/ManageEditions';
// import About from './pages/About';
// import ContactUs from './pages/ContactUs';
// import Contact from './pages/Contact';
// import Home from './pages/Home';
// import Home1 from './pages/Home1';
// import EpaperSettings from './components/DashboardItems/EpaperSettings';
// import BasicSetup from './pages/settings/BasicSetup';
// import View from './pages/View';
// import EditionViewerPage from './pages/EditionViewerPage.jsx';

// function ProtectedRoute({ children }) {
//   const { currentUser } = useAuth();
//   return currentUser ? children : <Navigate to="/login" replace />;
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Home1 />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact-us" element={<ContactUs />} />
//           <Route path="/contact" element={<Contact />} />

//           {/* Auth */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Dashboard */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <DashboardLayout />
//               </ProtectedRoute>
//             }
//           />

//           {/* Admin */}
//           <Route path="/publish" element={<PublishEdition />} />
//           <Route path="/manage" element={<ManageEditions />} />
//           <Route path="/epaper-setting" element={<EpaperSettings />} />
//           <Route path="/basic-setting" element={<BasicSetup />} />

//           {/* Doc-mode viewer */}
//           <Route path="/viewer/:uid/:editionId" element={<EditionViewerPage />} />

//           {/* Optional legacy / archive viewer */}
//           <Route path="/content" element={<PdfImageViewer initialEdition={null} />} />
//           {/* <Route path="/view" element={<View />} /> */}

//           <Route path="/viewer/:uid/:date/:base" element={
//             <PdfImageViewer />
//           } />

//           <Route path="/content" element={<PdfImageViewer initialUid="u123" />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './contexts/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import PublishEdition from './components/DashboardItems/PublishEdition';
import ManageEditions from './components/DashboardItems/ManageEditions';
import EpaperSettings from './components/DashboardItems/EpaperSettings';
import BasicSetup from './pages/settings/BasicSetup';

import Home from './pages/Home';
import Home1 from './pages/Home1';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Contact from './pages/Contact';
import View from './pages/View';
import EditionViewerPage from './pages/EditionViewerPage';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home1 />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/contact" element={<Contact />} />

          {/* Public viewer (anonymous allowed) */}
          <Route path="/view" element={<View />} />
          {/* Optional deep-link viewer */}
          <Route path="/viewer/:uid/:date?/:base?" element={<EditionViewerPage />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />

          {/* Admin tools (choose to protect or not) */}
          <Route path="/publish" element={<PublishEdition />} />
          <Route path="/manage" element={<ManageEditions />} />
          <Route path="/epaper-setting" element={<EpaperSettings />} />
          <Route path="/basic-setting" element={<BasicSetup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
