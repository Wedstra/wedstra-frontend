import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../API/axiosInstance";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Invalid email format";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone.match(/^\d{10,15}$/))
      newErrors.phone = "Phone number must be 10-15 digits";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // console.log("Form submitted:", formData);
      try {
        const response =  await axiosInstance.post("/user/register", formData);
        console.log(response);
        
        if(response.status === 201){
            navigate("/register-success");
          }
          else{
            alert("Registration failed..!");
        }
      } catch (err) {
        console.log(err);
        
      }

      
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Registration</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input type="text" name="firstName" className="form-control" onChange={handleChange} />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input type="text" name="lastName" className="form-control" onChange={handleChange} />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" name="username" className="form-control" onChange={handleChange} />
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} />
          {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input type="text" name="phone" className="form-control" onChange={handleChange} />
          {errors.phone && <div className="text-danger">{errors.phone}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" name="dob" className="form-control" onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <div>
            <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
            <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female
            <input type="radio" name="gender" value="Other" onChange={handleChange} /> Other
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea name="address" className="form-control" onChange={handleChange}></textarea>
        </div>
        <div className="mb-3">
          <input type="checkbox" name="termsAccepted" onChange={handleChange} /> I accept the Terms & Conditions
          {errors.termsAccepted && <div className="text-danger">{errors.termsAccepted}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
