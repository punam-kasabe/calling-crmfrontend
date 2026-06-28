import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

import "../../styles/receptiondashboard.css";

export default function ReceptionDashboard() {

  const [isOpen, setIsOpen] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalVisits: 0,
    todayVisits: 0,
    assignedManagers: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    fetchDashboard();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const fetchDashboard = async () => {

    try {

      const res = await axios.get(
        "https://calling-crm-backend-7w52.onrender.com/api/reception-dashboard"
      );

      setDashboard(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="reception-page">

          {/* HEADER */}

          <div className="reception-header">

            <div>

              <h1>
                Reception Dashboard
              </h1>

              <p className="reception-subtitle">
                Welcome to Reception Management Panel
              </p>

            </div>

            <div className="dashboard-date">

              <h3>
                {currentTime.toLocaleDateString("en-IN")}
              </h3>

              <p>
                {currentTime.toLocaleTimeString("en-IN")}
              </p>

            </div>

          </div>

          {/* CARDS */}

          <div className="reception-cards">

            <div className="reception-card">

              <div className="card-top">

                <h3>Total Visits</h3>

              </div>

              <h2>
                {dashboard.totalVisits}
              </h2>

            </div>

            <div className="reception-card">

              <div className="card-top">

                <h3>Today's Visits</h3>

              </div>

              <h2>
                {dashboard.todayVisits}
              </h2>

            </div>

            <div className="reception-card">

              <div className="card-top">

                <h3>Assigned Managers</h3>

              </div>

              <h2>
                {dashboard.assignedManagers}
              </h2>

            </div>

          </div>

          {/* QUICK ACTION */}

          <div className="quick-section">

            <h2>
              Quick Overview
            </h2>

            <div className="quick-grid">

              <div className="quick-card">

                <h3>Walk-in Clients</h3>

                <p>
                  Reception can register new walk-in visitors.
                </p>

              </div>

              <div className="quick-card">

                <h3>Today's Visit Schedule</h3>

                <p>
                  Check all today's appointments quickly.
                </p>

              </div>

              <div className="quick-card">

                <h3>Managers</h3>

                <p>
                  Assign visitors to available managers.
                </p>

              </div>

            </div>

          </div>

          {/* WELCOME */}

          <div className="welcome-box">

            <h2>
              Welcome 👋
            </h2>

            <p>

              Use the sidebar to manage site visits, assign managers,
              check today's appointments and maintain visitor records.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}