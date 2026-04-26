import axios from "axios";

const API = "http://localhost:5000/api";

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