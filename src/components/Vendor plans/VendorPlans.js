import React from 'react';
import './vendorPlans.css';

const VendorPlans = () => {
  return (
    <div className="vendor-plans-container">
      <h2>Vendor Plans & Add-ons</h2>
      <div className="plans-cards">
        {/* Free / Minimum Paid Plan */}
        <div className="plan-card free">
          <h3>Free / Minimum Paid Version</h3>
          <p className="price">₹499 / year</p>
          <ul>
            <li>Lowest visibility</li>
            <li>200 photos upload</li>
            <li>No analytic access</li>
            <li>No customer contact details</li>
            <li>No multiple cities</li>
            <li>No online posting</li>
          </ul>
        </div>
        
        {/* Popular Plan */}
        <div className="plan-card popular">
          <h3>Popular Plan</h3>
          <p className="price">₹4999 / year</p>
          <p className="price">₹2999 / 6 months</p>
          <ul>
            <li>Visible on page 1st</li>
            <li>Profile management support</li>
            <li>1500 photos upload</li>
            <li>Call support</li>
            <li>Analytic access</li>
            <li>Visible customer contact details</li>
            <li>Multiple cities listing (10 or less)</li>
            <li>Lead updates via SMS</li>
            <li>Social media promotion</li>
          </ul>
        </div>

        {/* Premium Partner Plan */}
        <div className="plan-card premium">
          <h3>Premium Partner Plan</h3>
          <p className="price">₹9999 / year</p>
          <p className="price">₹5999 / 6 months</p>
          <ul>
            <li>Top visibility</li>
            <li>Dedicated profile support</li>
            <li>Unlimited photos upload</li>
            <li>Call support</li>
            <li>Analytic access</li>
            <li>Visible customer contact details</li>
            <li>Multiple cities listing</li>
            <li>Lead updates via SMS</li>
            <li>3 feature blogs per year</li>
            <li>Social media marketing</li>
            <li>Access to premium analytics</li>
            <li>Multiple types of listing</li>
          </ul>
        </div>
      </div>

      <div className="add-ons">
        <h3>Additional Add-ons</h3>
        <div className="add-on-card">
          <h4>Ad Boosts</h4>
          <p>₹1999 - Homepage Feature</p>
        </div>
        <div className="add-on-card">
          <h4>Insta & Pinterest Promotions</h4>
          <p>₹3999 per month</p>
        </div>
        <div className="add-on-card">
          <h4>Vendor Training & Consultation</h4>
          <p>₹2499 for business growth</p>
        </div>
      </div>
    </div>
  );
};

export default VendorPlans;
