import React, { use, useEffect, useState } from 'react'
import { getCurrentUser, findUserDetailsByUserName } from "../../Auth/UserServices";
import "./homepage.css";
import { fetchStates } from '../../API/Resources/fetchStates';
import { fetchCategories } from '../../API/Resources/fetchCategories';
import { fetchCities } from '../../API/Resources/fetchCities';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import images from "../../Resources/images";

import DisplayVendors from '../Vendor Display/DisplayVendors';
import { useNavigate } from 'react-router-dom';
import ReviewSection from '../Reviews/Reviews';

export default function Homepage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showServices, setShowServices] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setselectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const items = [
    { title: "Mehndi Artists", image: images.mehendi },
    { title: "Makeup", image: images.makeup },
    { title: "Photographers", image: images.photographers },
    { title: "Jewellery & Accessories", image: images.jewellery },
    { title: "Groom Wear", image: images.groomWear },
    { title: "Bridal Wear", image: images.bridalWear },
    { title: "Food", image: images.food },
    { title: "Florist", image: images.florist },
    { title: "Music & Dance", image: images.musicDance },
    { title: "Venue", image: images.venue },
    { title: "Decor & planning", image: images.decorPlan },
    { title: "Invites and gifts", image: images.inviteGifts },
  ];

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategory = async () => {
      const cat = await fetchCategories();
      setCategories(cat)
    }

    const fetchstates = async () => {
      const loc = await fetchStates();
      setStates(loc);
    }


    fetchCategory();
    fetchstates();

    const message = sessionStorage.getItem("message");
    if (message) {
      setOpen(true);
    }

  }, []);

  useEffect(() => {
    const getCitiesByState = async () => {
      if (selectedState) {
        try {
          const response = await fetchCities(selectedState);
          setCities(response); 
        } catch (error) {
          console.error("Error fetching cities:", error);
          setCities([]); 
        }
      } else {
        setCities([]); 
      }
    };

    getCitiesByState();
  }, [selectedState]);



  const handleChange = (name, event) => {
    const value = event.target.value;

    // console.log(value);

    if (name == "state") {
      setSelectedState(value);
    }

    if (name == "city") {
      setselectedCity(value);
    }

    if (name == "category") {
      setSelectedCategory(value);
    }

  }

  const findVendors = () => {
    console.log("Selected city: " + selectedCity);
    console.log("Selected state: " + selectedState);
    console.log("Selected category: " + selectedCategory);
    setShowServices(true);
  }

  const openVendorByCategory = (category) => {
    console.log(category);
    setSelectedCategory(category);
    setShowServices(true);
  }
  return (
    <>
      {!showServices ? (
        <>
          <div class="container-fluid p-0">
            <div id="vendor-search">
              <h1 id="title">Start Planning Your Dream Wedding Today!</h1>
              <h3 id="sub-title">Let Us Handle the Details for You.</h3>

              <div id="vendor-filter">

                <div class="container text-center">
                  <div className="row" style={{ height: "max-content", width: "100%" }}>
                    {/* State Dropdown */}
                    <div className={selectedState ? 'col-md-4 m-0' : 'col-md-5 m-0'} style={{ height: "max-content" }}>
                      <section id="location-select-section">
                        <img src={images.locationLogo} id="location-icon" />
                        <select
                          className="form-select form-select-lg"
                          aria-label="Large select example"
                          id="location-select"
                          onChange={(e) => handleChange("state", e)}
                        >
                          <option value="">Select a State</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </section>
                    </div>

                    {/* City Dropdown */}
                    {selectedState && (
                      <div className={'col-md-4 m-0'} style={{ height: "max-content" }}>
                        <section id="location-select-section">
                          <img src={images.cityLogo} id="location-icon" />
                          <select
                            className="form-select form-select-lg"
                            aria-label="Large select example"
                            id="city-select"
                            onChange={(e) => handleChange("city", e)}
                            disabled={!cities.length} // disable when no cities
                          >
                            <option value="">Select a City</option>
                            {cities.map((city, index) => (
                              <option key={index} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </section>
                      </div>
                    )}

                    {/* Category Dropdown */}
                    <div className={selectedState ? 'col-md-4 m-0' : 'col-md-5 m-0'} style={{ height: "max-content" }}>
                      <section id="location-select-section">
                        <img src={images.vendorLogo} id="location-icon" />
                        <select
                          className="form-select form-select-lg"
                          aria-label="Large select example"
                          id="category-select"
                          onChange={(e) => handleChange("category", e)}
                        >
                          <option value="">Select a Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.category_name}>
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      </section>
                    </div>

                    {/* Button */}
                    <div className={selectedState ? 'col-md-12 mt-3 d-flex justify-content-center' : 'col-md-2 m-0'}>
                      <button
                        type="button"
                        id="find-vendor-btn"
                        className="btn btn-lg"
                        onClick={findVendors}
                      >
                        <section>
                          <span style={{ paddingTop: "2px" }}>Find Vendor </span>
                          <img src={images.rightArrow} style={{ height: "27px", paddingBottom: "2px" }} />
                        </section>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* Categories */}
          <div class="container-fluid" id='categories-container'>
            <h3 id="category-title">Plan Your Wedding with the Best</h3>
            {[0, 6].map((startIndex, rowIndex) => (
              <div key={rowIndex} className="row" style={{ height: "max-content" }}>
                {items.slice(startIndex, startIndex + 6).map((item, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg-2 d-flex flex-column align-items-center" style={{ height: "max-content" }}>
                    <img src={item.image} alt={item.title} style={{ width: "90%" }} id='category-image-avatar' onClick={() => openVendorByCategory(item.title)}
                    />
                    <p className="text-center mt-2" id='categort-name'>{item.title}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Featured Vendors */}
          <div id='featured-vendors-container' className='mt-4'>
            <h3 id='feature-vendor-title'>Featuring Vendors</h3>
            <div className="row mb-4" style={{ height: "max-content" }}>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card" id='featured-vendor-card'>
                  <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" class="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn learn-more-btn">Learn More</a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card" >
                  <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn learn-more-btn">Learn More</a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card" >
                  <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn learn-more-btn">Learn More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusive Offers */}
          <div id='exclusive-offers-container'>
            <h3 id='exclusive-offer-title'>Exclusive Wedding Deals</h3>
            <div className="exclusive-offer-cards">
              <div className='exclusive-card special-offer'>
                <img className="group" alt="Group" src={images.specialOffer} />
                <h3>Videography plan</h3>
                <p className="discount-line">
                  up to <span className="highlight">30% off</span>
                </p>

                <ul className="features-list">
                  <li>Candid shots.</li>
                  <li>cinematic wedding films.</li>
                  <li>Short Videos.</li>
                  <li>Photo Book</li>
                </ul>

                <button className="learn-btn">Learn more</button>
              </div>

              <div className='exclusive-card special-offer'>
                <img className="group" alt="Group" src={images.specialOffer} />
                <h3>Photography plan</h3>
                <p className="discount-line">
                  up to <span className="highlight">30% off</span>
                </p>
                <ul className="features-list">
                  <li>Candid shots.</li>
                  <li>cinematic wedding films.</li>
                  <li>Short Videos.</li>
                  <li>Photo Book</li>
                </ul>
                <button className="learn-btn">Learn more</button>
              </div>

              <div className='exclusive-card special-offer'>
                <img className="group" alt="Group" src={images.specialOffer} />
                <h3>Food plan</h3>
                <p className="discount-line">
                  up to <span className="highlight">30% off</span>
                </p>

                <ul className="features-list">
                  <li>Candid shots.</li>
                  <li>cinematic wedding films.</li>
                  <li>Short Videos.</li>
                  <li>Photo Book</li>
                </ul>

                <button className="learn-btn">Learn more</button>
              </div>
            </div>
          </div>

          {/* Review Continer */}
          <div id='reviews-container'>
            <h1 className='exclusive-offer-title'>Testimonials</h1>
              <ReviewSection/>
          </div>
          {/* Process */}
          <div id='process-container'>
            <h3 id='process-title'>Effortless Wedding Planning</h3>
            <div className='row g-2'>
              <div className="col-xl-3 col-lg-6 col-md-6 col-12" id='process-block'>
                <div className='process-1'>
                  <section id='icon_no'>
                    <img id='icon' src={images.process1} />
                    <h1>01</h1>
                  </section>
                  <section id='title'>
                    <span>Discover & Dream</span>
                  </section>
                  <section id='description-container'>
                    <span id='desc'>Browse themes, inspirations, and services tailored to your wedding style.</span>
                  </section>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-12 " id='process-block'>
                <div className='process-1'>
                  <section id='icon_no'>
                    <img id='icon' src={images.process2} />
                    <h1>02</h1>
                  </section>
                  <section id='title'>
                    <span>Connect with Vendors</span>
                  </section>
                  <section id='description-container'>
                    <span id='desc'>Browse themes, inspirations, and services tailored to your wedding style.</span>
                  </section>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-12 " id='process-block'>
                <div className='process-1'>
                  <section id='icon_no'>
                    <img id='icon' src={images.process3} />
                    <h1>03</h1>
                  </section>
                  <section id='title'>
                    <span>Book Your Services</span>
                  </section>
                  <section id='description-container'>
                    <span id='desc'>Browse themes, inspirations, and services tailored to your wedding style.</span>
                  </section>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6 col-12 " id='process-block'>
                <div className='process-1'>
                  <section id='icon_no'>
                    <img id='icon' src={images.process4} />
                    <h1>04</h1>
                  </section>
                  <section id='title'>
                    <span>Celebrate the Big Day</span>
                  </section>
                  <section id='description-container'>
                    <span id='desc'>Browse themes, inspirations, and services tailored to your wedding style.</span>
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div>
            <footer className="py-5">
              <div className="container-fluid">
                <div className="row gy-4" style={{ height: "max-content" }}>
                  {/* Logo & Copyright */}
                  <div className="col-12 col-md-4 text-center text-md-start">
                    <img src={images.logo} alt="Logo" style={{ height: "100px" }} />
                    <p className="mt-3">© 2025 Your Company. All rights reserved.</p>
                  </div>

                  {/* Navigation Links */}
                  <div className="col-6 col-md-2">
                    <h5>Company</h5>
                    <ul className="list-unstyled">
                      <li><a href="#" className="footer-link">About</a></li>
                      <li><a href="#" className="footer-link">Careers</a></li>
                      <li><a href="#" className="footer-link">Blog</a></li>
                      <li><a href="#" className="footer-link">Contact</a></li>
                    </ul>
                  </div>

                  <div className="col-6 col-md-2">
                    <h5>Support</h5>
                    <ul className="list-unstyled">
                      <li><a href="#" className="footer-link">Help Center</a></li>
                      <li><a href="#" className="footer-link">FAQs</a></li>
                      <li><a href="#" className="footer-link">Privacy Policy</a></li>
                      <li><a href="#" className="footer-link">Terms of Use</a></li>
                    </ul>
                  </div>

                  <div className="col-6 col-md-2">
                    <h5>Services</h5>
                    <ul className="list-unstyled">
                      <li><a href="#" className="footer-link">Pricing</a></li>
                      <li><a href="#" className="footer-link">Features</a></li>
                      <li><a href="#" className="footer-link">Integration</a></li>
                      <li><a href="#" className="footer-link">Partners</a></li>
                    </ul>
                  </div>

                  {/* Social Media */}
                  <div className="col-12 col-md-2 text-center text-md-end">
                    <h5>Follow Us</h5>
                    <div className="d-flex justify-content-center justify-content-md-end gap-3 mt-2">
                      <a href="#" className="social-icon"><FaFacebook /></a>
                      <a href="#" className="social-icon"><FaTwitter /></a>
                      <a href="#" className="social-icon"><FaInstagram /></a>
                      <a href="#" className="social-icon"><FaLinkedin /></a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </>
      ) : (
        <>
          <DisplayVendors category={selectedCategory} location={selectedCity} goBack={() => setShowServices(false)} setCategory={setSelectedCategory} setLocation={setselectedCity} setState={ setSelectedState } />
        </>
      )}
    </>
  )
}
