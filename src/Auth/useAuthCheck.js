import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../Auth/tokenServices"; // Ensure correct path

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      console.log("Token expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");// Clear token
      navigate("/vendor-login"); // Redirect to login page
    }
  }, [navigate]);
};

export default useAuthCheck;
