import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import "./userRegister.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  mobileNo: "",
  dob: "",
  gender: "",
  address: "",
  termsAccepted: false,
});


  const notify = (status) => {
    (status == "success") ? (toast.success('User Registration Successful!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })) : ((toast.error('Registration failed.', {
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

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstname) newErrors.firstname = "First Name is required";
    if (!formData.lastname) newErrors.lastname = "Last Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.mobileNo.match(/^\d{10,15}$/))
      newErrors.mobileNo = "mobileNo number must be 10-15 digits";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post("/user/register", formData);
        if (response.status === 201) {
          notify("success");
          setTimeout(() => {
            window.location.href = "/user-login";
          }, 2000);
        } else {
          notify("failed");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center flex-column">
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
      <div className="card shadow-lg p-4 my-2" id="form-card">
        <h1 className="text-center">User Registration</h1>
        <form onSubmit={handleSubmit}>
          {[
            { label: "First Name", name: "firstname" },
            { label: "Last Name", name: "lastname" },
            { label: "Username", name: "username" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
            { label: "mobileNo", name: "mobileNo" },
            { label: "Date of Birth", name: "dob", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                className="form-control"
                onChange={handleChange}
              />
              {errors[name] && <div className="text-danger">{errors[name]}</div>}
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <div className="d-flex gap-3">
              {["Male", "Female", "Other"].map((g) => (
                <div key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    className="form-check-input me-2"
                    onChange={handleChange}
                  />
                  {g}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              name="termsAccepted"
              className="form-check-input"
              onChange={handleChange}
            />
            <label className="form-check-label ms-2">
              I accept the Terms & Conditions
            </label>
            {errors.termsAccepted && <div className="text-danger">{errors.termsAccepted}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
