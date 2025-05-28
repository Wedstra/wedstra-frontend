import React, { useState, useCallback, useEffect } from 'react';
import "./personal_info.css";
import { useDropzone } from "react-dropzone";
import { fetchStates } from '../../../API/Resources/fetchStates';
import { fetchCategories } from '../../../API/Resources/fetchCategories';
import { fetchCities } from '../../../API/Resources/fetchCities';

function PersonalInformation({ formData, updateFormData, setPersonalNext }) {
    const [personalFormData, setPersonalFormData] = useState(formData);
    const [locations, setLocations] = useState([]);

    const [errors, setErrors] = useState({});

    const validate = (name, value) => {
        let error = "";
        switch (name) {
            case "username":
                if (!value) error = "Username is required";
                break;
            case "password":
                if (!value) error = "Password is required";
                else if (value.length < 6) error = "Password must be at least 6 characters";
                break;
            case "vendor_name":
                if (!value) error = "Vendor name is required";
                break;
            case "email":
                if (!value) error = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
                break;
            case "phone_no":
                if (!value) error = "Phone number is required";
                else if (!/^\d{10}$/.test(value)) error = "Phone number must be 10 digits";
                break;
            case "city":
                if (!value) error = "City is required";
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validate(name, value)
        }));
    };

    useEffect(() => {
        const fetchLocations = async () => {
            const loc = await fetchStates();
            setLocations(loc);
        }

        fetchLocations();
    }, []);

    useEffect(() => {
        updateFormData(personalFormData);

        const requiredFields = ["username", "password", "vendor_name", "email", "phone_no", "city"];

        // Check if all required fields are filled
        const allFieldsFilled = requiredFields.every((field) => personalFormData[field]?.trim() !== "");

        // Check if there are no validation errors in required fields
        const noErrors = requiredFields.every((field) => !errors[field]);

        setPersonalNext(allFieldsFilled && noErrors);
    }, [personalFormData, errors, updateFormData, setPersonalNext]);

    useEffect(() => {
        updateFormData(personalFormData);
    }, [personalFormData, updateFormData]);

    return (
        <div className='personal-info-form'>
            <section className='title'>
                <h1>Personal Information</h1>
            </section>
            <div className='form-section'>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors["username"] ? "is-invalid" : ""}`}
                        name="username"
                        placeholder="Username"
                        value={formData.username || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["username"] && <div className="invalid-feedback">{errors["username"]}</div>}
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        className={`form-control form-control-lg ${errors["password"] ? "is-invalid" : ""}`}
                        name="password"
                        placeholder="Password"
                        value={formData.password || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["password"] && <div className="invalid-feedback">{errors["password"]}</div>}
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors["vendor_name"] ? "is-invalid" : ""}`}
                        name="vendor_name"
                        placeholder="Vendor_name"
                        value={formData.vendor_name || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["vendor_name"] && <div className="invalid-feedback">{errors["vendor_name"]}</div>}
                </div>

                <div className="mb-3">
                    <input
                        type="email"
                        className={`form-control form-control-lg ${errors["email"] ? "is-invalid" : ""}`}
                        name="email"
                        placeholder="Email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["email"] && <div className="invalid-feedback">{errors["email"]}</div>}
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors["phone_no"] ? "is-invalid" : ""}`}
                        name="phone_no"
                        placeholder="Phone Number"
                        value={formData.phone_no || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["phone_no"] && <div className="invalid-feedback">{errors["phone_no"]}</div>}
                </div>

                <div className="mb-3">
                    <select
                        className={`form-control form-control-lg ${errors["city"] ? "is-invalid" : ""}`}
                        name="city"
                        value={formData.city || ""}
                        onChange={handleChange}
                    >
                        <option value="" disabled>Select a city</option>
                        {locations.map((state) => (
                            <option key={state.state_code} value={state.name}>
                                {state.name}
                            </option>
                        ))}
                        {/* Add other cities here */}
                    </select>
                    {errors["city"] && <div className="invalid-feedback">{errors["city"]}</div>}
                </div>

            </div>
        </div>
    );
}

function BusinessInformation({ formData, updateFormData, setPersonalNext }) {
    const [businessFormData, setBusinessFormData] = useState(formData);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setPersonalNext(false);

        const fetchCategory = async () => {
            const cat = await fetchCategories();
            setCategories(cat)
        }

        // fetchUser();
        fetchCategory();

        const message = sessionStorage.getItem("message");
        if (message) {
            setOpen(true);
        }

    }, []);

    useEffect(() => {
        updateFormData(businessFormData);
    }, [businessFormData, updateFormData]);

    const validate = (name, value) => {
        let error = "";
        switch (name) {
            case "business_name":
                if (!value.trim()) error = "Business name is required";
                break;
            case "business_category":
                if (!value.trim()) error = "Business category is required";
                break;
            case "terms_and_conditions":
                if (!value.trim()) error = "Terms and conditions are required";
                break;

            case "gst_number":
                if (!value.trim()) {
                    error = "GST Number is required";
                } else {
                    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;
                    if (!gstRegex.test(value)) {
                        error = "Invalid GST Number format";
                    }
                }
                break;

            default:
                break;
        }
        return error;
    };


    useEffect(() => {
        updateFormData(businessFormData);

        const requiredFields = ["business_name", "business_category", "gst_number", "terms_and_conditions"];

        // Check if all required fields are filled
        const allFieldsFilled = requiredFields.every((field) => businessFormData[field]?.trim() !== "");

        // Check if there are no validation errors in required fields
        const noErrors = requiredFields.every((field) => !errors[field]);

        setPersonalNext(allFieldsFilled && noErrors);
    }, [businessFormData, errors, updateFormData, setPersonalNext]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBusinessFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validate(name, value)
        }));
    };

    return (
        <div className='business-info-form'>
            <section className='title'>
                <h1>Business Information</h1>
            </section>

            <div className='form-section'>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors["business_name"] ? "is-invalid" : ""}`}
                        name="business_name"
                        placeholder="Business name"
                        value={formData.business_name || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["business_name"] && <div className="invalid-feedback">{errors["business_name"]}</div>}
                </div>



                <div className="mb-3">
                    <select
                        className={`form-control form-control-lg ${errors["business_category"] ? "is-invalid" : ""}`}
                        name="business_category"
                        value={formData.business_category || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    >
                        <option value="">Select Business Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.category_name}>
                                {category.category_name}
                            </option>
                        ))}
                        {/* Add more categories as needed */}
                    </select>
                    {errors["business_category"] && (
                        <div className="invalid-feedback">{errors["business_category"]}</div>
                    )}
                </div>


                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors["gst_number"] ? "is-invalid" : ""}`}
                        name="gst_number"
                        placeholder="GST Number"
                        value={formData.gst_number || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["gst_number"] && <div className="invalid-feedback">{errors["gst_number"]}</div>}
                </div>


                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg ${errors["terms_and_conditions"] ? "is-invalid" : ""}`}
                        name="terms_and_conditions"
                        placeholder="Terms & Conditions"
                        value={formData.terms_and_conditions || ""}
                        onChange={handleChange}
                        autoComplete='off'
                    />
                    {errors["terms_and_conditions"] && <div className="invalid-feedback">{errors["terms_and_conditions"]}</div>}
                </div>
            </div>
        </div>
    );
}


