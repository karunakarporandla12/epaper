
// // UserDashboard.js
// import React, {useState} from 'react';
// import { signOut } from 'firebase/auth';
// import { auth } from '../../firebase';
// import { useAuth } from '../../contexts/AuthContext';
// import Sidebar from '../DashboardItems/Sidebar';
// import './DashboardLayout.css';
// import DashboardLayout from './DashboardLayout';

// function UserDashboard() {
//   const { currentUser } = useAuth();
//   return (
//     <div className="dashboard-layout">
           
//       <div className="main-content">
//         <h2>Welcome11, {currentUser?.displayName || currentUser?.email}</h2>
//         {/* <button onClick={() => signOut(auth)}>Logout</button> */}
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;
// UserDashboard.jsx
import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function percentage(part, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

// tiny sparkline generator (returns path d)
function sparklinePath(values, width = 220, height = 48, padding = 6) {
  if (!values || values.length === 0) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const len = values.length;
  const xStep = (width - padding * 2) / Math.max(1, len - 1);
  const scaleY = (val) => {
    if (max === min) return height / 2;
    return padding + ((max - val) / (max - min)) * (height - padding * 2);
  };

  return values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${scaleY(v)}`)
    .join(' ');
}

export default function UserDashboard() {
  const { currentUser } = useAuth();

  // ----- Replace this with real data from Firestore / Storage -----
  // Example uploaded files array, sizes in bytes
  const uploadedFiles = useMemo(
    () => [
      { name: 'page_1.jpg', size: 120_000 },
      { name: 'page_2.jpg', size: 95_000 },
      { name: 'cover.png', size: 250_000 },
      // add more files here...
    ],
    []
  );

  const totalStorageBytes = 10 * 1024 * 1024 * 1024; // 10 GB total (example)
  const usedBytes = uploadedFiles.reduce((s, f) => s + (f.size || 0), 0);
  const freeBytes = Math.max(0, totalStorageBytes - usedBytes);
  const usedPct = percentage(usedBytes, totalStorageBytes);

  // small analytics sample (replace with real metrics)
  const analytics = {
    totalEdition: 1,
    editionCategory: 1,
    thisMonthVisitors: 0,
    lastMonthVisitors: 0,
    allowedVisitors: 300000,
    visitorsThisMonth: 0,
    totalViewsSeries: [0, 0, 0, 0, 0, 0, 1], // sparkline sample
  };

  // license expiry example (replace from DB if available)
  const licenseExpiryDate = new Date('2025-12-08T00:00:00'); // mm/dd/yyyy or ISO
  const licenseExpiryStr = licenseExpiryDate.toLocaleDateString();

  // last login sample - replace with your auth value or store field
  const lastLoginStr = '01/12/2025 10:06AM';

  return (
    <div className="container-fluid dashboard-root p-3">
      {/* License alert */}
      <div className="alert alert-warning border rounded mb-3" role="alert">
        <strong>⚠ License Expiry Alert</strong>
        <div className="small mt-1">
          Your license will expire on <b>{licenseExpiryStr}</b>. Renew now!
        </div>
      </div>

      <div className="row g-3">
        {/* Hero / Welcome */}
        <div className="col-12 col-lg-8">
          <div className="card hero-card h-100">
            <div className="card-body d-flex gap-3">
              <div className="hero-left flex-grow-1 text-white p-3">
                <div className="small text-light-opacity">☀ Good Afternoon</div>
                <h3 className="mb-1">Welcome Back!</h3>
                <h5 className="fw-bold">Epaperdesk Demo</h5>
                <div className="mt-3 small text-light-opacity">
                  <i className="bi bi-clock"></i> Last login: {lastLoginStr}
                </div>
              </div>

              <div className="hero-illustration d-none d-md-flex align-items-center justify-content-center">
                {/* small inline svg illustration placeholder */}
                <svg width="160" height="120" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
                  <rect rx="8" width="160" height="120" fill="#ffffff10" />
                  <g transform="translate(12,10)">
                    <rect width="60" height="60" rx="6" fill="#fff" opacity="0.25" />
                    <rect x="70" y="10" width="60" height="40" rx="6" fill="#fff" opacity="0.18" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="col-12 col-lg-4">
          <div className="row g-3">
            <div className="col-6 col-sm-6 col-md-6 col-lg-12">
              <div className="card metric-card metric-blue">
                <div className="card-body">
                  <div className="metric-title">Total Edition</div>
                  <div className="metric-value">{analytics.totalEdition}</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-6 col-md-6 col-lg-12">
              <div className="card metric-card metric-pink">
                <div className="card-body">
                  <div className="metric-title">Edition Category</div>
                  <div className="metric-value">{analytics.editionCategory}</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-6 col-md-6 col-lg-12">
              <div className="card metric-card metric-green">
                <div className="card-body">
                  <div className="metric-title">This Month Total Visitors</div>
                  <div className="metric-value">{analytics.thisMonthVisitors}</div>
                </div>
              </div>
            </div>

            <div className="col-6 col-sm-6 col-md-6 col-lg-12">
              <div className="card metric-card metric-orange">
                <div className="card-body">
                  <div className="metric-title">Last Month Total Visitors</div>
                  <div className="metric-value">{analytics.lastMonthVisitors}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower row: storage, analytics, schedule */}
        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Storage Status</h6>
              <div className="d-flex gap-3 align-items-center">
                {/* Donut chart (SVG) */}
                <div className="donut-wrapper">
                  <svg width="120" height="120" viewBox="0 0 42 42" className="donut">
                    <circle r="15.9155" cx="21" cy="21" className="donut-ring" />
                    <circle
                      r="15.9155"
                      cx="21"
                      cy="21"
                      className="donut-segment"
                      strokeDasharray={`${usedPct} ${100 - usedPct}`}
                      transform="rotate(-90 21 21)"
                    />
                    <text x="21" y="22.5" className="donut-text" textAnchor="middle">
                      {usedPct}%
                    </text>
                  </svg>
                </div>

                <div className="flex-grow-1">
                  <div className="small mb-2 text-muted">
                    <span className="legend used-legend"></span> Used Storage
                  </div>
                  <div className="small mb-2 text-muted">
                    <span className="legend free-legend"></span> Free Storage
                  </div>

                  <div className="mt-3">
                    <div className="small">Total Space: <b>{formatBytes(totalStorageBytes)}</b></div>
                    <div className="small">Used Space: <b>{formatBytes(usedBytes)}</b></div>
                    <div className="small">Free Space: <b>{formatBytes(freeBytes)}</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body">
              <h6 className="card-title mb-3">Analytics</h6>

              <div className="mb-3">
                <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="none" className="sparkline">
                  <path d={sparklinePath(analytics.totalViewsSeries, 220, 60)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div>
                  <div className="small text-muted">Allowed Visitors</div>
                  <div className="fw-bold">{analytics.allowedVisitors.toLocaleString()}</div>
                </div>
                <div>
                  <div className="small text-muted">Visitors this Month</div>
                  <div className="fw-bold">{analytics.visitorsThisMonth}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <h6 className="card-title">Schedule</h6>
              <div className="schedule-illustration my-3">
                {/* simple sleepy fox svg */}
                <svg width="140" height="120" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fillRule="evenodd">
                    <ellipse cx="100" cy="120" rx="70" ry="12" fill="#f3f4f6" />
                    <path d="M40 85c0-18 26-54 70-54 44 0 70 36 70 54 0 22-26 55-70 55-44 0-70-33-70-55z" fill="#f97316" />
                    <circle cx="75" cy="72" r="6" fill="#fff"/>
                  </g>
                </svg>
              </div>
              <div className="text-muted small">No schedule available</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

