import React, { useState } from "react";
import { Link, Route, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import { InputLabel } from '@mui/material';
import "./login.css";


const LoginForm = ({ showAlert }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const loginData = {
      username,
      password
    }

    try {
      const response = await axiosInstance.post("/vendor/login", loginData);

      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem("token", response.data); // Store JWT token
        showAlert("success", "Vendor Login success.", true, );
        window.location.href = "/";
      }

      else {
        setError("Login failed");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <div class="text-center">
        <div class="row">
          <div class="col-lg-6 left-col">
            <h1 className="form-title">Back to Business</h1>
            <h4 className="form-subtitle">Log in to track orders, update listings, and stay ahead of customer needs.</h4>
            <section class="form-container">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleLogin}>
                <InputLabel htmlFor="outlined-required" className="label" >Username</InputLabel>
                <input type="text" className="form-control input-field" placeholder="Enter username" value={username}
                  onChange={(e) => setUsername(e.target.value)} required />
                
                <InputLabel htmlFor="outlined-required" className="label" >Password</InputLabel>
                <input type="password" className="form-control input-field" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit" className="btn login-btn w-100">Login</button>
              </form>
              <p className="forgot-password"><Link>Forgot your password?</Link></p>
              <p className="register-text">Don't have an account? <span><Link to={"/vendor-register"} >Register here.</Link></span></p>
            </section>
          </div>
          <div class="col-lg-6 right-col">
            <h1 className="title">Make a Dream Wedding.</h1>
            <h4 className="subtitle">Craft a celebration as unique as your love story. Log in to start planning every detail, from the first kiss to the last dance.</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