function DocumentUpload({ formData, updateFormData, setPersonalNext }) {

    const [uploadedDocuments, setUploadedDocuments] = useState(formData);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        setPersonalNext(false);
    }, [])


    useEffect(() => {
        updateFormData(uploadedDocuments);

        const requiredFields = ["vendor_aadharCard", "vendor_PAN", "business_PAN", "electricity_bill", "business_photos", "liscence"];

        // Check if all required fields have files uploaded
        const allFieldsFilled = requiredFields.every(
            (field) => uploadedDocuments[field] instanceof File || (Array.isArray(uploadedDocuments[field]) && uploadedDocuments[field].length > 0)
        );

        setPersonalNext(allFieldsFilled ? true : false);
    }, [uploadedDocuments, updateFormData, setPersonalNext]);

    const handleFileDrop = (fieldName, isMultiple = false) => (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const files = isMultiple ? acceptedFiles : acceptedFiles[0];

            setUploadedDocuments((prevState) => ({
                ...prevState,
                [fieldName]: files,
            }));

            updateFormData({
                [fieldName]: files,
            });
        }
    };



    const handleFileRemove = (fieldName) => {
        setUploadedDocuments((prevState) => ({
            ...prevState,
            [fieldName]: null,
        }));
        updateFormData({
            [fieldName]: null,
        });
    };

    const handleMultipleFileRemove = (fieldName, index) => {
        setUploadedDocuments((prevState) => {
            const updatedFiles = prevState[fieldName].filter((_, i) => i !== index);
            return {
                ...prevState,
                [fieldName]: updatedFiles,
            };
        });
        updateFormData({
            [fieldName]: uploadedDocuments[fieldName].filter((_, i) => i !== index),
        });
    };


    return (
        <div className="personal-info-form">
            <section className="title">
                <h1>Upload Documents</h1>
            </section>
            <section className='file-container'>

                {/* Aadhar Card Upload */}
                <FileUpload
                    label="Aadhar Card"
                    file={uploadedDocuments["vendor_aadharCard"]}
                    onDrop={handleFileDrop("vendor_aadharCard", false)}
                    onRemove={() => handleFileRemove("vendor_aadharCard")}
                    isLastFileUpload={false}

                />

                {/* PAN Card Upload */}
                <FileUpload
                    label="PAN Card"
                    file={uploadedDocuments["vendor_PAN"]}
                    onDrop={handleFileDrop("vendor_PAN", false)}
                    onRemove={() => handleFileRemove("vendor_PAN")}
                    isLastFileUpload={false}
                />

                {/* Business PAN Upload */}
                <FileUpload
                    label="Business PAN"
                    file={uploadedDocuments["business_PAN"]}
                    onDrop={handleFileDrop("business_PAN", false)}
                    onRemove={() => handleFileRemove("business_PAN")}
                    isLastFileUpload={false}
                />

                {/* Electricity Bill Upload */}
                <FileUpload
                    label="Electricity Bill"
                    file={uploadedDocuments["electricity_bill"]}
                    onDrop={handleFileDrop("electricity_bill", false)}
                    onRemove={() => handleFileRemove("electricity_bill")}
                    isLastFileUpload={false}
                />

                {/* liscence */}
                <FileUpload
                    label="Liscence"
                    file={uploadedDocuments["liscence"]}
                    onDrop={handleFileDrop("liscence", false)}
                    onRemove={() => handleFileRemove("liscence")}
                    isLastFileUpload={false}
                />

                {/* Business Photos Upload */}
                <FileUpload
                    label="Business Photos"
                    subLabel="(Include at least 1 vendor's photo also)"
                    file={uploadedDocuments["business_photos"]}
                    onDrop={handleFileDrop("business_photos", true)}
                    onRemove={(index) => handleMultipleFileRemove("business_photos", index)}
                    isLastFileUpload={true}
                />

            </section>
        </div>
    );
};

