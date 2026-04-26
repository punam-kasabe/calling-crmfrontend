import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/sidebar.css";

/* 🔥 ICONS */
import {
  LayoutDashboard,
  FolderKanban,
  Upload,
  BarChart3,
  Settings,
  Users,
  PhoneCall,
  Megaphone,
  Building2,
  Key,
  Cloud,
  LogOut,
  UserCheck,
  ClipboardList,
  Search,
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(true);
  const [openReports, setOpenReports] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openTelephony, setOpenTelephony] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role?.toLowerCase();

  const isAdmin =
    role === "admin" ||
    role === "super administrator";

  const isManager = role === "manager";

  const isReception = role === "reception";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* 🔝 TOP NAVBAR */}
      <div
        className={`top-navbar ${
          isOpen ? "shifted" : "collapsed"
        }`}
      >
        <div className="nav-left">

          <img
            src="/zamin.png"
            alt="logo"
            className="logo"
          />

          <button
            className="menu-btn"
            onClick={toggleSidebar}
          >
            ☰
          </button>

          <h4 className="title">
            CRM Dashboard
          </h4>

        </div>

        <div className="nav-right">

          <div
            className="profile-box"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          >
            <div className="profile-circle">
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          </div>

          {showProfile && (
            <div className="profile-dropdown">

              <p>
                <strong>{user.name}</strong>
              </p>

              <p>{user.email}</p>

              <hr />

              <button onClick={handleLogout}>
                Logout
              </button>

            </div>
          )}

        </div>
      </div>

      {/* 📂 SIDEBAR */}
      <div
        className={`sidebar ${
          isOpen ? "open" : "collapsed"
        }`}
      >
        <ul className="sidebar-list">

          {/* ================= RECEPTION ================= */}
          {isReception && (
            <>
              <li>
                <Link
                  to="/reception-dashboard"
                  className={
                    location.pathname ===
                    "/reception-dashboard"
                      ? "active"
                      : ""
                  }
                >
                  <LayoutDashboard size={18} />
                  <span className="text">
                    Reception Dashboard
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/search-client"
                  className={
                    location.pathname ===
                    "/search-client"
                      ? "active"
                      : ""
                  }
                >
                  <Search size={18} />
                  <span className="text">
                    Search Client
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/create-visit"
                  className={
                    location.pathname ===
                    "/create-visit"
                      ? "active"
                      : ""
                  }
                >
                  <ClipboardList size={18} />
                  <span className="text">
                    Create Visit
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/visit-entries"
                  className={
                    location.pathname ===
                    "/visit-entries"
                      ? "active"
                      : ""
                  }
                >
                  <Users size={18} />
                  <span className="text">
                    Visit Entries
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/assign-manager"
                  className={
                    location.pathname ===
                    "/assign-manager"
                      ? "active"
                      : ""
                  }
                >
                  <UserCheck size={18} />
                  <span className="text">
                    Assign Manager
                  </span>
                </Link>
              </li>
            </>
          )}

          {/* ================= MANAGER ================= */}
          {isManager && (
            <>
              <li>
                <Link
                  to="/manager-dashboard"
                  className={
                    location.pathname ===
                    "/manager-dashboard"
                      ? "active"
                      : ""
                  }
                >
                  <LayoutDashboard size={18} />
                  <span className="text">
                    Manager Dashboard
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/assigned-clients"
                  className={
                    location.pathname ===
                    "/assigned-clients"
                      ? "active"
                      : ""
                  }
                >
                  <Users size={18} />
                  <span className="text">
                    Assigned Clients
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/updated-booking-status"
                  className={
                    location.pathname ===
                    "/updated-booking-status"
                      ? "active"
                      : ""
                  }
                >
                  <ClipboardList size={18} />
                  <span className="text">
                    Booking Status
                  </span>
                </Link>
              </li>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {isAdmin && (
            <>
              {/* DASHBOARD */}
              <li>
                <Link
                  to="/dashboard"
                  className={
                    location.pathname ===
                    "/dashboard"
                      ? "active"
                      : ""
                  }
                >
                  <LayoutDashboard size={18} />
                  <span className="text">
                    Dashboard
                  </span>
                </Link>
              </li>

              {/* LEAD MANAGEMENT */}
              <li>

                <div
                  className="menu-item"
                  onClick={() =>
                    setOpenMenu(!openMenu)
                  }
                >

                  <span className="menu-left">

                    <FolderKanban size={18} />

                    <span className="text">
                      Lead Management
                    </span>

                  </span>

                  <span
                    className={`arrow ${
                      openMenu
                        ? "rotate"
                        : ""
                    }`}
                  >
                    ▸
                  </span>

                </div>

                <ul
                  className={`submenu ${
                    openMenu
                      ? "show"
                      : ""
                  }`}
                >

                  <li>
                    <Link to="/pipeline">
                      <FolderKanban size={14} />
                      Pipeline
                    </Link>
                  </li>

                  <li>
                    <Link to="/bulk-update">
                      <Upload size={14} />
                      Bulk Update
                    </Link>
                  </li>

                  <li>
                    <Link to="/svp-dashboard">
                      <BarChart3 size={14} />
                      SVP Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link to="/call-logs">
                      <PhoneCall size={14} />
                      Communication
                    </Link>
                  </li>

                  <li>
                    <Link to="/outgoing-calls">
                      <PhoneCall size={14} />
                      Outgoing Calls
                    </Link>
                  </li>

                  <li>
                    <Link to="/my-leads">
                      <Users size={14} />
                      My Leads
                    </Link>
                  </li>

                  <li>
                    <Link to="/followups">
                      <ClipboardList size={14} />
                      Followups
                    </Link>
                  </li>

                  <li>
                    <Link to="/upload">
                      <Upload size={14} />
                      Upload Leads
                    </Link>
                  </li>

                </ul>

              </li>

              {/* REPORTS */}
              <li>

                <div
                  className="menu-item"
                  onClick={() =>
                    setOpenReports(
                      !openReports
                    )
                  }
                >

                  <span className="menu-left">

                    <BarChart3 size={18} />

                    <span className="text">
                      Reports
                    </span>

                  </span>

                  <span
                    className={`arrow ${
                      openReports
                        ? "rotate"
                        : ""
                    }`}
                  >
                    ▸
                  </span>

                </div>

                <ul
                  className={`submenu ${
                    openReports
                      ? "show"
                      : ""
                  }`}
                >

                  <li>
                    <Link to="/lead-volume">
                      <BarChart3 size={14} />
                      Lead Volume
                    </Link>
                  </li>

                  <li>
                    <Link to="/team-performance">
                      <Users size={14} />
                      Team Performance
                    </Link>
                  </li>

                  <li>
                    <Link to="/projects-report">
                      <Building2 size={14} />
                      Projects Report
                    </Link>
                  </li>

                  <li>
                    <Link to="/sources-report">
                      <Megaphone size={14} />
                      Sources Report
                    </Link>
                  </li>

                  <li>
                    <Link to="/roi-report">
                      <BarChart3 size={14} />
                      ROI Report
                    </Link>
                  </li>

                  <li>
                    <Link to="/channel-partner">
                      <Users size={14} />
                      Channel Partner
                    </Link>
                  </li>

                </ul>

              </li>

              {/* SETTINGS */}
              <li>

                <div
                  className="menu-item"
                  onClick={() =>
                    setOpenSettings(
                      !openSettings
                    )
                  }
                >

                  <span className="menu-left">

                    <Settings size={18} />

                    <span className="text">
                      Settings
                    </span>

                  </span>

                  <span
                    className={`arrow ${
                      openSettings
                        ? "rotate"
                        : ""
                    }`}
                  >
                    ▸
                  </span>

                </div>

                <ul
                  className={`submenu ${
                    openSettings
                      ? "show"
                      : ""
                  }`}
                >

                  <li>
                    <Link to="/manage-users">
                      <Users size={14} />
                      Users
                    </Link>
                  </li>

                  <li>
                    <Link to="/manage-projects">
                      <Building2 size={14} />
                      Projects
                    </Link>
                  </li>

                  <li>
                    <Link to="/manage-campaigns">
                      <Megaphone size={14} />
                      Campaigns
                    </Link>
                  </li>

                  <li>
                    <Link to="/apikeys">
                      <Key size={14} />
                      API Keys
                    </Link>
                  </li>

                </ul>

              </li>

              {/* CLOUD TELEPHONY */}
              <li>

                <div
                  className="menu-item"
                  onClick={() =>
                    setOpenTelephony(
                      !openTelephony
                    )
                  }
                >

                  <span className="menu-left">

                    <Cloud size={18} />

                    <span className="text">
                      Cloud Telephony
                    </span>

                  </span>

                  <span
                    className={`arrow ${
                      openTelephony
                        ? "rotate"
                        : ""
                    }`}
                  >
                    ▸
                  </span>

                </div>

                <ul
                  className={`submenu ${
                    openTelephony
                      ? "show"
                      : ""
                  }`}
                >

                  <li>
                    <Link to="/telephony/exotel">
                      <PhoneCall size={14} />
                      Exotel
                    </Link>
                  </li>

                  <li>
                    <Link to="/telephony/mcube">
                      <PhoneCall size={14} />
                      Mcube
                    </Link>
                  </li>

                  <li>
                    <Link to="/telephony/others">
                      <Cloud size={14} />
                      Others
                    </Link>
                  </li>

                </ul>

              </li>
            </>
          )}

          {/* LOGOUT */}
          <li
            onClick={handleLogout}
            className="logout"
          >
            <LogOut size={18} />

            <span className="text">
              Logout
            </span>
          </li>

        </ul>
      </div>
    </>
  );
}