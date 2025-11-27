
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left Image Section */}
      <div className="d-none d-md-flex col-md-8 bg-primary justify-content-center align-items-center">
        <img
          src="https://source.unsplash.com/900x700/?"
          />
      </div>

      {/* Right Login Section */}
      <div className = "col-12 col-md-4 d-flex flex-column justify-content-center align-items-center bg-light p-4">
        <div className="w-100" style={{ maxWidth: '350px' }}>
          <h2 className="text-center mb-4 text-primary fw-bold">Welcome Back</h2>
          <form onSubmit={handleEmailLogin}>
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
              Login
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-danger w-100 mb-3"
          >
            <i className="bi bi-google me-2"></i> Login with Google
          </button>

          {error && <p className="text-danger text-center">{error}</p>}

          <p className="text-center mt-3">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary fw-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
