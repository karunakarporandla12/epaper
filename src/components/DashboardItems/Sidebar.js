
// // Sidebar.js
// import React from 'react';
// import './Sidebar.css';
// import { Link } from 'react-router-dom';

// const menuItems = [
//   { section: 'DASHBOARD', items: [{ label: 'Dashboard', icon: '📊' }] },
//   {
//     section: 'EPAPER MANAGEMENT',
//     items: [
//       { label: 'Publish Edition', icon: '📰', link: 'publish-edition'},
//       { label: 'Manage Editions', icon: '📂', active: true },
//     ],
//   },
//   {
//     section: 'EPAPER SETTING',
//     items: [
//       { label: 'Edition Category', icon: '⚙️' },
//       { label: 'Epaper Setting', icon: '🔧' },
//       { label: 'Theme Setup', icon: '🎨' },
//       { label: 'Page Manage', icon: '📄' },
//     ],
//   },
//   {
//     section: 'SUBSCRIPTION SETUP',
//     items: [
//       { label: 'Subscribed Users', icon: '👥' },
//       { label: 'Transactions', icon: '💳' },
//       { label: 'Primary Setup', icon: '🔑' },
//     ],
//   },
//   {
//     section: 'AD MANAGER',
//     items: [{ label: 'Manage', icon: '📢' }],
//   },
//   {
//     section: 'ADMINISTRATOR',
//     items: [
//       { label: 'Change Password', icon: '🔒' },
//       { label: 'User Management', icon: '👤' },
//     ],
//   },
//   {
//     section: 'DEVELOPER',
//     items: [{ label: 'API', icon: '🔗' }],
//   },
// ];

// function Sidebar({onMenuClick }) {
//   return (
//     <div className="sidebar">

        




//       <input type="text" placeholder="Search menu" className="search-box" />
//       {menuItems.map((menu, idx) => (
//         <div key={idx} className="menu-section">
//           <h4>{menu.section}</h4>
//           {menu.items.map((item, i) => (
//             <div
//               key={i}
//               className={`menu-item ${item.active ? 'active' : ''}`}
              
// // className="menu-item"
//               onClick={() => onMenuClick(item.key)}
//               // style={{ cursor: 'pointer' }}

//             >
//               <span className="icon">{item.icon}</span>
//               <span className="label">{item.label}</span>
//               <span className="arrow">›</span>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Sidebar;



import React from 'react';
import './Sidebar.css';

const menuItems = [
  { section: 'DASHBOARD', items: [{ label: 'Dashboard', icon: '📊', key: 'dashboard' }] },
  {
    section: 'EPAPER MANAGEMENT',
    items: [
      { label: 'Publish Edition', icon: '📰', key: 'publish-edition' },
      { label: 'Manage Editions', icon: '📂', key: 'manage-editions' },
    ],
  },
    {
    section: 'EPAPER SETTING',
    items: [
      { label: 'Edition Category', icon: '⚙️', key: 'edition-category' },
      { label: 'Epaper Setting', icon: '🔧', key: 'epaper-setting' },
      { label: 'Theme Setup', icon: '🎨', key: 'theme-setting' },
      { label: 'Page Manage', icon: '📄', key: 'page-manage' },
    ],
  },
  {
    section: 'SUBSCRIPTION SETUP',
    items: [
      { label: 'Subscribed Users', icon: '👥', key: 'subscribe' },
      { label: 'Transactions', icon: '💳', key: 'transaction' },
      { label: 'Primary Setup', icon: '🔑', key: 'primary-setup' },
    ],
  },
  {
    section: 'AD MANAGER',
    items: [{ label: 'Manage', icon: '📢', key: 'ad-manager'
     }],
  },
  {
    section: 'ADMINISTRATOR',
    items: [
      { label: 'Change Password', icon: '🔒', key:'change-passwword' },
      { label: 'User Management', icon: '👤', key: 'user-management' },
    ],
  },
  {
    section: 'DEVELOPER',
    items: [{ label: 'API', icon: '🔗' , key: 'developers' }],
  },
];

function Sidebar({ onMenuClick, activePage }) {
  return (
    <div className="sidebar">
      <input type="text" placeholder="Search menu" className="search-box" />
      {menuItems.map((menu, idx) => (
        <div key={idx} className="menu-section">
          <h4>{menu.section}</h4>
          {menu.items.map((item, i) => (
            <div
              key={i}
              className={`menu-item ${activePage === item.key ? 'active' : ''}`}
              onClick={() => onMenuClick(item.key)} // ✅ This triggers state change
              style={{ cursor: 'pointer' }}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
              <span className="arrow">›</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
