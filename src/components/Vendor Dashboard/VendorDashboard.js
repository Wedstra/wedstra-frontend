import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import "./vendorDashboard.css";
import axiosInstance from "../../API/axiosInstance";
import create_service from "../../images/create_service.png";
import { FaStar, FaTrash, FaEdit, FaEye, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import ServiceForm from '../Create Service/ServiceForm';
import useAuthCheck from "../../Auth/useAuthCheck";
import DashboardNav from './Dashboard Navbar/DashboardNav';
import DashboardEvents from './Dashboard Events/DashboardEvents';
import VendorServices from './Dashboard Services/VendorServices';


export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vendorServices, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  useAuthCheck();
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    console.log(JSON.stringify(currentUser));
  }, [])

  useEffect(() => {
    const fetchServices = async () => {
      if (currentUser && currentUser.id) {
        const token = localStorage.getItem("token");
        try {
          const response = await axiosInstance.get(
            `/service/${currentUser.id}/all`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setServices(response.data)
          console.log("Response:", JSON.stringify(vendorServices));
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchServices();
  }, [currentUser]); // Runs whenever currentUser changes

  const loadComponents = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard currentUser={currentUser} />;
      case "services":
        return <VendorServices vendorServices={vendorServices} setVendorServices={setServices} />;
      case "events":
        return <DashboardEvents />;
      case "analysis":
        return <div>Analyatics</div>;
      case "profile":
        return <div>profile</div>;
      case "createService":
        return <ServiceForm />;
      default:
        return <Dashboard />;
    }
  }
  return (
    <div id="main-dashboard-div" className="d-flex">
      {/* Sidebar (Hidden on Mobile, Visible on Tablet & Larger Screens) */}
      <div className="sidebar-container d-none d-md-block">
        <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} />
      </div>

      {/* Main Content (Always Visible) */}
      <div className="dashboard-content flex-grow-1 p-3">
        {loadComponents()}
      </div>
    </div>


  )
}

function Dashboard({ currentUser }) {
  return (
    <div className='dashboard-component'>
      <div className='user-details'>
        <h1 id="title">Welcome back, {currentUser ? currentUser.vendor_name : "Guest"}</h1>
        <h3 id="sub-title">your are logged in as <span>{currentUser ? currentUser.business_name : "No-Business"}</span></h3>
      </div>
      <div id='important-msg'>
      </div>
      <div class="text-center">
        <div class="row">
          <div class="col-lg-4 col-mg-6 col-sm-6">
            <button className='content-button' to="/create-service">
              <Link id='link' to="/create-service">
                <section className='button-section'>
                  <section className='button-img-section'>
                    <img className='button-img' src={create_service} />
                  </section>
                  <section className='button-text'>
                    <h3>Create Services</h3>
                  </section>
                </section>
              </Link>
            </button>
          </div>
          <div class="col-lg-4 col-mg-6 col-sm-6">
            <button className='content-button' to="/create-service">
              <Link id='link' to="/create-service">
                <section className='button-section'>
                  <section className='button-img-section'>
                    <img className='button-img' src={create_service} />
                  </section>
                  <section className='button-text'>
                    <h3>Update Services</h3>
                  </section>
                </section>
              </Link>
            </button>
          </div>
          <div class="col-lg-4 col-mg-6 col-sm-6">
            <button className='content-button' to="/create-service">
              <Link id='link' to="/create-service">
                <section className='button-section'>
                  <section className='button-img-section'>
                    <img className='button-img' src={create_service} />
                  </section>
                  <section className='button-text'>
                    <h3>Create Services</h3>
                  </section>
                </section>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

