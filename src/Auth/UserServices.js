import { jwtDecode } from "jwt-decode";
import axiosInstance from "../API/axiosInstance";

export const getCurrentVendor = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    const username =  decodedToken.sub; // Assuming 'sub' contains the username

    const response = await axiosInstance.get(`/vendor/getVendorByUsername/${ username }`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;

  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};


export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    const username =  decodedToken.sub; // Assuming 'sub' contains the username

    const response = await axiosInstance.get(`/user/get-user/${ username }`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;

  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}