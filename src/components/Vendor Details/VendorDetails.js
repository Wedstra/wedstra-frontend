import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import { FaStar, FaEye, FaRupeeSign, FaMapMarkerAlt } from "react-icons/fa";
import { getCurrentUser } from "../../Auth/UserServices";
import useAuthCheck from "../../Auth/useAuthCheck";
import ChatRoom from "../ChatRoom/ChatRoom";
import ImageGallery from "./Image Gallery/ImageGallery";
import "./vendorDetails.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function VendorDetails() {
  const [vendor, setVendor] = useState(null);
  const [user, setUser] = useState(null);
  const [vendorServices, setVendorServices] = useState([]);
  const [token, setToken] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(null);
  // const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 0,
    userId: "",
    username: "",
    vendorId:""
  });



  const { vendor_id } = useParams();
  const navigate = useNavigate();

  useAuthCheck();

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchVendorDetails = async () => {
      try {
        const res = await axiosInstance.get(`/vendor/getVendorById/${vendor_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setVendor(res.data);
      } catch (err) {
        console.error("Error fetching vendor:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const currUser = await getCurrentUser();
        if (currUser) setUser(currUser);
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get(`/service/${vendor_id}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) setVendorServices(res.data);
      } catch (err) {
        console.error("Service fetch failed:", err);
      }
    };

    fetchVendorDetails();
    fetchUser();
    fetchServices();
  }, [vendor_id, token]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        `/vendor/review/${vendor_id}`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRating(0);
      setComment("");
      const res = await axiosInstance.get(`/vendor/getVendorById/${vendor_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) setVendor(res.data);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (!vendor || !user) return <p className="text-center p-10">Loading...</p>;


  //review functions
  const createReview = async (e) => {
    e.preventDefault();
    formData.userId = user.id;
    formData.vendorId = vendor.id;
    formData.username = user.username;
    console.log("Submitting review:", formData);


    const response = await axiosInstance.post('/reviews', formData, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.data) {
      console.log('Review added..!');
    }
    else {
      console.log('Error adding review ..!');
    }

    // Reset form
    setFormData({
      title: "",
      content: "",
      rating: 0,
    });
    setHover(null);
    setRating(0);
  };


  const handleReviewChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRating = (value) => {
    setRating(value);
    onRatingChange(value);
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }));
  };


  const onRatingChange = () => {
  }


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
          <div className="row">
            <div className="col-md-6 mb-4" id="carousel-col">
              {vendor.business_photos?.length > 0 ? (
                <ImageGallery photos={vendor.business_photos} />
              ) : (
                <img src="/fallback.jpg" alt="Fallback" className="img-fluid" />
              )}
            </div>
            <div className="col-md-6 mb-4" id="vendor-info-col">
              <div className="p-4 bg-light rounded shadow-sm">
                <h3 id="info-title">About vendor</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                <h4><strong>Location:</strong> {vendor.city}</h4>
                <h4><strong>Category:</strong> {vendor.business_category}</h4>
                <h4><strong>GST No:</strong> {vendor.gst_number}</h4>
                <h4><strong>Ratings:</strong>
                  <span className="text-warning">★★★★☆</span> (4.2 ★)
                </h4>
                <h3 className="mt-4" id="info-title">Terms & Conditions</h3>
                <p>{vendor.terms_and_conditions}</p>
              </div>
            </div>
          </div>

          <section className="mb-5" id="vendor-services">
            <h3 id="service-title">Services</h3>
            <div className="row" id="card-deck">
              {vendorServices.length > 0 ? (
                vendorServices.map((service, index) => (
                  <div className="col-12 col-md-6 col-lg-4" key={index} id="service-col">
                    <div className="card service-card">
                      <span className="badge text-bg-warning m-2 px-3 py-2">{service.category}</span>
                      <div className="service-image position-relative">
                        <img
                          src={service.images?.[0] || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                          alt={service.service_name}
                          className="card-img-top rounded-top"
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold">{service.service_name}</h5>
                        <p className="card-text text-muted small">{service.description}</p>
                        <p className="price text-dark fw-semibold fs-5">
                          <FaRupeeSign className="text-success" /> {service.min_price} - {service.max_price}
                        </p>
                        <div className="d-flex align-items-center text-muted fs-6">
                          <FaStar className="text-warning" />
                          <span className="ms-1">{service.ratings?.toFixed(1) || "N/A"}</span>
                          <span className="ms-2">({service.reviews?.length || 0} reviews)</span>
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
                ))
              ) : (
                <div className="col-12">
                  <p className="text-center text-muted">No services available.</p>
                </div>
              )}
            </div>
          </section>

          {/* Review Form */}
          <h5 className="mb-3">Write a Review</h5>
          <section className="review-form">
            <form onSubmit={createReview}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Review title</label>
                <input
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="Review title..."
                  value={formData.title}
                  onChange={handleReviewChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="content" className="form-label">Your Review</label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows="3"
                  placeholder="Share your thoughts..."
                  value={formData.content}
                  onChange={handleReviewChange}
                />
              </div>

              <div className="star-review mb-3">
                <h6>Rate your experience:</h6>
                <div className="stars d-flex gap-1">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={ratingValue}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => handleRating(ratingValue)}
                          hidden
                        />
                        <FaStar
                          className="star"
                          color={ratingValue <= (hover || formData.rating) ? '#ffc107' : '#e4e5e9'}
                          size={32}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {!user && <span className='text-primary'>Login required !</span>}
              <div className="d-flex justify-content-end">
                {user ? (<button type="submit" className="btn btn-primary btn-sm me-2" onClick={createReview}>Submit</button>) : <button type="submit" className="btn btn-primary btn-sm me-2" disabled>Submit</button>}
              </div>
            </form>
          </section>
        </section>
      </div>

      {/* Chat Room */}
      <ChatRoom vendor={vendor} user={user} />
    </>
  );
}
