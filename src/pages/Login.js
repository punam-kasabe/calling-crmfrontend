import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* 🔥 FIX */
const API = "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      if (!data.email || !data.password) {
        setError("Please enter email & password");
        setLoading(false);
        return;
      }

      /* 🔥 FIXED API CALL */
      const res = await axios.post(`${API}/login`, {
        email: data.email,
        password: data.password,
      });

      /* SAVE USER */
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        
        <h4 className="text-center mb-3">CRM Login</h4>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={data.email}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button
          className="btn btn-primary w-100"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}