// import React, { useState } from 'react'
// import "./userLogin.css";
// import { InputLabel } from '@mui/material';
// import { Link } from 'react-router-dom';
// import axiosInstance from "../../API/axiosInstance";
// import { getCurrentUser } from "../../Auth/UserServices";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Bounce } from 'react-toastify';
// import { ToastContainer } from 'react-toastify';
import React, { useState } from "react";
import { Link, Route, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import { InputLabel } from '@mui/material';
import { getCurrentUser } from "../../Auth/UserServices";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import "./userLogin.css";

export default function UserLogin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notify = (status) => {
    (status == "success") ? (toast.success('User Login Successful!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })) : ((toast.error('Invalid username or password.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })))
  };

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("role", user.role);
      }
    } catch (err) {
      console.log("Error while saving role and userRole" + err);

    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    const loginData = {
      username,
      password
    }

    try {
      const response = await axiosInstance.post("/user/login", loginData);
      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem("token", response.data);
        await fetchUser();
        notify("success");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
      else {
        setError("Login failed");
      }
    } catch (error) {
      setError("Invalid email or password");
      notify("failed");
    }
    setLoading(false);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div class="text-center">
        <div class="row">
          <div class="col-lg-6 left-col">
            <h1 className="form-title">Welcome Back</h1>
            <h4 className="form-subtitle">Log in to access your personalized wedding planning experience.</h4>
            <section class="form-container">
              <form onSubmit={handleLogin}>
                <InputLabel htmlFor="outlined-required" className="label" >Username</InputLabel>
                <input type="text" className="form-control input-field" placeholder="Enter username" value={username}
                  onChange={(e) => setUsername(e.target.value)} required autoComplete='off'/>

                <InputLabel htmlFor="outlined-required" className="label" >Password</InputLabel>
                <input type="password" className="form-control input-field" placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required autoComplete='off'/>

                <button
                  type="submit"
                  className={`btn login-btn ${loading ? "disabled" : ""}`}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? <section id="spinner section"><span className="spinner-border spinner-border-sm spinner"></span></section> : "Login"}
                </button>
              </form>
              <p className="forgot-password"><Link>Forgot password?</Link></p>
              <p className="register-text">Don't have an account? <span><Link to={"/vendor-register"} >Register here.</Link></span></p>
            </section>
          </div>
          <div class="col-lg-6" id="right-col">
            <h1 className="title">Make a Dream Wedding.</h1>
            <h4 className="subtitle">Craft a celebration as unique as your love story. Log in to start planning every detail, from the first kiss to the last dance.</h4>
          </div>
        </div>
      </div>
    </>
  );
}
