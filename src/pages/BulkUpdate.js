import Sidebar from "../components/Sidebar";
import { useState } from "react";
import "../styles/bulkupdate.css";

export default function BulkUpdate() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select file");
      return;
    }

    console.log("Uploading:", file);
    // 👉 API call here
  };

  return (
    <div className="layout">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

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
              onChange={handleFileChange}
              className="file-input"
            />

            <button className="btn browse">Browse</button>

            <button className="btn upload" onClick={handleUpload}>
              ⬆ Upload
            </button>
          </div>

          {/* SAMPLE CSV */}
          <button className="sample-btn">Sample CSV</button>

          {/* INFO */}
          <div className="info">
            <p className="label">MagicFields To Update:</p>
            <p>TelecallerName, Department</p>
          </div>

        </div>
      </div>
    </div>
  );
}