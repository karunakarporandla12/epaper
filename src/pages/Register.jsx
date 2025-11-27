
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure db is Firestore instance
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Save additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: form.name,
        email: form.email,
        createdAt: new Date(),
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left Image Section */}
      <div className="d-none d-md-flex col-md-8 bg-primary justify-content-center align-items-center">
        <img src="https://source.unsplash.com/900x700gy" />
      </div>

      {/* Right Register Section */}
      <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-light p-4">
        <div className="w-100" style={{ maxWidth: '350px' }}>
          <h2 className="text-center mb-4 text-primary fw-bold">Create Account</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Register
            </button>
          </form>

          {error && <p className="text-danger text-center">{error}</p>}

          <p className="text-center mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
