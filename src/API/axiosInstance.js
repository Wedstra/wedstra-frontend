import axios from "axios";

const axiosInstance = axios.create({
    // baseURL:"http://localhost:8443",
    baseURL:"https://wedstra-backend.onrender.com",
    headers:{
        "Content-Type":"application/json"
    },
});

export default axiosInstance;