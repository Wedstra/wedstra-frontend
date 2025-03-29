import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosInstance';
import './displayVendor.css';

import empty_result from "../../images/empty-rresult.png";
import { Link, useNavigate } from 'react-router-dom';
export default function DisplayVendors({ category, location, goBack }) {
  const [vendors, setVendors] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getServices = async () => {
      const response = await axiosInstance.get(`/vendor/by-location/${location}/by-category/${category}`);
      setVendors(response.data);
    }

    getServices();
  }, []);

  const handleGoBack = () => {
    goBack(false);
  }
  return (
    <>
      <section className='relative'>
        <div class="vendor-list-container mt-4">
          <h2 class="mb-4">Vendor Listings</h2>

          {(vendors && vendors.length !== 0)
            ?
            (<div class="vendor-card d-flex">
              <img src="https://wedstra25.s3.eu-north-1.amazonaws.com/aadharCard.png" class="vendor-img me-3" alt="Vendor" />
              <div class="vendor-details">
                <h5 class="mb-1">Test Stories</h5>
                <p class="mb-1 text-muted"><strong>Category:</strong> <span class="badge text-bg-warning">Venue</span></p>
                <p class="mb-1"><strong>Vendor:</strong> test | <strong>Email:</strong> test@gmail.com</p>
                <p class="mb-1"><strong>City:</strong> Goa | <strong>Phone:</strong> 9284489739</p>
                <p class="mb-1 text-success">✅ Verified Vendor</p>
              </div>
              <div class="vendor-actions text-end">
                <button class="btn btn-primary">View Details</button>
              </div>
            </div>) : (
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
