// import logo from './logo.svg';
// import './App.css';
// import PdfToImageViewer from './components/PdfToImageViewer';

// function App() {
//   return (
//     <div className="App">
//        <PdfToImageViewer />
//        <Router>
        
//        </Router>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard/UserDashboard';
import PdfImageViewer from './components/PdfToImageViewer'
import UserDashboard from './components/Dashboard/UserDashboard';
import PublishEdition from './components/DashboardItems/PublishEdition';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ManageEditions from './components/DashboardItems/ManageEditions';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {/* <UserDashboard /> */}
                <DashboardLayout/>
              </ProtectedRoute>
            }
          />
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
           <Route path="/view" element = {<PdfImageViewer/>}/>
           <Route path="/publish-edition" element = {<PublishEdition/>}/>
            <Route path="/manage-editions" element = {<ManageEditions/>}/>


 <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/contact" element={<Contact />} />



           
           {/* <Route path="/" element={<DashboardLayout />}></Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
