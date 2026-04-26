import Sidebar from "../../components/Sidebar";
import { useState } from "react";

export default function Reports() {

  /* ================= SIDEBAR ================= */
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">

      {/* ✅ SIDEBAR */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* ✅ MAIN */}
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
          <h4>Reports</h4>
        </div>

        {/* BODY */}
        <div className="p-3">

          {/* ACTION BUTTONS */}
          <div className="mb-3 d-flex gap-2">
            <button className="btn btn-primary">
              Export Excel
            </button>

            <button className="btn btn-danger">
              Export PDF
            </button>
          </div>

          {/* EMPTY STATE */}
          <div className="card p-4 text-center">
            <h5>📊 Reports Coming Soon...</h5>
            <p className="text-muted">
              You will be able to view and export reports here
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}