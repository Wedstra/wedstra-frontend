import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ChatRoom from "../ChatRoom/ChatRoom";
import { getCurrentUser } from "../../Auth/UserServices";
import useAuthCheck from "../../Auth/useAuthCheck";
import { FaStar, FaTrash, FaEdit, FaEye, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import "./vendorDetails.css";

export default function VendorDetails() {
  const [vendor, setVendor] = useState(null);
  const [user, setUser] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [token, setToken] = useState(null);
  const { vendor_id } = useParams();
  const navigate = useNavigate();

  useAuthCheck();


  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }

    fetchToken();
  }, [])

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axiosInstance.get(`/vendor/getVendorById/${vendor_id}`);
        if (response.status === 200) {
          setVendor(response.data);
        }
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
    };

    const fetchCurrentLoggedInUser = async () => {
      try {
        const currUser = await getCurrentUser();
        if (currUser) setUser(currUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchServicesByVendor = async () => {
      try {
        const response = await axiosInstance.get(`/service/${vendor_id}/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setVendorServices(response.data);
          console.warn(response.data);

        }
      } catch (error) {
        console.error("Error fetching vendor services:", error);
      }
    }

    fetchVendorDetails();
    fetchCurrentLoggedInUser();
    fetchServicesByVendor();
  }, [vendor_id, token]);

  if (!vendor || !user) return <p className="text-center p-10">Loading...</p>;

  const services = vendor.services || [];
  const testimonials = vendor.testimonials || [
    "“Amazing experience!” – Client A",
    "“Top-notch service!” – Client B",
  ];

  return (
    <>
      <div id="vendor-details-page">
        <div className="container" id="vendor-details-container">
          <section className="vendor-identity-section">
            <h1>{vendor.business_name}</h1>
            <h3>By <span>{vendor.vendor_name}</span></h3>
          </section>
        </div>
      </div>
      <div className="container" id="vendor-details-section">
        <section className="vendor-details">
          <h3 id="spotlight-title">Vendor Spotlight</h3>
          <div class="row">
            <div class="col-md-6 mb-4" id="carousel-col">
              <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={4000}
                className="shadow rounded react-carousel"
              >
                <div>
                  <img id="caro-img" src="https://images.pexels.com/photos/36744/agriculture-arable-clouds-countryside.jpg?cs=srgb&dl=pexels-pixabay-36744.jpg&fm=jpg" alt="Slide 1" />
                  <p className="legend">Beautiful Nature</p>
                </div>
                <div>
                  <img id="caro-img" src="https://source.unsplash.com/800x400/?city,night" alt="Slide 2" />
                  <p className="legend">City Lights</p>
                </div>
                <div>
                  <img id="caro-img" src="https://source.unsplash.com/800x400/?mountains" alt="Slide 3" />
                  <p className="legend">Mountain View</p>
                </div>
              </Carousel>
            </div>
            <div class="col-md-6 mb-4" id="vendor-info-col">
              <div class="p-4 bg-light rounded shadow-sm">
                <h3 id="info-title">About vendor</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                <h4 id="vendor-info"><strong>Location: </strong>{ vendor.city }</h4>
                {/* <h4><strong>💰 Price Range:</strong> ₹{  } - ₹25,000</h4> */}
                <h4 id="vendor-info"><strong>Category:</strong> { vendor.business_category }</h4>
                <h4 id="vendor-info"><strong>GST No:</strong> { vendor.gst_number }</h4>
                <h4 id="vendor-info"><strong>Ratings:</strong>
                  <span class="text-warning">
                    ★★★★☆
                  </span>
                  (4.2 ★)
                </h4>

                <h3 className="mt-4" id="info-title">Terms & conditions</h3>
                <p>{ vendor.terms_and_conditions }</p>
              </div>
            </div>

          </div>

          <section className="mb-5" id="vendor-services">
            <h3 id="service-title">Services</h3>
            <div className='row' id='card-deck'>
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
                          <button className="btn btn-primary w-100" onClick={() => navigate("/service-details")}>
                            <FaEye className="me-1" /> View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))) : () => { <p className="text-center text-muted">No services available.</p> }}
            </div>
          </section>
        </section>
      </div>
      {/* Chat Room */}
      <ChatRoom vendor={vendor} user={user} />
    </>
  );
}
