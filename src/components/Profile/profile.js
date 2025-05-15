import React, { useEffect } from 'react'
import './profile.css';
import { useState } from 'react';

export default function Profile() {
    // const [user, setuser] = useState({});


    const user = {
        id: "1",
        firstname: "Jeremy",
        lastname: "Rose",
        username: "jeremyrose",
        email: "hello@jeremyrose.com",
        mobileNo: "+1 123 456 7890",
        dob: "1992-06-05T00:00:00Z",
        gender: "Male",
        address: "525 E 68th Street, New York, NY 10065",
        roles: new Set(["USER", "EDITOR"]),
        role: "User",
        planType: "Premium"
    };
    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src="https://via.placeholder.com/120"
                    alt="Profile"
                    className="profile-image"
                />
                <div className="profile-info">
                    <h2>{user.firstname} {user.lastname}</h2>
                    <p className="designation">{user.role}</p>
                    <p className="rating">8.6 ★★★★★</p>
                    <div className="action-buttons">
                        <button className="message-btn">Send message</button>
                        <button className="contact-btn">Contacts</button>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="left-column">
                    <div className="work-section">
                        <h4>Work</h4>
                        <p><strong>Company:</strong> Placeholder Company</p>
                        <p><strong>Plan:</strong> {user.planType}</p>
                    </div>

                    <div className="skills-section">
                        <h4>Roles</h4>
                        <p>{Array.from(user.roles).join(', ')}</p>
                    </div>
                </div>

                <div className="right-column">
                    <div className="contact-info">
                        <h4>Contact Information</h4>
                        <p><strong>Phone:</strong> {user.mobileNo}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Username:</strong> {user.username}</p>
                    </div>

                    <div className="basic-info">
                        <h4>Basic Information</h4>
                        <p><strong>Birthday:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                        <p><strong>Gender:</strong> {user.gender}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
