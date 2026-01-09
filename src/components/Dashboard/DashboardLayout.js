// import React, { useState } from 'react';
// import Sidebar from '../DashboardItems/Sidebar';
// import UserDashboard from './UserDashboard';
// import PublishEdition from '../DashboardItems/PublishEdition';
// import './DashboardLayout.css';
// import ManageEditions from '../DashboardItems/ManageEditions';
// import EpaperSettings from '../DashboardItems/EpaperSettings';

// function DashboardLayout() {
//   // State to track which page is active
//   const [activePage, setActivePage] = useState('dashboard');

//   // Function to render the right-side content based on activePage 
//   const renderContent = () => {
//     switch (activePage) {
//       case 'dashboard':
//         return <UserDashboard />;
//       case 'publish-edition':
//         return <PublishEdition />;
//       case 'manage-editions':
//         return <ManageEditions />;
//         case 'epaper-setting':
//         return <EpaperSettings />;
//       default:
//         return <UserDashboard />;
//     }
//   };

//   return (
//     <div className="dashboard-layout">
//       {/* Pass setActivePage as onMenuClick */}
//       <Sidebar onMenuClick={setActivePage} activePage={activePage} />
//       <div className="main-content">{renderContent()}</div>
//     </div>
//   );
// }

// export default DashboardLayout;


// src/DashboardLayout/DashboardLayout.jsx
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase'; // adjust path if needed
import Sidebar from '../DashboardItems/Sidebar';
import UserDashboard from './UserDashboard';
import PublishEdition from '../DashboardItems/PublishEdition';
import ManageEditions from '../DashboardItems/ManageEditions';
import EpaperSettings from '../DashboardItems/EpaperSettings';
import './DashboardLayout.css';

function DashboardLayout() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <UserDashboard />;
      case 'publish-edition':
        return <PublishEdition />;
      case 'manage-editions':
        return <ManageEditions />;
      case 'epaper-setting':
        return <EpaperSettings />;
      default:
        return <UserDashboard />;
    }
  };

  const handleLogout = async () => {
    // ✅ Confirmation prompt before logging out
    const ok = window.confirm('Are you sure you want to log out?');
    if (!ok) return;

    try {
      await signOut(auth);               // Firebase: sign out current user
      sessionStorage.clear();            // optional: clear any session state
      // localStorage.removeItem('access_token'); // if you store custom tokens
      // Redirect to Home page
      window.location.assign('/');       // safe regardless of router
      // If you're using react-router v6, you could use useNavigate instead:
      // navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      // Fallback redirect to Home even if signOut throws
      window.location.assign('/');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onMenuClick={setActivePage}
        activePage={activePage}
        onLogout={handleLogout}   // 👈 pass the handler here
      />
      <div className="main-content">{renderContent()}</div>
    </div>
  );
}

export default DashboardLayout;
