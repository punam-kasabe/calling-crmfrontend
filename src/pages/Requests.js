import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Requests() {

  /* ================= SIDEBAR ================= */
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">

      {/* ✅ SIDEBAR */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* ✅ MAIN CONTENT */}
      <div
        style={{
          marginLeft: isOpen ? "240px" : "0px",
          marginTop: "60px",
          width: "100%",
          transition: "0.3s",
          background: "#f5f7fb",
          minHeight: "100vh"
        }}
      >

        {/* HEADER */}
        <div className="p-3 bg-white border-bottom">
          <h4>Requests</h4>
        </div>

        {/* BODY */}
        <div className="p-3">

          {/* BUTTON */}
          <button
            className="btn btn-success mb-3"
            onClick={() => alert("Open Request Form (Next Step 🔥)")}
          >
            + Raise Request
          </button>

          {/* EMPTY STATE */}
          <div className="card p-4 text-center">
            <h6>No Requests Yet</h6>
            <p className="text-muted">Click on "Raise Request" to create one</p>
          </div>

        </div>

      </div>
    </div>
  );
}