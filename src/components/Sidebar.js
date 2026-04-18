import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/sidebar.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState("leads");
  const [openSettings, setOpenSettings] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  /* 🔥 LOGOUT FUNCTION */
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* 🔥 AUTO OPEN */
  useEffect(() => {
    if (location.pathname.startsWith("/leads")) {
      setOpenMenu("leads");
    }

    if (location.pathname.startsWith("/settings")) {
      setOpenSettings("settings");
    }
  }, [location.pathname]);

  return (
    <>
      {/* 🔝 TOP NAVBAR */}
      <div className={`top-navbar ${isOpen ? "shifted" : "collapsed"}`}>

        {/* LEFT */}
        <div className="nav-left">

          {/* 🔥 LOGO FIRST (FIXED POSITION) */}
          <img
            src="/zamin.png"
            alt="logo"
            className="logo"
          />

          {/* MENU BUTTON */}
          <button className="menu-btn" onClick={toggleSidebar}>
            ☰
          </button>

          {/* TITLE */}
          <h4 className="title">CRM Dashboard</h4>

        </div>

        {/* RIGHT PROFILE */}
        <div className="nav-right">
          <div
            className="profile-box"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          {/* 🔥 DROPDOWN */}
          {showProfile && (
            <div className="profile-dropdown">
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
              <hr />
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* 📂 SIDEBAR */}
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>

        <ul style={{ display: "flex", flexDirection: "column", height: "100%" }}>

          {/* 📊 DASHBOARD */}
          <li>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              <span className="icon">📊</span>
              <span className="text">Dashboard</span>
            </Link>
          </li>

          {/* 📁 LEAD MANAGEMENT */}
          <li>
            <div
              className={`menu-item ${
                location.pathname.startsWith("/leads") ? "active" : ""
              }`}
              onClick={() =>
                setOpenMenu(openMenu === "leads" ? null : "leads")
              }
            >
              <span className="menu-left">
                <span className="icon">📁</span>
                <span className="text">Lead Management</span>
              </span>

              <span className={`arrow ${openMenu === "leads" ? "rotate" : ""}`}>
                ▸
              </span>
            </div>

            <ul className={`submenu ${openMenu === "leads" ? "show" : ""}`}>
              <li><Link to="/leads/pipeline">Pipeline</Link></li>
              <li><Link to="/leads/bulk-update">Bulk Update</Link></li>
              <li><Link to="/leads/svp-dashboard">SVP Dashboard</Link></li>
              <li><Link to="/leads/outgoing-calls">Outgoing Calls</Link></li>
              {(user.role === "admin" || user.role === "superadmin") && (
  <li>
    <Link to="/upload">Upload Leads</Link>
  </li>
)}
            </ul>
          </li>

          {/* 📨 REQUESTS */}
          <li>
            <Link to="/requests">
              <span className="icon">📨</span>
              <span className="text">Requests</span>
            </Link>
          </li>

          {/* 📈 REPORTS */}
          <li>
            <Link to="/reports">
              <span className="icon">📈</span>
              <span className="text">Reports</span>
            </Link>
          </li>

          {/* ⚙️ SETTINGS */}
          {(user.role === "admin" || user.role === "superadmin") && (
            <li>
              <div
                className={`menu-item ${
                  location.pathname.startsWith("/settings") ? "active" : ""
                }`}
                onClick={() =>
                  setOpenSettings(
                    openSettings === "settings" ? null : "settings"
                  )
                }
              >
                <span className="menu-left">
                  <span className="icon">⚙️</span>
                  <span className="text">Settings</span>
                </span>

                <span className={`arrow ${openSettings === "settings" ? "rotate" : ""}`}>
                  ▸
                </span>
              </div>

              <ul className={`submenu ${openSettings === "settings" ? "show" : ""}`}>
                <li><Link to="/settings/manage-users">Manage Users</Link></li>
                <li><Link to="/settings/manage-projects">Manage Projects</Link></li>
                <li><Link to="/settings/manage-campaigns">Manage Campaigns</Link></li>
              </ul>
              
            </li>
          )}

          {/* 🔥 LOGOUT */}
          <li
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              cursor: "pointer",
              color: "#ff4d4f",
              padding: "10px 20px",
            }}
          >
            <span className="icon">🚪</span>
            <span className="text">Logout</span>
          </li>

        </ul>

      </div>
    </>
  );
}