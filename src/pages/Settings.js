import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Settings() {

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
          <h4>Settings</h4>
        </div>

        {/* BODY */}
        <div className="p-3">

          {/* PROFILE SETTINGS */}
          <div className="card p-3 mb-3">
            <h5>Profile Settings</h5>

            <input
              className="form-control mb-2"
              placeholder="Name"
            />

            <input
              className="form-control mb-2"
              placeholder="Email"
            />

            <button className="btn btn-primary">
              Save Profile
            </button>
          </div>

          {/* PASSWORD SETTINGS */}
          <div className="card p-3 mb-3">
            <h5>Change Password</h5>

            <input
              type="password"
              className="form-control mb-2"
              placeholder="Old Password"
            />

            <input
              type="password"
              className="form-control mb-2"
              placeholder="New Password"
            />

            <button className="btn btn-warning">
              Update Password
            </button>
          </div>

          {/* SYSTEM SETTINGS */}
          <div className="card p-3">
            <h5>System Settings</h5>

            <select className="form-select mb-2">
              <option>Select Theme</option>
              <option>Light</option>
              <option>Dark</option>
            </select>

            <button className="btn btn-success">
              Save Settings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}