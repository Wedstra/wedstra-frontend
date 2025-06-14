import React, { useEffect } from 'react'
import './profile.css';
import { useState } from 'react';
import { FaEdit, FaHeart } from 'react-icons/fa';

export default function Profile() {
    const [user, setUser] = useState({});
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchLoggedInUser = () => {
            const storedUser = localStorage.getItem("currentUser");
            console.log(storedUser);
            if (storedUser) {
                const resultUser = JSON.parse(storedUser);
                setUser(resultUser);
                setRole(resultUser.role);
            } else {
                console.log("No user found!")
            }
        }

        fetchLoggedInUser();
    }, [])

    return (
        <>
            {role === "USER" && (
                <>
                    <div className="profile-container">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {user.firstname?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            <div className="profile-info">
                                <h2>
                                    {user.firstname || 'N/A'} {user.lastname || ''}
                                </h2>
                                <p className="designation">{user.role || 'Unknown Role'}</p>

                                <div className="icon-buttons">
                                    <button className="wishlist-btn">
                                        <FaHeart /> Wishlist
                                    </button>
                                    <button className="edit-btn">
                                        <FaEdit /> Edit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="profile-content">
                            <div className="info-section">
                                <div className="contact-info">
                                    <h4>Contact Information</h4>
                                    <p><strong>Phone:</strong> {user.mobileNo || 'Not Provided'}</p>
                                    <p><strong>Address:</strong> {user.address || 'Not Provided'}</p>
                                    <p><strong>Email:</strong> {user.email || 'Not Provided'}</p>
                                    <p><strong>Username:</strong> {user.username}</p>
                                </div>

                                <div className="basic-info">
                                    <h4>Basic Information</h4>
                                    <p><strong>Birthday:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not Provided'}</p>
                                    <p><strong>Gender:</strong> {user.gender || 'Not Provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {role === "VENDOR" && (
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.vendor_name?.charAt(0).toUpperCase() || 'V'}
                        </div>

                        <div className="profile-info">
                            <h2>{user.vendor_name || 'N/A'}</h2>
                            <p className="designation">{user.business_category || 'Business Category'}</p>

                            <div className="icon-buttons">
                                <button className="wishlist-btn"><FaHeart /> Wishlist</button>
                                <button className="edit-btn"><FaEdit /> Edit</button>
                            </div>
                        </div>
                    </div>

                    <div className="profile-content">
                        <div className="info-section">
                            <div className="contact-info">
                                <h4>Contact Information</h4>
                                <p><strong>Vendor Name:</strong> {user.vendor_name}</p>
                                <p><strong>Username:</strong> {user.username}</p>
                                <p><strong>Email:</strong> {user.email || 'Not Provided'}</p>
                                <p><strong>Phone:</strong> {user.phone_no || 'Not Provided'}</p>
                                <p><strong>City:</strong> {user.city || 'Not Provided'}</p>
                            </div>

                            <div className="basic-info">
                                <h4>Business Details</h4>
                                <p><strong>Business Name:</strong> {user.business_name || 'Not Provided'}</p>
                                <p><strong>Category:</strong> {user.business_category}</p>
                                <p><strong>GST No:</strong> {user.gst_number || 'N/A'}</p>
                                <p><strong>Plan:</strong> {user.planType}</p>
                                <p><strong>Services Count:</strong> {user.noOfServices}</p>
                                <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
                            </div>

                            <div className="document-info">
                                <h4>KYC Documents</h4>
                                <ul>
                                    <li><a href={user.vendor_aadharCard} target="_blank">Aadhar Card</a></li>
                                    <li><a href={user.vendor_PAN} target="_blank">Vendor PAN</a></li>
                                    <li><a href={user.business_PAN} target="_blank">Business PAN</a></li>
                                    <li><a href={user.electricity_bill} target="_blank">Electricity Bill</a></li>
                                    <li><a href={user.liscence} target="_blank">License</a></li>
                                </ul>
                            </div>

                            <div className="terms-info">
                                <h4>Terms & Conditions</h4>
                                <p>{user.terms_and_conditions}</p>
                            </div>

                            <div className="photos-info">
                                <h4>Business Photos</h4>
                                <div className="photo-grid">
                                    {user.business_photos?.map((url, idx) => (
                                        <img style={{ width:"100%", height:"auto" }} key={idx} src={url} alt={`Business ${idx + 1}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
