
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManageEditions() {
  const { currentUser } = useAuth();
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditions = async () => {
      if (!currentUser?.uid) return;
      try {
        const colRef = collection(db, 'editions', currentUser.uid, 'items');
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEditions(data);
      } catch (err) {
        console.error('Error fetching editions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEditions();
  }, [currentUser]);

  if (loading) return <div className="text-center p-4">Loading editions...</div>;

  return (
    <div className="container-fluid p-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="mb-4">
            <span className="me-2">📤</span> MANAGE EDITION
          </h6>

          <div className="table-responsive">
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
                </tr>
              </thead>
              <tbody>
                {editions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No editions found.
                    </td>
                  </tr>
                ) : (
                  editions.map((edition, index) => (
                    <tr key={edition.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{edition.editionName}</strong> /{' '}
                        <span className="badge bg-warning text-dark">
                          {edition.category}
                        </span>
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
                        <span className="badge bg-success">
                          {edition.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">NO</span>
                      </td>
                      <td>
                        <span className="text-warning">⚠ Not Setup/Disabled</span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            ACTION
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button className="dropdown-item">📍 Area Mapping</button>
                            </li>
                            <li>
                              <button className="dropdown-item">🔒 Make Private</button>
                            </li>
                            <li>
                              <button className="dropdown-item">⏰ Schedule</button>
                            </li>
                            <li>
                              <button className="dropdown-item">✏ Edit Info</button>
                            </li>
                            <li>
                              <button className="dropdown-item">📄 Edit Pages</button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
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
    </div>
  );
}

export default ManageEditions;

// {
//   "editionName": "Chowrastah",
//   "category": "Main Edition",
//   "editionDateDisplay": "27/11/2025",
//   "status": "Public",
//   "createdBy": {
//     "displayName": "admin"
//   }
// }
