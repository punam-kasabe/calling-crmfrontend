// FILE: src/pages/BulkUpdate.jsx

import Sidebar from "../components/Sidebar";
import { useState } from "react";
import axios from "axios";
import "../styles/bulkupdate.css";

export default function BulkUpdate() {

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [duplicates, setDuplicates] = useState([]);
  const [duplicateMessage, setDuplicateMessage] =
  useState("");

  const [showPopup, setShowPopup] = useState(false);

  // ================= FILE CHANGE =================

  const handleFileChange = (e) => {

    setFile(e.target.files[0]);

  };

  // ================= UPLOAD =================

  const handleUpload = async () => {

    if (!file) {

      alert("Please select CSV file ❌");

      return;

    }

    try {

      setLoading(true);

      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      // ✅ TOKEN
      const token = localStorage.getItem("token");

      // ✅ API CALL
      const res = await axios.post(

        "https://calling-crm-backend-7w52.onrender.com/api/bulk-update",

        formData,

        {

          headers: {

            "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${token}`

          }

        }

      );

      console.log("UPLOAD RESPONSE:", res.data);

      // ✅ RESPONSE VALUES
      const {

        updated = 0,

        inserted = 0,

        skipped = 0,

        duplicates = []

      } = res.data;

      // ✅ SUCCESS MESSAGE
      setMessage(

        `✅ Updated: ${updated} | ✅ Inserted: ${inserted} | ⚠️ Skipped: ${skipped}`

      );

      // ✅ DUPLICATES POPUP
     if (duplicates.length > 0) {

  setDuplicates(duplicates);

  setDuplicateMessage(
    `Possible Duplicate Found (${duplicates.length})`
  );

  setShowPopup(true);

} else {

  setDuplicates([]);

  setShowPopup(false);

}
    }

    catch (err) {

      console.error("BULK UPDATE ERROR:", err);

      setMessage(

        err.response?.data?.message ||

        "Upload failed ❌"

      );

      alert("❌ Upload failed. Check console.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="layout">

      {/* SIDEBAR */}

      <Sidebar

        isOpen={isOpen}

        toggleSidebar={toggleSidebar}

      />

      {/* MAIN */}

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>

        {/* HEADER */}

        <div className="page-header">

          <h4>Leads</h4>

          <p>Home / Prepare Bulk Update</p>

        </div>

        {/* CARD */}

        <div className="bulk-card">

          <h5>Update Leads</h5>

          {/* FILE INPUT */}

          <div className="upload-row">

            <input

              type="file"

              accept=".csv"

              onChange={handleFileChange}

              className="file-input"

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

          {/* SAMPLE CSV */}

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

            <p className="label">

              Fields Supported:

            </p>

           

          </div>

        </div>

      </div>

      {/* DUPLICATES POPUP */}

      {showPopup && (

        <div className="duplicate-overlay">

          <div className="duplicate-popup">

           <h2>

  {duplicateMessage}

</h2>

            <div className="duplicate-list">

              {duplicates.map((item, index) => (

               <p key={index}>

  <strong>

    {item.name || "No Name"}

  </strong>

  {" | "}

  <strong>

    {item.phone || "No Phone"}

  </strong>

  {" | "}

  {item.email || "No Email"}

  {" | "}

  <span className="duplicate-type">

  Mobile number already exists for project:

  <strong>
    {" "}
    {item.project || "Unknown Project"}
  </strong>

</span>

  {" | Assigned to "}

  <strong>

    {item.assigned_to || "Unassigned"}

  </strong>

</p>

              ))}

            </div>

            <button

              className="close-btn"

              onClick={() => setShowPopup(false)}

            >

              Close

            </button>

          </div>

        </div>

      )}

    </div>

  );

}