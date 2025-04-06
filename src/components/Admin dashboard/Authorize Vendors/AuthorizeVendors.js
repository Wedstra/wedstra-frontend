import React, { useEffect, useState } from 'react';
import './authorizeVendors.css';
import axiosInstance from '../../../API/axiosInstance';  // Assuming axiosInstance is defined elsewhere
import { Link } from 'react-router-dom';
import empty_result from '../../../images/empty-rresult.png'; // Assuming this image is in the correct path
import useAuthCheck from '../../../Auth/useAuthCheck';

export default function AuthorizeVendors() {
    useAuthCheck();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const getVendors = async () => {
            if (!token) return;

            try {
                const response = await axiosInstance.get('/vendor/get/not-verified', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setVendors(response.data);
            } catch (err) {
                setError('Failed to fetch vendor data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        getVendors();
    }, [token]);

    const authorizeVendor = async (vendorId) => {
        if (!token) {
            console.error('No token found. Please log in again.');
            return;
        }
        try { // Replace with actual token retrieval logic
            const response = await axiosInstance.put(`/vendor/verify/${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            // Handling the response
            if (response.status === 200) {
                console.log('Vendor updated successfully');
                // You can also display a success message to the user here
            } else {
                console.log('Failed to update vendor', response.data);
                // Handle other statuses (e.g., show a failure message)
            }
        } catch (error) {
            console.error('Error updating vendor:', error);
            // Handle the error, show an error message to the user
        }
    };


    return (
        <>
            <section className='relative'>
                <div className="vendor-list-container mt-4">
                    <h2 className="mb-4">Waiting List for Authorization</h2>

                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger text-center" role="alert">
                            {error}
                        </div>
                    ) : vendors.length === 0 ? (
                        <section id='no-result-section'>
                            <img src={empty_result} className='img-fluid' alt="No vendors" />
                            <h1 className='no-vendor-text'>Oops! We couldn't find any vendors that match your selection</h1>
                        </section>
                    ) : (
                        vendors.map((vendor) => (
                            <div className="vendor-card d-flex" key={vendor.id}>
                                <img src="https://wedstra25.s3.eu-north-1.amazonaws.com/aadharCard.png" className="vendor-img me-3" alt="Vendor" />
                                <div className="vendor-details">
                                    <h5 className="mb-1">{vendor.business_name}</h5>
                                    <p className="mb-1 text-muted">
                                        <strong>Category:</strong>
                                        <span className="badge text-bg-warning">{vendor.business_category}</span>
                                    </p>
                                    <p className="mb-1">
                                        <strong>Vendor:</strong> {vendor.vendor_name} |
                                        <strong>Email:</strong> {vendor.email}
                                    </p>
                                    <p className="mb-1">
                                        <strong>City:</strong> {vendor.city} |
                                        <strong>Phone:</strong> 9284489739
                                    </p>
                                    <p className={`mb-1 fw-semibold ${vendor.isVerified ? 'text-success' : 'text-danger'}`}>
                                        {vendor.isVerified ? '✅ Verified Vendor' : '❌ Not Verified'}
                                    </p>
                                </div>
                                <div className="vendor-actions text-end">
                                    <Link className="btn btn-primary" to={`/vendor/${vendor.id}`}>View Details</Link>
                                    <button className="btn btn-success" onClick={() => authorizeVendor(vendor.id)}>
                                        Authorize Vendor
                                    </button>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );
}
