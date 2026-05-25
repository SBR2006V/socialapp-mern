import axios from "axios";

const API = axios.create({
  baseURL: "https://socialapp-backend-acv1.onrender.com/",
});

export default API;
