import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    if (!token) return true; // If no token, consider it expired
  
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return true; // If no expiry, consider it expired
  
      const currentTime = Date.now() / 1000; // Convert to seconds
      return exp < currentTime; // Returns true if expired, false if still valid
    } catch (error) {
      return true; // If decoding fails, assume token is invalid/expired
    }
  };