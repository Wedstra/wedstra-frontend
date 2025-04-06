import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, IconButton, Divider, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { MdArrowDropDown } from "react-icons/md";
import "./navbar.css";
import logo from "../../images/wedstra_logo.png";
const Navbar = ({ token, userRole, setToken, setUserRole }) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
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
            <li className="nav-item">
              <Link className={isActive("/services")} to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/vendor-list")} to="/vendor-list">Vendors</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/vendors")} to="/vendors">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/vendors")} to="/vendors">About us</Link>
            </li>

            {!token && (
              <>
                <li className="nav-item">
                  <Link className={isActive("/vendor-login")} to="/vendor-login">Vendor Login</Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/vendor-register")} to="/vendor-register">Vendor Registration</Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/user-login")} to="/user-login">User Login</Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/user-register")} to="/user-register">User Registration</Link>
                </li>
              </>
            )}

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

          </ul>

          {token ? (
            <div >
              <IconButton onClick={handleMenuOpen} id="dropdown-button">
                <Avatar
                  style={{ width:"35px", height:"35px" }}
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
                <MenuItem component={Link} to="/profile">Profile</MenuItem>
                <MenuItem component={Link} to="/settings">Settings</MenuItem>

                <Divider /> {/* Separates options from logout */}

                <MenuItem onClick={handleLogout} style={{ color: "red", fontWeight: "bold" }}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <span className="nav-item">
              <Link className={isActive("/vendor-register")} to="/vendor-register">
                Are you a Vendor?
              </Link>
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
