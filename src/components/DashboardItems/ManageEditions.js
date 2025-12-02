
// // import React, { useEffect, useState } from 'react';
// // import { useAuth } from '../../contexts/AuthContext';
// // import { db } from '../../firebase';
// // import { collection, getDocs } from 'firebase/firestore';
// // import 'bootstrap/dist/css/bootstrap.min.css';

// // function ManageEditions() {
// //   const { currentUser } = useAuth();
// //   const [editions, setEditions] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchEditions = async () => {
// //       if (!currentUser?.uid) return;
// //       try {
// //         const colRef = collection(db, 'editions', currentUser.uid, 'items');
// //         const snapshot = await getDocs(colRef);
// //         const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //         setEditions(data);
// //       } catch (err) {
// //         console.error('Error fetching editions:', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchEditions();
// //   }, [currentUser]);

// //   if (loading) return <div className="text-center p-4">Loading editions...</div>;

// //   return (
// //     <div className="container-fluid p-3">
// //       <div className="card shadow-sm">
// //         <div className="card-body">
// //           <h6 className="mb-4">
// //             <span className="me-2">📤</span> MANAGE EDITION
// //           </h6>

// //           <div className="table-responsive">
// //             <table className="table table-bordered align-middle">
// //               <thead className="table-light">
// //                 <tr>
// //                   <th>SL.NO</th>
// //                   <th>EDITION</th>
// //                   <th>DATE</th>
// //                   <th>STATUS</th>
// //                   <th>SCHEDULE</th>
// //                   <th>SEND NOTIFICATION</th>
// //                   <th>ACTION</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {editions.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="7" className="text-center">
// //                       No editions found.
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   editions.map((edition, index) => (
// //                     <tr key={edition.id}>
// //                       <td>{index + 1}</td>
// //                       <td>
// //                         <strong>{edition.editionName}</strong> /{' '}
// //                         <span className="badge bg-warning text-dark">
// //                           {edition.category}
// //                         </span>
// //                         <br />
// //                         <small className="text-muted">
// //                           Published By: @{edition.createdBy?.displayName || 'admin'}
// //                         </small>
// //                       </td>
// //                       <td>
// //                         <span className="me-1">📅</span>
// //                         {edition.editionDateDisplay || 'N/A'}
// //                       </td>
// //                       <td>
// //                         <span className="badge bg-success">
// //                           {edition.status?.toUpperCase() || 'UNKNOWN'}
// //                         </span>
// //                       </td>
// //                       <td>
// //                         <span className="badge bg-secondary">NO</span>
// //                       </td>
// //                       <td>
// //                         <span className="text-warning">⚠ Not Setup/Disabled</span>
// //                       </td>
// //                       <td>
// //                         <div className="dropdown">
// //                           <button
// //                             className="btn btn-primary dropdown-toggle"
// //                             type="button"
// //                             data-bs-toggle="dropdown"
// //                             aria-expanded="false"
// //                           >
// //                             ACTION
// //                           </button>
// //                           <ul className="dropdown-menu">
// //                             <li>
// //                               <button className="dropdown-item">📍 Area Mapping</button>
// //                             </li>
// //                             <li>
// //                               <button className="dropdown-item">🔒 Make Private</button>
// //                             </li>
// //                             <li>
// //                               <button className="dropdown-item">⏰ Schedule</button>
// //                             </li>
// //                             <li>
// //                               <button className="dropdown-item">✏ Edit Info</button>
// //                             </li>
// //                             <li>
// //                               <button className="dropdown-item">📄 Edit Pages</button>
// //                             </li>
// //                           </ul>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination placeholder */}
// //           <div className="d-flex justify-content-center mt-3">
// //             <nav>
// //               <ul className="pagination">
// //                 <li className="page-item active">
// //                   <button className="page-link">1</button>
// //                 </li>
// //               </ul>
// //             </nav>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ManageEditions;

// // // {
// // //   "editionName": "Chowrastah",
// // //   "category": "Main Edition",
// // //   "editionDateDisplay": "27/11/2025",
// // //   "status": "Public",
// // //   "createdBy": {
// // //     "displayName": "admin"
// // //   }
// // // }

// // ManageEditions.jsx
// // ManageEditions.jsx
// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { db } from '../../firebase';
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './ManageEditions.css'; // see CSS below

// function ManageEditions() {
//   const { currentUser } = useAuth();
//   const [editions, setEditions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal state
//   const [activeEdition, setActiveEdition] = useState(null);
//   const [showAreaModal, setShowAreaModal] = useState(false);
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   // Form states
//   const [areasInput, setAreasInput] = useState('');
//   const [scheduleDate, setScheduleDate] = useState('');
//   const [editForm, setEditForm] = useState({ editionName: '', category: '' });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEditions = async () => {
//       if (!currentUser?.uid) return;
//       setLoading(true);
//       try {
//         const colRef = collection(db, 'editions', currentUser.uid, 'items');
//         const snapshot = await getDocs(colRef);
//         const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
//         setEditions(data);
//       } catch (err) {
//         console.error('Error fetching editions:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEditions();
//   }, [currentUser]);

//   // Helper to refresh a single edition from Firestore (or re-fetch all)
//   const refreshEditionList = async () => {
//     if (!currentUser?.uid) return;
//     try {
//       const colRef = collection(db, 'editions', currentUser.uid, 'items');
//       const snapshot = await getDocs(colRef);
//       const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
//       setEditions(data);
//     } catch (err) {
//       console.error('Error refreshing editions:', err);
//     }
//   };

//   // ACTION: Area Mapping
//   const openAreaMapping = (edition) => {
//     setActiveEdition(edition);
//     setAreasInput((edition.areas || []).join(', '));
//     setShowAreaModal(true);
//   };
//   const saveAreaMapping = async () => {
//     if (!currentUser?.uid || !activeEdition) return;
//     try {
//       const docRef = doc(db, 'editions', currentUser.uid, 'items', activeEdition.id);
//       const areasArray = areasInput
//         .split(',')
//         .map((s) => s.trim())
//         .filter(Boolean);
//       await updateDoc(docRef, { areas: areasArray, updatedAt: serverTimestamp() });
//       setShowAreaModal(false);
//       setActiveEdition(null);
//       await refreshEditionList();
//       alert('Area mapping saved.');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save area mapping.');
//     }
//   };

//   // ACTION: Make Private / Toggle
//   const togglePrivate = async (edition) => {
//     if (!currentUser?.uid || !edition) return;
//     try {
//       const docRef = doc(db, 'editions', currentUser.uid, 'items', edition.id);
//       const newStatus = (edition.status || '').toLowerCase() === 'private' ? 'Public' : 'Private';
//       await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
//       await refreshEditionList();
//       alert(`Status changed to ${newStatus}`);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update status.');
//     }
//   };

//   // ACTION: Schedule
//   const openSchedule = (edition) => {
//     setActiveEdition(edition);
//     setScheduleDate(edition.scheduledAt ? new Date(edition.scheduledAt.seconds * 1000).toISOString().slice(0,16) : '');
//     setShowScheduleModal(true);
//   };
//   const saveSchedule = async () => {
//     if (!currentUser?.uid || !activeEdition) return;
//     try {
//       const docRef = doc(db, 'editions', currentUser.uid, 'items', activeEdition.id);
//       let scheduledAtValue = null;
//       if (scheduleDate) {
//         scheduledAtValue = new Date(scheduleDate);
//       }
//       await updateDoc(docRef, {
//         scheduledAt: scheduledAtValue ? scheduledAtValue : null,
//         isScheduled: !!scheduledAtValue,
//         updatedAt: serverTimestamp(),
//       });
//       setShowScheduleModal(false);
//       setActiveEdition(null);
//       await refreshEditionList();
//       alert('Schedule saved.');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to save schedule.');
//     }
//   };

//   // ACTION: Edit Info
//   const openEditInfo = (edition) => {
//     setActiveEdition(edition);
//     setEditForm({
//       editionName: edition.editionName || '',
//       category: edition.category || '',
//     });
//     setShowEditModal(true);
//   };
//   const saveEditInfo = async () => {
//     if (!currentUser?.uid || !activeEdition) return;
//     try {
//       const docRef = doc(db, 'editions', currentUser.uid, 'items', activeEdition.id);
//       await updateDoc(docRef, {
//         editionName: editForm.editionName,
//         category: editForm.category,
//         updatedAt: serverTimestamp(),
//       });
//       setShowEditModal(false);
//       setActiveEdition(null);
//       await refreshEditionList();
//       alert('Edition info updated.');
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update edition info.');
//     }
//   };

//   // ACTION: Edit Pages (navigate)
//   const goToEditPages = (edition) => {
//     if (!edition) return;
//     // adjust route as per your app
//     navigate(`/editions/${edition.id}/pages`, { state: { edition } });
//   };

//   if (loading) return <div className="text-center p-4">Loading editions...</div>;

//   return (
//     <div className="container-fluid p-3">
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <h6 className="mb-4">
//             <span className="me-2">📤</span> MANAGE EDITION
//           </h6>

//           <div className="table-responsive custom-table-responsive">
//             <table className="table table-bordered align-middle">
//               <thead className="table-light">
//                 <tr>
//                   <th>SL.NO</th>
//                   <th>EDITION</th>
//                   <th>DATE</th>
//                   <th>STATUS</th>
//                   <th>SCHEDULE</th>
//                   <th>SEND NOTIFICATION</th>
//                   <th>ACTION</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {editions.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No editions found.
//                     </td>
//                   </tr>
//                 ) : (
//                   editions.map((edition, index) => (
//                     <tr key={edition.id}>
//                       <td>{index + 1}</td>
//                       <td>
//                         <strong>{edition.editionName}</strong> /{' '}
//                         <span className="badge bg-warning text-dark">{edition.category}</span>
//                         <br />
//                         <small className="text-muted">
//                           Published By: @{edition.createdBy?.displayName || 'admin'}
//                         </small>
//                       </td>
//                       <td>
//                         <span className="me-1">📅</span>
//                         {edition.editionDateDisplay || 'N/A'}
//                       </td>
//                       <td>
//                         <span className={`badge ${edition.status === 'Private' ? 'bg-secondary' : 'bg-success'}`}>
//                           {(edition.status || 'UNKNOWN').toUpperCase()}
//                         </span>
//                       </td>
//                       <td>
//                         {edition.isScheduled ? (
//                           <span className="badge bg-info text-dark">
//                             {edition.scheduledAt
//                               ? new Date(edition.scheduledAt.seconds * 1000).toLocaleString()
//                               : 'Scheduled'}
//                           </span>
//                         ) : (
//                           <span className="badge bg-secondary">NO</span>
//                         )}
//                       </td>
//                       <td>
//                         <span className="text-warning">⚠ Not Setup/Disabled</span>
//                       </td>
//                       <td>
//                         <div className="dropdown">
//                           <button
//                             className="btn btn-primary dropdown-toggle"
//                             type="button"
//                             data-bs-toggle="dropdown"
//                             aria-expanded="false"
//                             data-bs-boundary="viewport"
//                           >
//                             ACTION
//                           </button>
//                           <ul className="dropdown-menu">
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => openAreaMapping(edition)}
//                               >
//                                 📍 Area Mapping
//                               </button>
//                             </li>
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => togglePrivate(edition)}
//                               >
//                                 🔒 Make Private
//                               </button>
//                             </li>
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => openSchedule(edition)}
//                               >
//                                 ⏰ Schedule
//                               </button>
//                             </li>
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => openEditInfo(edition)}
//                               >
//                                 ✏ Edit Info
//                               </button>
//                             </li>
//                             <li>
//                               <button
//                                 className="dropdown-item"
//                                 onClick={() => goToEditPages(edition)}
//                               >
//                                 📄 Edit Pages
//                               </button>
//                             </li>
//                           </ul>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination placeholder */}
//           <div className="d-flex justify-content-center mt-3">
//             <nav>
//               <ul className="pagination">
//                 <li className="page-item active">
//                   <button className="page-link">1</button>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Area Mapping Modal */}
//       {showAreaModal && (
//         <div className="modal-backdrop">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Area Mapping - {activeEdition?.editionName}</h5>
//                 <button className="btn-close" onClick={() => setShowAreaModal(false)} />
//               </div>
//               <div className="modal-body">
//                 <label>Enter areas (comma separated):</label>
//                 <textarea
//                   className="form-control"
//                   rows="3"
//                   value={areasInput}
//                   onChange={(e) => setAreasInput(e.target.value)}
//                 />
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setShowAreaModal(false)}>
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary" onClick={saveAreaMapping}>
//                   Save Areas
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Schedule Modal */}
//       {showScheduleModal && (
//         <div className="modal-backdrop">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Schedule Edition - {activeEdition?.editionName}</h5>
//                 <button className="btn-close" onClick={() => setShowScheduleModal(false)} />
//               </div>
//               <div className="modal-body">
//                 <label>Pick date & time:</label>
//                 <input
//                   type="datetime-local"
//                   className="form-control"
//                   value={scheduleDate}
//                   onChange={(e) => setScheduleDate(e.target.value)}
//                 />
//                 <small className="text-muted">Leave blank to clear schedule.</small>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary" onClick={saveSchedule}>
//                   Save Schedule
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Info Modal */}
//       {showEditModal && (
//         <div className="modal-backdrop">
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Edit Info - {activeEdition?.editionName}</h5>
//                 <button className="btn-close" onClick={() => setShowEditModal(false)} />
//               </div>
//               <div className="modal-body">
//                 <div className="mb-2">
//                   <label>Edition Name</label>
//                   <input
//                     className="form-control"
//                     value={editForm.editionName}
//                     onChange={(e) => setEditForm((s) => ({ ...s, editionName: e.target.value }))}
//                   />
//                 </div>
//                 <div>
//                   <label>Category</label>
//                   <input
//                     className="form-control"
//                     value={editForm.category}
//                     onChange={(e) => setEditForm((s) => ({ ...s, category: e.target.value }))}
//                   />
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
//                   Cancel
//                 </button>
//                 <button className="btn btn-primary" onClick={saveEditInfo}>
//                   Save Info
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ManageEditions;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageEditions.css';

