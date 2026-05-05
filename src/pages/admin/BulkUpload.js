import { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/bulkupdate.css";

const API = "http://localhost:5000/api";

export default function BulkUpload() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FILE CHANGE ================= */

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  /* ================= UPLOAD FILE ================= */

  const handleUpload = async () => {

    if (!file) {
      setMessage("Please select CSV file ❌");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await axios.post(
        `${API}/bulk-update`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setMessage(
        res.data.message ||
        "Bulk update success ✅"
      );

    }

    catch (err) {

      console.error(
        "Bulk upload error",
        err
      );

      setMessage(
        err.response?.data?.message ||
        "Upload failed ❌"
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="layout">

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* ================= MAIN CONTENT ================= */}

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="page-header">

          <h3>Bulk Upload</h3>

          <p>
            Upload CSV file to update leads
          </p>

        </div>

        <div className="bulk-card">

          <input
            type="file"
            accept=".csv"
            className="form-control mb-3"
            onChange={handleFileChange}
          />

          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={loading}
          >

            {loading
              ? "Uploading..."
              : "Upload CSV"}

          </button>

          {/* ================= MESSAGE ================= */}

          {message && (

            <p className="msg mt-3">
              {message}
            </p>

          )}

          {/* ================= INFO ================= */}

          <div className="info mt-4">

            <p>
              <strong>
                CSV Format:
              </strong>
            </p>

            <p>
              phone,
              assigned_to,
              status,
              source
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}