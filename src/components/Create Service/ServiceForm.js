import React, { use, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css"; // Custom CSS for extra styling
import "./createService.css";
import axiosInstance from "../../API/axiosInstance";
import { fetchCategories } from "../../API/Resources/fetchCategories";
import { fetchStates } from "../../API/Resources/fetchStates";
import { useNavigate } from "react-router-dom";

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


  useEffect(()=>{
    const requiredFields = ["service_name", "description", "category", "min_price", "max_price", "location"];

        // Check if all required fields are filled
        const allFieldsFilled = requiredFields.every((field) => serviceData[field]?.trim() !== "");

        // Check if there are no validation errors in required fields
        const noErrors = requiredFields.every((field) => !errors[field]);

        const fileInput = serviceData.files.length > 0;

    setIsDisabled(allFieldsFilled && noErrors && fileInput);
  },[serviceData, errors, setIsDisabled])


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
  const handleSubmit = (e) => {
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
      if (vendorId === undefined || token === undefined) {
        alert("Vendor_id or token not found. Please login again.");
        return;
      }
      const response = axiosInstance.post(`/service/${vendorId}/create-service`, formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
      navigator('/service-create-success');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="main-div">
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
          <button type="submit" className={`btn create-service-btn w-100  ${!isDisabled ? 'disabled' : '' }`}>
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
