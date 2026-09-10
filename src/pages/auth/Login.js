// FILE: src/pages/auth/Login.js

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../styles/login.css";

const API = "https://calling-crm-backend-7w52.onrender.com/api";

// Login API timeout
// Render cold start मुळे पहिली request थोडी slow होऊ शकते.
const LOGIN_TIMEOUT = 60000;

export default function Login() {

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (e) => {

    e.preventDefault();

    // Prevent double click / multiple requests
    if (loading) {
      return;
    }

    const email = data.email
      .toLowerCase()
      .trim();

    const password = data.password;

    if (!email || !password) {

      setError("Email & Password required ❌");

      return;
    }

    try {

      setLoading(true);
      setError("");

      console.log("LOGIN START:", new Date().toISOString());

      const res = await axios.post(
        `${API}/login`,
        {
          email,
          password,
        },
        {
          timeout: LOGIN_TIMEOUT,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "LOGIN SUCCESS:",
        new Date().toISOString()
      );

      /* =========================================
         CHECK RESPONSE
      ========================================= */

      if (!res.data?.token || !res.data?.user) {

        throw new Error(
          "Invalid login response from server"
        );

      }

      /* =========================================
         SAVE TOKEN
      ========================================= */

      localStorage.setItem(
        "token",
        res.data.token
      );

      /* =========================================
         SAVE USER
      ========================================= */

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      /* =========================================
         ROLE
      ========================================= */

      const role =
        res.data.user?.role?.toLowerCase();

      /* =========================================
         REDIRECT
      ========================================= */

      if (role === "admin") {

        navigate("/dashboard", {
          replace: true,
        });

      }

      else if (role === "executive") {

        navigate("/executive-dashboard", {
          replace: true,
        });

      }

      else if (role === "manager") {

        navigate("/manager-dashboard", {
          replace: true,
        });

      }

      else if (role === "reception") {

        navigate("/reception-dashboard", {
          replace: true,
        });

      }

      else {

        navigate("/dashboard", {
          replace: true,
        });

      }

    }

    catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      /* =========================================
         TIMEOUT
      ========================================= */

      if (err.code === "ECONNABORTED") {

        setError(
          "Server response is taking too long. Please try again ❌"
        );

      }

      /* =========================================
         NETWORK ERROR
      ========================================= */

      else if (
        err.code === "ERR_NETWORK" ||
        !err.response
      ) {

        setError(
          "Unable to connect to CRM server. Please try again ❌"
        );

      }

      /* =========================================
         BACKEND ERROR
      ========================================= */

      else {

        setError(
          err.response?.data?.message ||
          "Login failed ❌"
        );

      }

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      {/* =========================================
          LEFT SIDE
      ========================================= */}

      <div className="login-left">

        <div className="left-overlay">

          {/* LOGO */}

          <div className="logo-wrapper">

            <img
              src="/zamin.png"
              alt="Zaminwale Logo"
              className="company-logo"
            />

          </div>

          {/* TEXT */}

          <div className="quote-box">

            <h1>
              Smart CRM for Modern Real Estate Business
            </h1>

            <p>
              Manage leads, clients & property deals efficiently.
            </p>

          </div>

        </div>

      </div>


      {/* =========================================
          RIGHT SIDE
      ========================================= */}

      <div className="login-right">

        <form
          className="login-card"
          onSubmit={login}
        >

          <h1>
            Welcome to Zamin CRM
          </h1>

          <p className="sub-text">
            Login to continue
          </p>


          {/* =====================================
              ERROR
          ===================================== */}

          {error && (

            <div className="error-box">

              {error}

            </div>

          )}


          {/* =====================================
              EMAIL
          ===================================== */}

          <div className="input-group">

            <label htmlFor="login-email">
              Email
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={data.email}
              autoComplete="username"
              disabled={loading}
              onChange={(e) =>
                setData({
                  ...data,
                  email: e.target.value,
                })
              }
              required
            />

          </div>


          {/* =====================================
              PASSWORD
          ===================================== */}

          <div className="input-group">

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={data.password}
              autoComplete="current-password"
              disabled={loading}
              onChange={(e) =>
                setData({
                  ...data,
                  password: e.target.value,
                })
              }
              required
            />

          </div>


          {/* =====================================
              LOGIN BUTTON
          ===================================== */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Log In"
            }

          </button>

        </form>

      </div>

    </div>

  );

}