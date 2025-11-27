
// UserDashboard.js
import React, {useState} from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../DashboardItems/Sidebar';
import './DashboardLayout.css';
import DashboardLayout from './DashboardLayout';

function UserDashboard() {
  const { currentUser } = useAuth();
  return (
    <div className="dashboard-layout">
           
      <div className="main-content">
        <h2>Welcome11, {currentUser?.displayName || currentUser?.email}</h2>
        {/* <button onClick={() => signOut(auth)}>Logout</button> */}
      </div>
    </div>
  );
}

export default UserDashboard;
