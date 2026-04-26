import axios from "axios";

const API = "https://calling-crm-backend-1.onrender.com/api";

const instance = axios.create({
  baseURL: API,
});

/* 🔥 AUTO TOKEN ATTACH */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default instance;