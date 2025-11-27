
// // // import React, { useState } from 'react';
// // // import Sidebar from '../components/Dashboard/Sidebar';
// // // // import UserDashboard from '../pages/UserDashboard';
// // // import PublishEdition from '../components/Dashboard/PublishEdition';

// // // function DashboardLayout() {
// // //   const [activePage, setActivePage] = useState('dashboard');

// // //   return (
// // //     <div className="dashboard-layout">
// // //       <Sidebar onMenuClick={setActivePage} />
// // //       <div className="main-content">
// // //         {/* {activePage === 'dashboard' && <UserDashboard />} */}
// // //         {activePage === 'publish-edition' && <PublishEdition />}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default DashboardLayout;



// // import React, { useState } from 'react';
// // import Sidebar from '../DashboardItems/Sidebar';
// // import UserDashboard from './UserDashboard';
// // import PublishEdition from '../DashboardItems/PublishEdition';
// // // import ManageEditions from '../components/Dashboard/ManageEditions'; // Example for another page
// // import './DashboardLayout.css';

// // function DashboardLayout() {
// //   const [activePage, setActivePage] = useState('dashboard'); // Default page

// //   const renderContent = () => {
// //     switch (activePage) {
// //       case 'user-dashboard':
// //         return <UserDashboard />;
// //       case 'publish-edition':
// //         return <PublishEdition />;
// //     //   case 'manage-editions':
// //         // return <ManageEditions />;
// //       default:
// //         return <UserDashboard />;
// //     }
// //   };

// //   return (
// //     <div className="dashboard-layout">
// //       <Sidebar onMenuClick={setActivePage} />
// //       <div className="main-content">{renderContent()}</div>
// //     </div>
// //   );
// // }

// // export default DashboardLayout;


// import React, { useState } from 'react';
// import Sidebar from '../DashboardItems/Sidebar';
// import UserDashboard from './UserDashboard';
// import PublishEdition from '../DashboardItems/PublishEdition';
// import './DashboardLayout.css';

// function DashboardLayout() {
//   const [activePage, setActivePage] = useState('dashboard'); // Default page

//   const renderContent = () => {
//     switch (activePage) {
//       case 'dashboard':
//         return <UserDashboard />;
//       case 'publish-edition':
//         return <PublishEdition />;
//       default:
//         return <UserDashboard />;
//     }
//   };

//   return (
//     <div className="dashboard-layout">
//       <Sidebar onMenuClick={setActivePage} />
//       <h1>hi</h1>
//       <div className="main-content">{renderContent()}</div>
//     </div>
//   );
// }

// export default DashboardLayout;



import React, { useState } from 'react';
import Sidebar from '../DashboardItems/Sidebar';
import UserDashboard from './UserDashboard';
import PublishEdition from '../DashboardItems/PublishEdition';
import './DashboardLayout.css';

function DashboardLayout() {
  // State to track which page is active
  const [activePage, setActivePage] = useState('dashboard');

  // Function to render the right-side content based on activePage
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <UserDashboard />;
      case 'publish-edition':
        return <PublishEdition />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Pass setActivePage as onMenuClick */}
      <Sidebar onMenuClick={setActivePage} activePage={activePage} />
      <div className="main-content">{renderContent()}</div>
    </div>
  );
}

export default DashboardLayout;
