import React, { useEffect, useState } from 'react';
import './userPlans.css';

const vendorPlans = [
  {
    name: "Free / Minimum Paid Version",
    price: ["₹499 / year"],
    features: [
      "Lowest visibility", "200 photos upload", "No analytic access",
      "No customer contact details", "No multiple cities", "No online posting"
    ],
  },
  {
    name: "Popular Plan",
    price: ["₹4999 / year", "₹2999 / 6 months"],
    features: [
      "Visible on page 1st", "Profile management support", "1500 photos upload", "Call support",
      "Analytic access", "Visible customer contact details", "Multiple cities listing (10 or less)",
      "Lead updates via SMS", "Social media promotion"
    ],
    popular: true,
  },
  {
    name: "Premium Partner Plan",
    price: ["₹9999 / year", "₹5999 / 6 months"],
    features: [
      "Top visibility", "Dedicated profile support", "Unlimited photos upload", "Call support",
      "Analytic access", "Visible customer contact details", "Multiple cities listing",
      "Lead updates via SMS", "3 feature blogs per year", "Social media marketing",
      "Access to premium analytics", "Multiple types of listing"
    ],
  },
];

const vendorAddOns = [
  { name: "Ad Boosts", price: "₹1999 - Homepage Feature" },
  { name: "Insta & Pinterest Promotions", price: "₹3999 per month" },
  { name: "Vendor Training & Consultation", price: "₹2499 for business growth" },
];

const userPlans = [
  {
    name: "Silver 🪙 (Free Plan)",
    price: ["Free"],
    features: [
      "Profile creation", "Wishlist & shortlist vendors", "Access to real wedding inspirations"
    ],
  },
  {
    name: "Gold 💛",
    price: ["₹799/month", "₹1,999/lifetime"],
    features: [
      "Profile creation", "Wishlist & shortlist vendors", "Access to vendor contact details",
      "Direct chat with vendors", "Personalized planning checklist", "Budget planner tool",
      "Downloadable guides & templates", "Exclusive discounts (5–10%)", "Wedding website builder",
      "Access to premium giveaways", "Vendor comparison tool", "Guest list manager tool",
      "Free e-invitation templates", "Customer support: Standard"
    ],
    popular: true,
  },
  {
    name: "Platinum 👑",
    price: ["₹2,499/month", "₹5,999/lifetime"],
    features: [
      "Everything in Gold", "Dedicated Wedding Planner Support (Virtual)", "Priority expo access",
      "Exclusive discounts (15–25%)", "VIP Support", "Personalized vendor recommendations",
      "Early access to seasonal deals"
    ],
  }
];

export default function UserPlans({ homepage }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);   
  }, []);

  const renderPlans = (plans) => (
    <div className="plans-cards mt-3">
      {plans.map((plan, idx) => (
        <div
          key={idx}
          className={`plan-card ${plan.popular ? 'most-popular' : ''}`}
        >
          {plan.popular && <div className="badge most-popular-badge">Most Popular</div>}
          <h3>{plan.name}</h3>
          {plan.price.map((p, i) => <p className="price" key={i}>{p}</p>)}
          <ul>
            {plan.features.map((f, i) => <li key={i}>✔ {f}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="plans-container">
      <h1 className="heading">Find the Perfect Plan</h1>
      {!homepage && <p className="subheading">We are here to coach you</p>}
      {role === 'VENDOR' ? (
        <>
          <h2 className='mb-3'>Vendor Plans & Add-ons</h2>
          {renderPlans(vendorPlans)}
          <div className="add-ons">
            <h3>Additional Add-ons</h3>
            <div className="add-on-card-deck">
            {vendorAddOns.map((addOn, i) => (
              <div className="add-on-card" key={i}>
                <h3>{addOn.name}</h3>
                <p>{addOn.price}</p>
              </div>
            ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {!homepage && <h2 className='mb-3'>User Subscription Plans</h2>}
          {renderPlans(userPlans)}
        </>
      )}
    </div>
  );
}
