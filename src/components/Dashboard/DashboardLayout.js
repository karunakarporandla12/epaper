import React, { useState } from 'react';
import Sidebar from '../DashboardItems/Sidebar';
import UserDashboard from './UserDashboard';
import PublishEdition from '../DashboardItems/PublishEdition';
import './DashboardLayout.css';
import ManageEditions from '../DashboardItems/ManageEditions';

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
      case 'manage-editions':
        return <ManageEditions />;
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
