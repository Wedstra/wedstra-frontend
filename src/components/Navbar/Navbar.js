import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, IconButton, Divider, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { MdArrowDropDown } from "react-icons/md";
import { fetchCategories } from '../../API/Resources/fetchCategories';
import "./navbar.css";
import logo from "../../images/wedstra_logo.png";
const Navbar = ({ token, userRole, setToken, setUserRole }) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchUsername = () => {
      if (!token) return null;

      try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;
        setUser(username);
        // console.log("From navbar", token + "    userRole " + userRole + "| username " + username);
      }
      catch (e) {
        console.error(e);
      }
    }

    fetchUsername();
  }, [token, userRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role")
    setUserRole(null);
    setToken(null);
    navigate("/home");
  };

  const isActive = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  useEffect(() => {
    const fetchCategory = async () => {
      const cat = await fetchCategories();
      setCategories(cat)
    }


    fetchCategory()
  }, []);

  const toggleSubmenu = (index) => {
    setOpenStateIndex(openStateIndex === index ? null : index);
  };


  const openCategory = () => {

  }
  return (
    <nav className="navbar navbar-expand-lg" id="navbar">
      <div className="container">
        <a class="navbar-brand m-0 p-0" href="#">
          <img src={logo} alt="Bootstrap" width="60" />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={isActive("/")} to="/">Home</Link>
            </li>

            {(!token || userRole === "USER") && (
              <>
                <li className="nav-item">
                  <div className="dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Vendors
                    </Link>

                    <ul className="dropdown-menu">
                      {categories.map((category) => (
                        <option className="py-1 px-3" id="category-option" key={category.id} value={category.category_name} onClick={openCategory} >
                          {category.category_name}
                        </option>
                      ))}
                    </ul>
                  </div>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className={isActive("/plans")} to="/plans">Services</Link>
            </li>

            {token && userRole === "VENDOR" && (
              <li className="nav-item">
                <Link className={isActive("/vendor-dashboard")} to="/vendor-dashboard">Vendor Dashboard</Link>
              </li>
            )}

            {token && userRole === "ADMIN" && (
              <li className="nav-item">
                <Link className={isActive("/admin-dashboard")} to="/admin-dashboard">Admin Dashboard</Link>
              </li>
            )}

            {token && (userRole === "USER" || userRole === "VENDOR") && (
              <li className="nav-item">
                <Link className={isActive("/blogs")} to="/blogs">
                  Blogs
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className={isActive("/vendors")} to="/vendors">About us</Link>
            </li>

          </ul>

          {token ? (
            <div >
              <IconButton onClick={handleMenuOpen} id="dropdown-button">
                <Avatar
                  style={{ width: "35px", height: "35px" }}
                  sx={{ bgcolor: "#CB0033", color: "#fff", fontSize: "1.2rem", fontWeight: "bold" }}
                  alt={user}
                >
                  {user ? user.charAt(0).toUpperCase() : "U"}
                </Avatar>

                <h4 id="username">{user}</h4>
                <MdArrowDropDown size={24} />
              </IconButton>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <Divider /> {/* Separates username from links */}

                {/* Profile & Settings */}
                <MenuItem component={Link} to="/tasks">Tasks</MenuItem>
                <MenuItem component={Link} to="/profile">Profile</MenuItem>

                <Divider /> {/* Separates options from logout */}

                <MenuItem onClick={handleLogout} style={{ color: "red", fontWeight: "bold" }}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <section className="login-section">
              <span className="nav-item">
                <Link className={isActive("/vendor-login")} to="/vendor-login" id="are-you-vendor">Are you a vendor?</Link>
              </span>

              <section id="login-buttons">
                <button className="btn" id="login-btn"><Link className={isActive("/user-login")} to="/user-login">
                  Login
                </Link>
                </button>
                <button className="btn" id="signup-btn"> <Link className={isActive("/user-register")} to="/user-register">
                  Sign up
                </Link>
                </button>
              </section>
            </section>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
