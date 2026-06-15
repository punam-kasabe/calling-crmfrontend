// FILE: src/pages/manager/ManagerDashboard.js

import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/managerDashboard.css";
import CountUp from "react-countup";

import {
  FaUsers,
  FaCheckCircle,
  FaFire,
  FaClock,
  FaHome,
  FaPhoneAlt
} from "react-icons/fa";
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

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  /* =========================================
     FETCH DASHBOARD
  ========================================= */

  const fetchDashboard = useCallback(async () => {

    try {

      if (!user?.email) return;

      const { data } = await axios.get(
        `https://calling-crm-backend-7w52.onrender.com/api/dashboard`,
        {
          params: {
            email: user.email,
            role: "manager"
          }
        }
      );

      setStats({
        total: data.total || 0,
        booked: data.booked || 0,
        interested: data.interested || 0,
        pending: data.pending || 0,
        visits: data.visits || 0,
        followups: data.followups || 0
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

  <div className="dashboard-card card-blue">
    <div className="card-icon">
      <FaUsers />
    </div>

    <h3>Total Assigned Leads</h3>

    <h2>
      <CountUp
        end={stats.total}
        duration={2}
      />
    </h2>
  </div>

  <div className="dashboard-card card-green">
    <div className="card-icon">
      <FaCheckCircle />
    </div>

    <h3>Booked Leads</h3>

    <h2>
      <CountUp
        end={stats.booked}
        duration={2}
      />
    </h2>
  </div>

  <div className="dashboard-card card-orange">
    <div className="card-icon">
      <FaFire />
    </div>

    <h3>Interested Leads</h3>

    <h2>
      <CountUp
        end={stats.interested}
        duration={2}
      />
    </h2>
  </div>

  <div className="dashboard-card card-red">
    <div className="card-icon">
      <FaClock />
    </div>

    <h3>Pending Leads</h3>

    <h2>
      <CountUp
        end={stats.pending}
        duration={2}
      />
    </h2>
  </div>

  <div className="dashboard-card card-purple">
    <div className="card-icon">
      <FaHome />
    </div>

    <h3>Today's Visits</h3>

    <h2>
      <CountUp
        end={stats.visits}
        duration={2}
      />
    </h2>
  </div>

  <div className="dashboard-card card-cyan">
    <div className="card-icon">
      <FaPhoneAlt />
    </div>

    <h3>Today's Followups</h3>

    <h2>
      <CountUp
        end={stats.followups}
        duration={2}
      />
    </h2>
  </div>

</div>
        </div>

      </div>

    </div>

  );

}