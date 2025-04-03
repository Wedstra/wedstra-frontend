import React, { useState } from 'react';
import "../vendorDashboard.css";
import dashboard_icon from "../../../images/dashboard_icon.png";
import services_icon from "../../../images/services_icon.png";
import events_icon from "../../../images/events_icon.png";
import analysis_icon from "../../../images/analysis_icon.png";
import profile_icon from "../../../images/profile_icon.png";
import { FaBars, FaTimes } from "react-icons/fa";

function DashboardNav({ activeTab, setActiveTab, currentUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  function handleNavLinkActive(navItem) {
    setActiveTab(navItem);
    setIsSidebarOpen(false);
  }
  return (
    <>
      <div>
        <div className='btn-container'>
          {/* Toggle Button for Mobile */}
          <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {/* Sidebar Container */}
        <div className={`vertical-nav-container ${isSidebarOpen ? "open" : ""}`}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <section className={`nav-link custom-nav-link ${activeTab === "dashboard" ? "active" : ""}`} id="dashboard" onClick={() => handleNavLinkActive("dashboard")}>
                <img className="icon" src={dashboard_icon} alt="Dashboard" />
                <span className="text">Dashboard</span>
              </section>
            </li>
            <li className="nav-item">
              <section className={`nav-link custom-nav-link ${activeTab === "services" ? "active" : ""}`} id="services" onClick={() => handleNavLinkActive("services")}>
                <img className="icon" src={services_icon} alt="Services" />
                <span className="text">Services</span>
              </section>
            </li>
            <li className="nav-item">
              <section className={`nav-link custom-nav-link ${activeTab === "createService" ? "active" : ""}`} id="createService" onClick={() => handleNavLinkActive("createService")}>
                <img className="icon" src={profile_icon} alt="Profile" />
                <span className="text">Create Service</span>
              </section>
            </li>
            <li className="nav-item">
              <section className={`nav-link custom-nav-link ${activeTab === "messages" ? "active" : ""}`} id="messages" onClick={() => handleNavLinkActive("messages")}>
                <img className="icon" src={events_icon} alt="messages" />
                <span className="text">Messages</span>
              </section>
            </li>
            <li className="nav-item">
              <section className={`nav-link custom-nav-link ${activeTab === "analysis" ? "active" : ""}`} id="analysis" onClick={() => handleNavLinkActive("analysis")}>
                <img className="icon" src={analysis_icon} alt="Analytics" />
                <span className="text">Analytics</span>
              </section>
            </li>
            <li className="nav-item">
              <section className={`nav-link custom-nav-link ${activeTab === "profile" ? "active" : ""}`} id="profile" onClick={() => handleNavLinkActive("profile")}>
                <img className="icon" src={profile_icon} alt="Profile" />
                <span className="text">Profile</span>
              </section>
            </li>
          </ul>

          <hr />

          <div className="user-info-section">
            <div className="user-info-div">
              <div className="avatar-div">
                <h2>{currentUser ? currentUser.vendor_name[0] : "Z"}</h2>
              </div>
              <div className="user-info">
                <h5 id="user-name">{currentUser ? currentUser.vendor_name : "Name"}</h5>
                <h5 id="user-email">{currentUser ? currentUser.email : "email"}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardNav;