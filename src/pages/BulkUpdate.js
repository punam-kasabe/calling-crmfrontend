import Sidebar from "../components/Sidebar";
import { useState } from "react";
import axios from "axios";
import "../styles/bulkupdate.css";

export default function BulkUpdate() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select file ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/bulk-update",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage(res.data.message || "Updated Successfully ✅");

    } catch (err) {
  console.error("BULK UPDATE ERROR:", err);
  setMessage(err.response?.data || "Update failed ❌");
}
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>

        <div className="page-header">
          <h4>Leads</h4>
          <p>Home / Prepare Bulk Update</p>
        </div>

        <div className="bulk-card">

          <h5>Update Leads</h5>

          <div className="upload-row">
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              accept=".csv"
            />

            <button className="btn upload" onClick={handleUpload}>
              {loading ? "Uploading..." : "⬆ Upload"}
            </button>
          </div>

          {/* MESSAGE */}
          {message && <p className="msg">{message}</p>}

          <button className="sample-btn">Sample CSV</button>

          <div className="info">
            <p className="label">Fields To Update:</p>
            <p>phone (required), status, assigned_to, source</p>
          </div>

        </div>
      </div>
    </div>
  );
}