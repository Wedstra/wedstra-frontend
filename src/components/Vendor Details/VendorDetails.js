import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import './vendorDetails.css';
import ChatRoom from "../ChatRoom/ChatRoom";
import { getCurrentUser } from "../../Auth/UserServices";
import useAuthCheck from "../../Auth/useAuthCheck";

export default function VendorDetails() {
    const [vendor, setVendor] = useState(null);
    const [user, setUser] = useState(null);
    const { vendor_id } = useParams();

    useAuthCheck();

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                const response = await axiosInstance.get(`/vendor/getVendorById/${vendor_id}`);
                if (response.status === 200) {
                    setVendor(response.data);
                } else {
                    console.error("Failed to fetch vendor details:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching vendor details:", error);
            }
        };

        const fetchCurrentLoggedInUser = async () => {
            try {
                const currUser = await getCurrentUser();
                if (currUser) {
                    setUser(currUser);
                } else {
                    console.warn("No user data received");
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchVendorDetails();
        fetchCurrentLoggedInUser();
    }, [vendor_id]);  

    if (!vendor || !user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1 className="text-center">Vendor Details: {vendor_id}</h1>
            <ChatRoom vendor={vendor} user={user} />
        </div>
    );
}
