import axiosInstance from "../axiosInstance";

export const fetchCities = async (state) => {
    try {
        const response = await axiosInstance.get(`/location/cities?state=${ state }`);

        if(response.status === 200){
            return response.data;
        }
        else{
            return [];
        }
        // const response = await axios.post(API_URL, {
        //     "country": "india"
        // });
        // if (response.data.error === false) {
        //     return response.data.data.states; // Returns the states array
        // } else {
        //     return []; // Return empty array if API has an error
        // }
    } catch (error) {
        console.error("Error fetching states:", error);
        return []; // Return empty array on failure
    }
};