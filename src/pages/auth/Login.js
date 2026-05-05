// FILE: src/pages/auth/Login.js

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../styles/login.css";

const API = "http://localhost:5000/api";

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

    try {

      setLoading(true);
      setError("");

      const res = await axios.post(`${API}/login`, {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      if (res.data.token) {
        localStorage.setItem(
          "token",
          res.data.token
        );
      }

      navigate("/dashboard");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="login-page">

      {/* LEFT SIDE */}

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

      {/* RIGHT SIDE */}

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

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* EMAIL */}

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) =>
                setData({
                  ...data,
                  email: e.target.value,
                })
              }
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={(e) =>
                setData({
                  ...data,
                  password: e.target.value,
                })
              }
              required
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Log In"}
          </button>

        </form>

      </div>

    </div>
  );
}