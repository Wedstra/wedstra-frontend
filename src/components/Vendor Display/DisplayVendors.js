import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosInstance';
import './displayVendor.css';

import empty_result from "../../images/empty-rresult.png";
import { Link, useNavigate } from 'react-router-dom';
export default function DisplayVendors({ category, location, goBack, setCategory, setLocation,setState }) {
  const [vendors, setVendors] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getVendors = async () => {
      let response = null;

      if (location === null && category !== null) {
        // Only location is null
        response = await axiosInstance.get(`/vendor/verified/by-category/${category}`);
      } else if (location === null && category === null) {
        // Both are null
        response = await axiosInstance.get(`/vendor/get/verified`);
      } else if (location !== null && category !== null) {
        // Both are defined
        response = await axiosInstance.get(`/vendor/by-location/${location}/by-category/${category}`);
      }
      setVendors(response.data);
    }

    getVendors();
  }, []);

  const handleGoBack = () => {
    setCategory(null);
    setLocation(null);
    setState(null);
    goBack(false);
  }
  return (
    <>
      <section className='relative'>
        <div class="vendor-list-container mt-4">
          <h2 class="mb-4">Vendor Listings</h2>

          {(vendors && vendors.length !== 0)
            ?
            vendors.map((vendor) => (
              <div className="card shadow-sm border-0 rounded-4 mb-4 p-3 d-flex flex-row align-items-start justify-content-between" style={{ backgroundColor: '#ffffff' }}>
                <div className="d-flex">
                  <img
                    src="https://wedstra25.s3.eu-north-1.amazonaws.com/aadharCard.png"
                    className="rounded-3 me-3"
                    alt="Vendor"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-1 fw-bold text-dark">{vendor.business_name}</h5>
                    <p className="mb-1 text-muted">
                      <strong>Category:</strong> <span className="badge bg-warning text-dark">{vendor.business_category}</span>
                    </p>
                    <p className="mb-1">
                      <strong>Vendor:</strong> {vendor.vendor_name} | <strong>Email:</strong> {vendor.email}
                    </p>
                    <p className="mb-1">
                      <strong>City:</strong> {vendor.city} | <strong>Phone:</strong> {vendor.phone_no}
                    </p>
                    <p className={`mb-1 fw-semibold ${vendor.isVerified ? 'text-danger' : 'text-success'}`}>
                      {vendor.isVerified ? '❌ Not Verified' : '✅ Verified Vendor'}
                    </p>
                  </div>
                </div>
                <div className="text-end mt-2">
                  <Link className="btn btn-danger rounded-3 px-4 py-2" to={`/vendor/${vendor.id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            )) : (
              <>
                <section id='no-result-section'>
                  <img src={empty_result} className='img-fluid' />
                  <h1 className='no-vendor-text'>Oops! We couldn't find any vendors that match your selection</h1>
                </section>
              </>
            )}
        </div>
        <button className='btn btn-success back-button' onClick={handleGoBack}>Go to Homepage</button>
      </section>
    </>
  )
}
