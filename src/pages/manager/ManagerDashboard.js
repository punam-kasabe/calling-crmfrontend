import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/manager.css";

export default function ManagerDashboard() {

  const [isOpen, setIsOpen] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    booked: 0,
    interested: 0,
    pending: 0,
    visits: 0,
    followups: 0
  });

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  /* =========================================
     FETCH DASHBOARD
  ========================================= */

  const fetchDashboard = useCallback(async () => {

    try {

      if (!user?.email) return;

      const res = await axios.get(
        `https://calling-crm-backend-7w52.onrender.com/api/dashboard?email=${user.email}&role=manager`
      );

      setStats({
        total: res.data.total || 0,
        booked: res.data.booked || 0,
        interested: res.data.interested || 0,
        pending: res.data.pending || 0,
        visits: res.data.visits || 0,
        followups: res.data.followups || 0
      });

    } catch (err) {

      console.log(
        "Dashboard Error ❌",
        err.response?.data || err.message
      );

    }

  }, [user?.email]);

  /* =========================================
     LOAD DATA
  ========================================= */

  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="page-container">

          <h1 className="page-title">
            Manager Dashboard
          </h1>

          <div className="dashboard-grid">

            <div className="dashboard-card">
              <h3>Total Clients</h3>
              <h2>{stats.total}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Booked Clients</h3>
              <h2>{stats.booked}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Interested Leads</h3>
              <h2>{stats.interested}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Pending Leads</h3>
              <h2>{stats.pending}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Today's Visits</h3>
              <h2>{stats.visits}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Today's Followups</h3>
              <h2>{stats.followups}</h2>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}