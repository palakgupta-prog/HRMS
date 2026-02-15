import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://hrms-backend-pzf6.onrender.com"
});

export default API;
