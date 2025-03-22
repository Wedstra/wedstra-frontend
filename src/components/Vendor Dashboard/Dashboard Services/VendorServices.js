import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import "./vendorServices.css";
import axiosInstance from "../../../API/axiosInstance";
import { FaStar, FaTrash, FaEdit, FaEye, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import useAuthCheck from "../../../Auth/useAuthCheck";
import { fetchStates } from '../../../API/Resources/fetchStates';
import { fetchCategories } from '../../../API/Resources/fetchCategories';
import { IoEllipseSharp } from 'react-icons/io5';


const VendorServices = ({ vendorServices, setVendorServices }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [API_URL, setAPI_URL] = useState("");
  const navigate = useNavigate();
  useAuthCheck();

  useEffect(() => {
    const getStates = async () => {
      const stateList = await fetchStates();
      setStates(stateList);
    };

    const getCategories = async () => {
      const categoryList = await fetchCategories();
      setCategories(categoryList);
    }
    getStates();
    getCategories();
  }, []);

  const handleLocationChange = async (event) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);

    console.log("Selected Location:", newLocation);
    console.log("Token:", token);

    try {
      const response = await axiosInstance.get(`/service/by-location/${newLocation}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredServices = response.data;
      setVendorServices(filteredServices);
      console.log("Services by location:", response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleFilterChange = (filterType, event) => {
    const token = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const value = event.target.value;

    if (filterType === "location") {
      setSelectedLocation(value);
    } else if (filterType === "category") {
      setSelectedCategory(value);
    }
  }

  const loadURL = async (location, category) => {
    console.log("Selected Location (after state update):", location); // This will now always be the latest value
    console.log("Selected Category (after state update):", category);

    if (location !== "all" && category !== "all") {
      // Services sorted by both location and category
      setAPI_URL(`/service/by-vendor/${currentUser.id}/by-location/${location}/by-category/${category}`);
    }

    if (location !== "all") {
      if (category === "all") {
        // Services sorted by location only
        setAPI_URL(`/service/by-vendor/${currentUser.id}/by-location/${location}`);
      }
      else if (category !== "all") {
        // Services sorted by both location and category
        setAPI_URL(`/service/by-vendor/${currentUser.id}/by-location/${location}/by-category/${category}`);

      }
    }

    console.log("Updated API URL:", API_URL);
  }

  const handleDeleteService = (serviceId) => async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.delete(`/service/${serviceId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Service Deleted:", response.data);
      // Update the UI
      setVendorServices(vendorServices.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  }

  const handleFilterService = () => {
    console.log(`${selectedCategory}   ${selectedLocation}`);
    
    if (selectedCategory === "all" && selectedLocation !== "all") {
        // Handle case where category is 'all' but location is specified
    } else if (selectedCategory !== "all" && selectedLocation === "all") {
        // Handle case where location is 'all' but category is specified
    } else if (selectedCategory === "all" && selectedLocation === "all") {
        // Handle case where both category and location are 'all'
    } else {
        // Handle case where both category and location are specified
    }
}
  return (
    <div className="container-fluid ">
      <h1 className="text-center my-2"><b>Available Services</b></h1>

      <div className='filer-services-div'>
        <div class="row mb-1" id='filter-row'>
          <div class="col-md-5" id='location-filter'>
            <label class="form-label">Filter by Location:</label>
            <select class="form-select" id="locationFilter" onChange={(e) => handleFilterChange("location", e)}>
              <option value="All">All Locations</option>
              {states.map((state) => (
                <option key={state.state_code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div class="col-md-5" id='category-filter'>
            <label class="form-label">Filter by Category:</label>
            <select class="form-select" id="categoryFilter" onChange={(e) => handleFilterChange("category", e)}>
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end" id='find-services'>
            <button class="btn btn-primary w-100" onClick={ handleFilterService }>
              Find Services
            </button>
          </div>
        </div>

      </div>
      <div className='row g-3' id='card-deck'>
        {vendorServices && vendorServices.length > 0 ? (
          vendorServices.map((service, index) => (
            <div className='col-12 col-md-6 col-lg-4' id='service-col'>
              <div key={service.id || index} className="card service-card" >


                <span className="badge text-bg-warning service-badge m-2 px-3 py-2">
                  {service.category}
                </span>

                <div className="service-image position-relative">
                  <img
                    src={service.images && service.images.length > 0 ? service.images[0] : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                    alt={service.service_name}
                    className="card-img-top rounded-top"
                  />
                </div>


                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{service.service_name}</h5>
                  <p className="card-text text-muted small" id='description'>{service.description}</p>


                  <p className="price text-dark fw-semibold fs-5">
                    <FaRupeeSign className="text-success" /> {service.min_price} - <FaRupeeSign className="text-success" /> {service.max_price}
                  </p>


                  <div className="d-flex align-items-center text-muted fs-6">
                    <FaStar className="text-warning" />
                    <span className="ms-1">{service.ratings ? service.ratings.toFixed(1) : "N/A"}</span>
                    <span className="ms-2">({service.reviews ? service.reviews.length : 0} reviews)</span>
                  </div>


                  <p className="location text-muted fs-6 d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1 text-danger" /> {service.location}
                  </p>


                  <p className="text-muted small">
                    Created: {new Date(service.created_at).toLocaleDateString()}
                  </p>


                  <div className="mt-auto d-flex justify-content-between gap-2">
                    <button className="btn btn-danger w-100" onClick={
                      handleDeleteService(service._id)
                    }>
                      <FaTrash className="me-1" /> Delete
                    </button>
                    <button className="btn btn-primary w-100" onClick={() => navigate("/service-details")}>
                      <FaEye className="me-1" /> View
                    </button>
                    <button className="btn btn-success w-100">
                      <FaEdit className="me-1" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))) : () => { <p className="text-center text-muted">No services available.</p> }}
      </div>
    </div>
  );
};

export default VendorServices;