function ManageEditions() {
  const { currentUser } = useAuth();
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeEdition, setActiveEdition] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Modal form states
  const [areasInput, setAreasInput] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [editForm, setEditForm] = useState({ editionName: '', category: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEditions = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      try {
        const colRef = collection(db, 'editions', currentUser.uid, 'items');
        const snap = await getDocs(colRef);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setEditions(data);
      } catch (err) {
        console.error('fetchEditions error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEditions();
  }, [currentUser]);

  const refreshEditions = async () => {
    if (!currentUser?.uid) return;
    try {
      const colRef = collection(db, 'editions', currentUser.uid, 'items');
      const snap = await getDocs(colRef);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEditions(data);
    } catch (err) {
      console.error('refreshEditions error:', err);
    }
  };

  // ---------- ACTIONS ----------

  // Open area modal prefilled
  const openAreaMapping = (edition) => {
    setActiveEdition(edition);
    setAreasInput((edition.areas || []).join(', '));
    setShowAreaModal(true);
  };

  const saveAreaMapping = async () => {
    if (!currentUser?.uid || !activeEdition) return;
    try {
      const docRef = doc(db, 'editions', currentUser.uid, 'items', activeEdition.id);
      const areasArray = areasInput.split(',').map((s) => s.trim()).filter(Boolean);
      await updateDoc(docRef, { areas: areasArray, updatedAt: serverTimestamp() });
      setShowAreaModal(false);
      setActiveEdition(null);
      await refreshEditions();
      alert('Area mapping saved.');
    } catch (err) {
      console.error('saveAreaMapping error:', err);
      alert('Failed to save area mapping.');
    }
  };

  // Toggle private/public from dropdown only
  const togglePrivateStatus = async (edition) => {
    if (!currentUser?.uid || !edition) return;
    try {
      const docRef = doc(db, 'editions', currentUser.uid, 'items', edition.id);
      const curr = (edition.status || '').toLowerCase();
      const newStatus = curr === 'private' ? 'Public' : 'Private';
      await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
      await refreshEditions();
      alert(`Status changed to ${newStatus}`);
    } catch (err) {
      console.error('togglePrivateStatus error:', err);
      alert('Failed to update status.');
    }
  };

  // Open schedule modal
  const openSchedule = (edition) => {
    setActiveEdition(edition);
    // if scheduledAt is firestore Timestamp, convert to datetime-local string
    const scheduledAt = edition.scheduledAt;
    if (scheduledAt && scheduledAt.seconds) {
      const dt = new Date(scheduledAt.seconds * 1000);
      setScheduleDate(dt.toISOString().slice(0, 16)); // yyyy-mm-ddThh:mm
    } else {
      setScheduleDate('');
    }
    setShowScheduleModal(true);
  };

  const saveSchedule = async () => {
    if (!currentUser?.uid || !activeEdition) return;
    try {
      const docRef = doc(db, 'editions', currentUser.uid, 'items', activeEdition.id);
      let scheduledVal = null;
      if (scheduleDate) scheduledVal = new Date(scheduleDate);
      await updateDoc(docRef, {
        scheduledAt: scheduledVal ? scheduledVal : null,
        isScheduled: !!scheduledVal,
        updatedAt: serverTimestamp(),
      });
      setShowScheduleModal(false);
      setActiveEdition(null);
      await refreshEditions();
      alert('Schedule saved.');
    } catch (err) {
      console.error('saveSchedule error:', err);
      alert('Failed to save schedule.');
    }
  };

  // Open edit info modal
  const openEditInfo = (edition) => {
    setActiveEdition(edition);
    setEditForm({
      editionName: edition.editionName || '',
      category: edition.category || '',
    });
    setShowEditModal(true);
  };

  const saveEditInfo = async () => {
    if (!currentUser?.uid || !activeEdition) return;
    try {
      const docRef = doc(db, 'editions', currentUser.uid, 'items', activeEdition.id);
      await updateDoc(docRef, {
        editionName: editForm.editionName,
        category: editForm.category,
        updatedAt: serverTimestamp(),
      });
      setShowEditModal(false);
      setActiveEdition(null);
      await refreshEditions();
      alert('Edition info updated.');
    } catch (err) {
      console.error('saveEditInfo error:', err);
      alert('Failed to update edition info.');
    }
  };

  // Navigate to edit pages
  const goToEditPages = (edition) => {
    if (!edition) return;
    navigate(`/editions/${edition.id}/pages`, { state: { edition } });
  };

  // View edition (eye icon)
  const viewEdition = (edition) => {
    if (!edition) return;
    navigate(`/editions/${edition.id}/view`, { state: { edition } });
  };

  // ---------- RENDER ----------

  if (loading) return <div className="text-center p-4">Loading editions...</div>;

  return (
    <div className="container-fluid p-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="mb-4">
            <span className="me-2">📤</span> MANAGE EDITION
          </h6>

          <div className="table-responsive custom-table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>SL.NO</th>
                  <th>EDITION</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>SCHEDULE</th>
                  <th>SEND NOTIFICATION</th>
                  <th>ACTION</th>
                  <th>VIEW</th>
                </tr>
              </thead>
              <tbody>
                {editions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No editions found.</td>
                  </tr>
                ) : (
                  editions.map((edition, idx) => {
                    const isPrivate = (edition.status || '').toLowerCase() === 'private';
                    return (
                      <tr key={edition.id}>
                        <td>{idx + 1}</td>

                        <td>
                          <strong>{edition.editionName}</strong> /{' '}
                          <span className="badge bg-warning text-dark">{edition.category}</span>
                          <br />
                          <small className="text-muted">
                            Published By: @{edition.createdBy?.displayName || 'admin'}
                          </small>
                        </td>

                        <td>
                          <span className="me-1">📅</span>
                          {edition.editionDateDisplay || 'N/A'}
                        </td>

                        <td>
                          <span className={`badge ${isPrivate ? 'bg-secondary' : 'bg-success'}`}>
                            {(edition.status || 'UNKNOWN').toUpperCase()}
                          </span>
                        </td>

                        <td>
                          {edition.isScheduled ? (
                            <span className="badge bg-info text-dark">
                              {edition.scheduledAt
                                ? new Date(edition.scheduledAt.seconds * 1000).toLocaleString()
                                : 'Scheduled'}
                            </span>
                          ) : (
                            <span className="badge bg-secondary">NO</span>
                          )}
                        </td>

                        <td>
                          <span className="text-warning">⚠ Not Setup/Disabled</span>
                        </td>

                        <td className="d-flex align-items-center gap-2">
                          {/* Dropdown - contains Make Private / Make Active toggle */}
                          <div className="dropdown">
                            <button
                              className="btn btn-primary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              data-bs-boundary="viewport"
                            >
                              ACTION
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item" onClick={() => openAreaMapping(edition)}>
                                  📍 Area Mapping
                                </button>
                              </li>

                              <li>
                                {/* Toggle lives in dropdown only */}
                                <button
                                  className="dropdown-item"
                                  onClick={() => togglePrivateStatus(edition)}
                                >
                                  {isPrivate ? '🔓 Make Active / Public' : '🔒 Make Private'}
                                </button>
                              </li>

                              <li>
                                <button className="dropdown-item" onClick={() => openSchedule(edition)}>
                                  ⏰ Schedule
                                </button>
                              </li>

                              <li>
                                <button className="dropdown-item" onClick={() => openEditInfo(edition)}>
                                  ✏ Edit Info
                                </button>
                              </li>

                              <li>
                                <button className="dropdown-item" onClick={() => goToEditPages(edition)}>
                                  📄 Edit Pages
                                </button>
                              </li>
                            </ul>
                          </div>

                          {/* View (eye) button next to ACTION */}
                         
                        </td>
                        <td>
                           <button
                            className="btn btn-sm btn-outline-primary"
                            title="View edition"
                            onClick={() => viewEdition(edition)}
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination placeholder */}
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* ------------------ Modals (React-managed) ------------------ */}

      {/* Area Mapping Modal */}
      {showAreaModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Area Mapping - {activeEdition?.editionName}</h5>
                <button className="btn-close" onClick={() => setShowAreaModal(false)} />
              </div>
              <div className="modal-body">
                <label>Enter areas (comma separated)</label>
                <textarea className="form-control" rows="3" value={areasInput} onChange={(e) => setAreasInput(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAreaModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveAreaMapping}>Save Areas</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule - {activeEdition?.editionName}</h5>
                <button className="btn-close" onClick={() => setShowScheduleModal(false)} />
              </div>
              <div className="modal-body">
                <label>Select date & time</label>
                <input type="datetime-local" className="form-control" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                <small className="text-muted">Leave blank to clear schedule</small>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveSchedule}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Info - {activeEdition?.editionName}</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label>Edition Name</label>
                  <input className="form-control" value={editForm.editionName} onChange={(e) => setEditForm((s) => ({ ...s, editionName: e.target.value }))} />
                </div>
                <div>
                  <label>Category</label>
                  <input className="form-control" value={editForm.category} onChange={(e) => setEditForm((s) => ({ ...s, category: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveEditInfo}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageEditions;
