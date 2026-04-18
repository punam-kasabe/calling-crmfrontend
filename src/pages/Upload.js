import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/upload.css"; // 🔥 ADD THIS

export default function Upload() {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [assigned, setAssigned] = useState("");
  const [message, setMessage] = useState("");

  const [isOpen, setIsOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (user.role === "admin" || user.role === "superadmin") {
      axios
        .get("http://localhost:5000/users")
        .then((res) => setUsers(res.data))
        .catch((err) => console.log(err));
    }
  }, [user.role]);

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
      await axios.post("http://localhost:5000/upload", formData);
      setMessage("File uploaded successfully ✅");

      // 🔥 reset after upload
      setFile(null);
      setAssigned("");
    } catch {
      setMessage("Upload failed ❌");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* 🔥 SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      {/* 🔥 MAIN CONTENT */}
      <div className={`upload-container ${isOpen ? "" : "collapsed"}`}>
        
        <div className="upload-card">

          <h3 className="upload-title">Upload CSV</h3>

          {message && (
            <p className="upload-message">{message}</p>
          )}

          {/* USER SELECT */}
          <select
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u, i) => (
              <option key={i} value={u.email}>
                {u.email}
              </option>
            ))}
          </select>

          {/* FILE INPUT */}
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