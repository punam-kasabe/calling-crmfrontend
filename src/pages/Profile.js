import Sidebar from "../components/Sidebar";
import { useState, useMemo } from "react";
import "../styles/profile.css";

export default function Profile() {

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // ✅ Logged In User
  const user = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("user")
    ) || {};
  }, []);

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="profile-page">

          {/* TOP CARD */}

          <div className="profile-card">

            <div className="profile-avatar">

              {user?.name?.charAt(0)?.toUpperCase() || "U"}

            </div>

            <div className="profile-info">

              <h2>
                {user?.name || "User"}
              </h2>

              <p>
                {user?.email || "No Email"}
              </p>

              <span className="role-badge">
                {user?.role || "Executive"}
              </span>

            </div>

          </div>

          {/* DETAILS */}

          <div className="profile-details">

            <div className="detail-box">

              <label>Full Name</label>

              <p>{user?.name || "-"}</p>

            </div>

            <div className="detail-box">

              <label>Email</label>

              <p>{user?.email || "-"}</p>

            </div>

            <div className="detail-box">

              <label>Role</label>

              <p>{user?.role || "-"}</p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}