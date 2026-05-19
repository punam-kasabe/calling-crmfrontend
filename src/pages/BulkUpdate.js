// FILE: src/pages/BulkUpdate.jsx

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

  const [duplicates, setDuplicates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= UPLOAD =================
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
        "https://calling-crm-backend-7w52.onrender.com/api/bulk-update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const {

  updated = 0,
  skipped = 0,

} = res.data;


      // 🔥 UI MESSAGE
        setMessage(
       `✅ Updated: ${updated} | ⚠️ Skipped: ${skipped}`
         );

      /* DUPLICATE LEADS */

if (
  res.data.duplicates &&
  res.data.duplicates.length > 0
) {

  setDuplicates(
    res.data.duplicates
  );

  setShowPopup(true);

}

    } catch (err) {

      console.error("BULK UPDATE ERROR:", err);

      setMessage(
        err.response?.data?.message || "Update failed ❌"
      );

      alert("❌ Upload failed. Check console.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>

        {/* HEADER */}
        <div className="page-header">
          <h4>Leads</h4>
          <p>Home / Prepare Bulk Update</p>
        </div>

        {/* CARD */}
        <div className="bulk-card">

          <h5>Update Leads</h5>

          {/* FILE UPLOAD */}
          <div className="upload-row">

            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              accept=".csv"
            />

            <button
              className="btn upload"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "⬆ Upload"}
            </button>

          </div>

          {/* MESSAGE */}
          {message && (
            <p className="msg">
              {message}
            </p>
          )}

          {/* SAMPLE BUTTON */}
          <button
            className="sample-btn"
            onClick={() =>
              alert("Sample CSV feature coming soon 🚀")
            }
          >
            Sample CSV
          </button>

          {/* INFO */}
          <div className="info">
            <p className="label">Fields To Update:</p>
            <p>
              phone (required), project, status, assigned_to, source
            </p>
          </div>

        </div>

               </div>

      {/* DUPLICATE POPUP */}

      {showPopup && (

        <div className="duplicate-overlay">

          <div className="duplicate-popup">

            <h2>
              Failures ({duplicates.length})
            </h2>

            <div className="duplicate-list">

              {duplicates.map((item, index) => (

                <p key={index}>

                  <strong>
                    {item.name}
                  </strong>

                  {" - "}

                  Mobile number already exists
                  for project

                  {" "}

                  <strong>
                    {item.project}
                  </strong>

                  {" | Already assigned to "}

                  <strong>
                    {item.assigned_to}
                  </strong>

                </p>

              ))}

            </div>

            <button
              className="close-btn"
              onClick={() =>
                setShowPopup(false)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}


      
    