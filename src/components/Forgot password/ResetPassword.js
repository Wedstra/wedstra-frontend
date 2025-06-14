// src/components/ResetPassword.js
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../API/axiosInstance';
import './resetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    if (newPassword !== confirmPassword) {
      setMsg('⚠️ The passwords you entered do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { token, newPassword });
      setMsg('✅ Password reset successful! You can now log in.');
      setNewPassword('');
      setConfirmPassword('');
      setResetSuccess(true);
    } catch (err) {
      setMsg('❌ Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {resetSuccess ? (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="card shadow p-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="mb-3">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
            </div>
            <h2 className="text-success mb-3">Password Reset Successful</h2>
            <p className="mb-4">Your password has been updated. You can now log in with your new password.</p>
            <Link to="/user-login" className="btn btn-primary w-100">
              Go to Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="reset-password-container d-flex align-items-center justify-content-center">
          <div className="card reset-password-card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
            <h1 className="mb-4 text-center"><b>Reset Password</b></h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewPassword(value);
                    if (value.length < 6) {
                      setError('⚠️ Password must be at least 6 characters long.');
                    } else {
                      setError('');
                    }
                  }}
                  required
                  minLength={6}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {error && <small className="text-danger d-block mb-2">{error}</small>}

              <button className="btn w-100" id='reset-password-btn' type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            {msg && (
              <p className={`mt-3 text-center ${msg.includes('✅') ? 'text-success' : 'text-danger'}`}>
                {msg}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
