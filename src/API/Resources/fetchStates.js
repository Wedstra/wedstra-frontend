import axios from "axios";

const API_URL = "https://countriesnow.space/api/v0.1/countries/states"; // Replace with actual API URL

export const fetchStates = async () => {
    try {
        const response = await axios.post(API_URL, {
            "country": "india"
        });
        if (response.data.error === false) {
            return response.data.data.states; // Returns the states array
        } else {
            return []; // Return empty array if API has an error
        }
    } catch (error) {
        console.error("Error fetching states:", error);
        return []; // Return empty array on failure
    }
};
