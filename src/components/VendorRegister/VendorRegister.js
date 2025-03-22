import React, { useState, useCallback, useEffect } from 'react'
import "./vendor-register.css";
import axiosInstance from "../../API/axiosInstance";
import { BusinessInformation, DocumentUpload, PersonalInformation } from './Persoanl Information/PersonalInformation';
import { useNavigate } from 'react-router-dom';

export default function VendorRegister() {
    const navigate = useNavigate();
    const [step, setStapes] = useState(1);
    const [errors, setErrors] = useState({});
    const [personalNext, setPersonalNext] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        vendor_name: "",
        business_name: "",
        business_category: "",
        vendor_aadharCard: null,
        vendor_PAN: null,
        business_PAN: null,
        electricity_bill: null,
        business_photos: null,
        liscence: "",
        gst_number: "",
        terms_and_conditions: "",
        email: "",
        phone_no: "",
        city: "",
    });
    const totalSteps = 3;
    const handlePrev = () => {
        if (step > 1) {
            setStapes((step) => step - 1);
        }
    }

    const handleNext = () => {
        if (step < 3) {
            setStapes((step) => step + 1);
        }
    }

    const updateFormData = useCallback((newData) => {
        setFormData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    }, []);

    const loadComponents = (step) => {
        switch (step) {
            case 1:
                return <PersonalInformation formData={formData} updateFormData={updateFormData} setPersonalNext={ setPersonalNext } />;
            case 2:
                return <BusinessInformation formData={formData} updateFormData={updateFormData} setPersonalNext={ setPersonalNext }/>
            case 3:
                return <DocumentUpload formData={formData} updateFormData={updateFormData} setPersonalNext={ setPersonalNext }/>
            default:
                return <PersonalInformation formData={formData} updateFormData={updateFormData} setPersonalNext={ setPersonalNext }/>
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        // Append non-file fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'business_photos') {
                formDataToSend.append(key, value);
            }
        });

        // Append each business photo individually
        if (formData.business_photos) {
            formData.business_photos.forEach((file) => {
                formDataToSend.append('business_photos', file);
            });
        }

        try {
            const response = await axiosInstance.post("/vendor/register", formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: false,
            });

            if (response.status === 200) {
                console.log("Vendor created successfully!");
                console.log(response.data);
                navigate("/register-success");
            } else {
                console.log("Registration failed");
            }
        } catch (error) {
            console.error("An error occurred during registration:", error);
        }
    };
    return (
        <>

            <div class="text-center">
                <div class="row" id='main-container'>
                    <div class="col-lg-4 " id='steps-col'>
                        <div className="title-container">
                            <h1 className="title">Register Your Business in Simple Steps</h1>
                            <h4 className="sub-title">Follow our step-by-step process to get started seamlessly.</h4>
                        </div>

                        <div className='steps-container'>
                            <div className='step'>
                                <div className={`${step >= 1 ? "step-circle active" : "step-circle"}`}>1</div>
                                <div className='step-text'>
                                    <div className='step-no'><h5>Step 1</h5></div>
                                    <div className='step-title'><h1>Personal Information</h1></div>
                                </div>
                            </div>
                            <div className='step'>
                                <div className={`${step >= 2 ? "step-circle active" : "step-circle"}`}>2</div>
                                <div className='step-text'>
                                    <div className='step-no'><h5>Step 2</h5></div>
                                    <div className='step-title'><h1>Business Information</h1></div>
                                </div>
                            </div>
                            <div className='step'>
                                <div className={`${step >= 3 ? "step-circle active" : "step-circle"}`}>3</div>
                                <div className='step-text'>
                                    <div className='step-no'><h5>Step 3</h5></div>
                                    <div className='step-title'><h1>Upload Document</h1></div>
                                </div>
                            </div>
                        </div>


                        <div className='design-circle-1'></div>
                        <div className='design-circle-2'></div>
                        <div className='design-circle-3'></div>
                    </div>
                    <div class="col-lg-8 forms-col">
                        {/* Here we render the Actucal forms */}
                        {loadComponents(step)}
                        <div className='button-container'>
                            <div className='action-buttons'>
                                <button className={`${(step - 1) < 1 ? "btn disabled" : "btn"}`} onClick={handlePrev}>Previous</button>
                                {(step - 1) >= 2 ?
                                    <button className={`btn btn-success ${ !personalNext ? 'disabled' : ''} `} onClick={handleSubmit} style={{ backgroundColor: "green" }}>Submit</button> :
                                    <button className={`btn ${!personalNext ? "disabled" : ""}`} onClick={handleNext} disabled={!personalNext}>Next</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