const FileUpload = ({ label, subLabel, file, onDrop, onRemove, isLastFileUpload }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*,application/pdf",
        multiple: isLastFileUpload, // Dynamically set based on the component
    });


    return (
        <div className="file-upload">
           <label className='file-label' style={{ fontWeight: "bold" }}>
        {label}
        {subLabel && (
          <small style={{ display: "block", color: "gray", fontSize: "0.8rem", marginTop: "2px" }}>
            {subLabel}
          </small>
        )}
      </label>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <span className="title">Choose a file or drag & drop it here</span>
                <br />
                <span className="sub-title">JPEG, PNG, and PDF formats, up to 50MB</span>
            </div>

            {/* Handle single or multiple files */}
            {file && (
                <div className="file-info">
                    <strong className='px-2' >Selected {isLastFileUpload ? "Files" : "File"}:</strong>
                    <div className="selected-file-container">
                        {isLastFileUpload ? (
                            file.map((f, index) => (
                                <div key={index} className="file-item px-3">
                                    {f.name}
                                    <button className="remove-btn" onClick={() => onRemove(index)}>
                                        <h6>X</h6>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="file-item">
                                {file.name}
                                <button className="remove-btn" onClick={onRemove}>
                                    <h6>X</h6>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export { PersonalInformation, BusinessInformation, DocumentUpload };


