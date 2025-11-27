
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar() {
    const { currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <NavLink className="navbar-brand fw-bold" to="/">Ezy Desk</NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/price">Price</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/videos">Videos</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/contact-us">Contact Us</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>

                        {!currentUser ? (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/login">Login</NavLink>
                            </li>
                        ) : (

                            <li className="nav-item dropdown bg bg-primary rounded-5">
                                <button
                                    className="nav-link dropdown-toggle btn btn-link"
                                    id="profileDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <img src={currentUser.photoURL || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                                        alt="Profile"
                                        style={{
                                            width: 24,
                                            height: 24,
                                            marginRight: 8,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                    <li className="dropdown-item">{currentUser.displayName || currentUser.email}</li>
                                    <li><NavLink className="dropdown-item" to="/dashboard">Dashboard</NavLink></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </li>

                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
