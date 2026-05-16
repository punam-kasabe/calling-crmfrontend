import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";


axios.defaults.headers.common["Authorization"] =
  `Bearer ${localStorage.getItem("token")}`;
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);