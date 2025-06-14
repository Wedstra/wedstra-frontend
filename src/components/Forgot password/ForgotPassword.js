// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axiosInstance from '../../API/axiosInstance';
import useAuthCheck from '../../Auth/useAuthCheck';
import './forgotPassword.css';

const ForgotPassword = () => {
  // useAuthCheck();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setMsg('✅ Reset link sent! Please check your email.');
    } catch (err) {
      setMsg('❌ Error sending reset link. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container d-flex align-items-center justify-content-center">
      <div className="card forgot-password-card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="my-3 text-center" id='title'>Forgot Password</h1>
        <span className='text-center' id='sub-title'>No worries,we'll send you reset instructions.</span>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn w-100" id='reset-button' type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {msg && <p className={`mt-3 text-center ${msg.includes('✅') ? 'text-success' : 'text-danger'}`}>{msg}</p>}
        <p className="mt-2 text-muted small text-center">
          📩 Didn't receive the email? Please check your <strong>Spam</strong> or <strong>Promotions</strong> folder.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
