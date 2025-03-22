import axiosInstance from "../axiosInstance";

export const fetchCategories = async () => {
    try {
        const response = await axiosInstance.get("/resources/categories");
        return response.data; // Returns the states array
    } catch (error) {
        console.error("Error fetching states:", error);
        return []; // Return empty array on failure
    }
};
