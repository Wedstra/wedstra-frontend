import React, { use, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css"; // Custom CSS for extra styling
import "./createService.css";
import axiosInstance from "../../API/axiosInstance";
import { fetchCategories } from "../../API/Resources/fetchCategories";
import { fetchStates } from "../../API/Resources/fetchStates";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";

const ServiceForm = () => {
  const navigator = useNavigate();
  const [serviceData, setServiceData] = useState({
    service_name: "",
    description: "",
    category: "",
    min_price: "",
    max_price: "",
    location: "",
    files: [],
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [vendorId, setVendorId] = useState();
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState();
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalId = "membershipModal";

  useEffect(() => {
    if (showModal) {
      // Find modal element
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
      }
    }
  }, [showModal]);

  const notify = (status, message) => {
    (status == "success") ? (toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })) : ((toast.error(message, {
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


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedToken = localStorage.getItem("token");

    const getCategories = async () => {
      const categoryList = await fetchCategories();
      setCategories(categoryList);
    }

    const getStates = async () => {
      const stateList = await fetchStates();
      setStates(stateList);
    }
    if (storedUser) {
      setVendorId(storedUser.id);
    }

    if (storedToken) {
      setToken(storedToken);
    }

    getCategories();
    getStates();
  }, [])


  useEffect(() => {
    const requiredFields = ["service_name", "description", "category", "min_price", "max_price", "location"];

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every((field) => serviceData[field]?.trim() !== "");

    // Check if there are no validation errors in required fields
    const noErrors = requiredFields.every((field) => !errors[field]);

    const fileInput = serviceData.files.length > 0;

    setIsDisabled(allFieldsFilled && noErrors && fileInput);
  }, [serviceData, errors, setIsDisabled])


  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  // Validate fields
  const validateField = (name, value) => {
    let errorMsg = "";
    if (!value.trim()) {
      errorMsg = "This field is required.";
    } else {
      if (name === "min_price" || name === "max_price") {
        if (isNaN(value) || value < 0) {
          errorMsg = "Price must be a positive number.";
        }
      }
      if (name === "max_price" && value < serviceData.min_price) {
        errorMsg = "Max price must be greater than or equal to min price.";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const handleFileDrop = (acceptedFiles) => {
    setServiceData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )]
    }));
  };

  const handleFileRemove = (index) => {
    setServiceData((prevData) => ({
      ...prevData,
      files: prevData.files.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform final validation
    let newErrors = {};
    Object.keys(serviceData).forEach((key) => {
      if (!serviceData[key] && key !== "files") {
        newErrors[key] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    const formData = new FormData();
    formData.append("service_name", serviceData.service_name);
    formData.append("description", serviceData.description);
    formData.append("category", serviceData.category);
    formData.append("min_price", serviceData.min_price);
    formData.append("max_price", serviceData.max_price);
    formData.append("location", serviceData.location);

    // Append each file properly
    serviceData.files.forEach((file, index) => {
      formData.append("files", file); // 'files' should match the backend key
    });

    try {
      if (!vendorId || !token) {
        alert("Vendor ID or token not found. Please log in again.");
        return;
      }

      const response = await axiosInstance.post(`/service/${vendorId}/create-service`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });

      if (response.status === 200 || response.status === 201) {
        notify("success", "Service added successfully!");
        setTimeout(() => {
          fetchUser();
          window.location.href = "/vendor-dashboard";
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        notify("error", err.response.data);
        setShowModal(true);
      } else {
        notify("error", "Something went wrong. Please try again.")
      }
    }

  };

  return (
    <div id="main-div">
      {/* Bootstrap Modal */}
      <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby="pricingModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="pricingModalLabel">
              Upgrade Your Plan
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row text-center" id="subscription-row">
              {/* Basic Plan */}
              <div className="col-md-6" id="basic-plan-col">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">Web, App Access</h5>
                    <h2 className="fw-bold">$4.99</h2>
                    <p className="text-muted">per month, billed monthly</p>
                    <p className="text-muted">Billing starts after the 14-day free trial.</p>
                    <button className="btn btn-outline-dark w-100">Start Free Trial</button>
                    <ul className="list-unstyled mt-3">
                      <li>✔ Unlimited access to Swen</li>
                      <li>✔ Unrestricted access to the app</li>
                      <li>✔ Unlimited customizations</li>
                      <li>✔ Connect Multiple Accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="col-md-6" id="premium-plan-col">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">Web, App Access + Printing</h5>
                    <h2 className="fw-bold">$6.99</h2>
                    <p className="text-muted">per month, billed monthly</p>
                    <p className="text-muted">Billing starts after the 14-day free trial.</p>
                    <button className="btn btn-primary w-100">Start Free Trial</button>
                    <ul className="list-unstyled mt-3">
                      <li>✔ Unlimited access to Swen</li>
                      <li>✔ Unrestricted access to the app</li>
                      <li>✔ Print edition delivered to your door each week</li>
                      <li>✔ Unlimited customizations</li>
                      <li>✔ Connect Multiple Accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>



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
      <div className="card p-4 shadow">
        <h1 className="text-center mb-4" id="title">Create a New Service</h1>

        <form onSubmit={handleSubmit}>
          {/* Service Name */}
          <div className="mb-3">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className={`form-control  form-control-lg ${errors.service_name ? "is-invalid" : ""}`}
              name="service_name"
              placeholder="Enter service name"
              value={serviceData.service_name}
              onChange={handleChange}
              required
            />
            {errors.service_name && <div className="invalid-feedback">{errors.service_name}</div>}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control  form-control-lg ${errors.description ? "is-invalid" : ""}`}
              name="description"
              placeholder="Provide a detailed description"
              value={serviceData.description}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className={`form-control  form-control-lg ${errors.category ? "is-invalid" : ""}`}
              name="category"
              value={serviceData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
          </div>

          {/* Price Range */}
          <div className="row mx-0 mb-3 px-0" style={{ height: "max-content" }}>
            <div className="col-6 px-0 pe-1">
              <label className="form-label">Min Price ($)</label>
              <input
                type="number"
                className={`form-control  form-control-lg ${errors.min_price ? "is-invalid" : ""}`}
                name="min_price"
                placeholder="Enter minimum price"
                value={serviceData.min_price}
                onChange={handleChange}
                required
              />
              {errors.min_price && <div className="invalid-feedback">{errors.min_price}</div>}
            </div>
            <div className="col-6 px-0 ps-1">
              <label className="form-label">Max Price ($)</label>
              <input
                type="number"
                className={`form-control  form-control-lg ${errors.max_price ? "is-invalid" : ""}`}
                name="max_price"
                placeholder="Enter maximum price"
                value={serviceData.max_price}
                onChange={handleChange}
                required
              />
              {errors.max_price && <div className="invalid-feedback">{errors.max_price}</div>}
            </div>
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <select
              className={`form-control  form-control-lg ${errors.location ? "is-invalid" : ""}`}
              name="location"
              value={serviceData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {states.map((state) => (
                <option key={state.state_code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
          </div>

          {/* Image Upload Section */}
          <div className="mb-3">
            <label className="form-label">Service Images</label>
            <FileUpload
              files={serviceData.files}
              onDrop={handleFileDrop}
              onRemove={handleFileRemove}
            />
            <div className="preview">
              {serviceData.files && serviceData.files.map((file, index) => (
                <img key={index} src={file.preview} alt="preview" className="preview-img" />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className={`btn create-service-btn w-100  ${!isDisabled ? 'disabled' : ''}`}>
            Create Service
          </button>
        </form>
      </div>
    </div>
  );
};

const FileUpload = ({ files, onDrop, onRemove }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*,application/pdf",
    multiple: true, // Allow multiple files
    onDrop
  });

  return (
    <div className="file-upload">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <span className="title">Choose files or drag & drop them here</span>
        <br />
        <span className="sub-title">JPEG, PNG, and PDF formats, up to 50MB</span>
      </div>

      {/* Display selected files */}
      {files && files.length > 0 && (
        <div className="file-info">
          <strong>Selected Files:</strong>
          {files.map((file, index) => (
            <div key={index} className="file-item px-3">
              {file.name}
              <button className="remove-btn" onClick={() => onRemove(index)}>
                <h6>X</h6>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ServiceForm;
