import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ token, userRole, setToken, setUserRole }) => {
  const location = useLocation(); // ✅ Get current route
  const navigate = useNavigate();

  useEffect(() => {
    console.log("From navbar", token);
  }, [token, userRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUserRole(null);
    setToken(null);
    navigate("/vendor-login");
  };

  // ✅ Function to add "active" class dynamically
  const isActive = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar navbar-expand-lg" id="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">MyApp</Link>

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

            {!token && (
              <>
                <li className="nav-item">
                  <Link className={isActive("/vendor-login")} to="/vendor-login">Vendor Login</Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive("/vendor-register")} to="/vendor-register">Vendor Registration</Link>
                </li>
              </>
            )}

            {token && userRole === "VENDOR" && (
              <li className="nav-item">
                <Link className={isActive("/vendor-dashboard")} to="/vendor-dashboard">Vendor Dashboard</Link>
              </li>
            )}
          </ul>

          {token ? (
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
            <span className="nav-item">
                  <Link className={isActive("/vendor-register")} to="/vendor-register">Are you a Vendor?</Link>
                </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
