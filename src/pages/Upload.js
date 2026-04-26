import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/upload.css";

const API = "https://calling-crm-backend-1.onrender.com/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  /* ✅ FIX: useMemo to stop warning */
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  /* ✅ FETCH USERS */
  useEffect(() => {
    if (!user.role) return;

    // 🔥 normalize role
    const role = user.role.toLowerCase();

    if (role === "admin" || role === "super administrator") {
      axios
        .get(`${API}/all-users`) // ✅ FIXED API
        .then((res) => {
          console.log("Users:", res.data); // debug
          setUsers(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  /* ✅ UPLOAD */
  const uploadFile = async () => {
    if (!file || !assigned) {
      setMessage("Select file & user ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assigned_to", assigned);
    formData.append("created_by", user.email);

    try {
await axios.post(`${API}/bulk-update`, formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});      setMessage("File uploaded successfully ✅");

      setFile(null);
      setAssigned("");
    } catch (err) {
      console.log(err);
      setMessage("Upload failed ❌");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      {/* MAIN */}
      <div className={`upload-container ${isOpen ? "" : "collapsed"}`}>
        <div className="upload-card">

          <h3 className="upload-title">Upload CSV</h3>

          {message && (
            <p className="upload-message">{message}</p>
          )}

          {/* ✅ USER SELECT */}
          <select
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
          >
            <option value="">Select User</option>

            {users.length === 0 ? (
              <option disabled>No users found</option>
            ) : (
              users.map((u) => (
                <option key={u._id} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))
            )}
          </select>

          {/* FILE */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* BUTTON */}
          <button className="upload-btn" onClick={uploadFile}>
            Upload
          </button>

        </div>
      </div>
    </div>
  );
}