import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../styles/receptiondashboard.css";

export default function ReceptionDashboard() {

  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalVisits: 0,
    todayVisits: 0,
    assignedManagers: 0
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayVisits, setTodayVisits] = useState([]);

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
      setTodayVisits(res.data.todayVisitList || []);

    } catch (err) {

      console.log(err);

    }

  };
  const exportTodayVisits = () => {

  const csvRows = [];

  csvRows.push([
    "Client",
    "Phone",
    "Project",
    "Manager",
    "Visit Time",
    "Status"
  ]);

  todayVisits.forEach((v) => {

    csvRows.push([
      v.clientName,
      v.mobile,
      v.project,
      v.assigned_manager,
      v.visitDate
        ? new Date(v.visitDate).toLocaleString("en-IN")
        : "-",
      v.visitStatus
    ]);

  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    csvRows
      .map(e => e.join(","))
      .join("\n");

  const encodedUri =
    encodeURI(csvContent);

  const link =
    document.createElement("a");

  link.setAttribute(
    "href",
    encodedUri
  );

  link.setAttribute(
    "download",
    "Today_Visits.csv"
  );

  document.body.appendChild(link);

  link.click();

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

  <h2>Quick Actions</h2>

  <div className="quick-grid">

    <div
      className="quick-card"
      onClick={() => navigate("/create-visit")}
    >
      <div className="quick-icon">➕</div>

      <h3>Create New Visit</h3>

      <p>
        Register a new walk-in client instantly.
      </p>

    </div>

    <div
      className="quick-card"
      onClick={() => navigate("/visit-entries")}
    >
      <div className="quick-icon">📋</div>

      <h3>Visit Entries</h3>

      <p>
        View today's and previous visit records.
      </p>

    </div>

    <div
      className="quick-card"
      onClick={() => navigate("/assign-manager")}
    >
      <div className="quick-icon">👤</div>

      <h3>Assign Manager</h3>

      <p>
        Assign clients to available managers.
      </p>

    </div>

    <div
      className="quick-card"
      onClick={exportTodayVisits}
    >
      <div className="quick-icon">📄</div>

      <h3>Export Report</h3>

      <p>
        Download today's visits as CSV.
      </p>

    </div>

  </div>

</div>
     
     {/* ACTION BUTTONS */}

<div className="action-toolbar">

  <button
    className="action-btn blue"
    onClick={() => navigate("/create-visit")}
  >
    + New Visit
  </button>

  <button
    className="action-btn green"
    onClick={() => navigate("/visit-entries")}
  >
    View Visits
  </button>

  <button
    className="action-btn orange"
    onClick={exportTodayVisits}
  >
    Export CSV
  </button>

  <div className="calendar-box">

    <label>

      Select Date

    </label>

    <input
      type="date"
    />

  </div>

</div>

{/* TODAY'S VISITS */}

<div className="today-visits-section">

  <h2>
    Today's Visits
  </h2>

  <div className="table-responsive">

    <table className="today-table">

      <thead>

        <tr>

          <th>Sr No</th>

          <th>Client</th>

          <th>Phone</th>

          <th>Project</th>

          <th>Manager</th>

          <th>Visit Time</th>

          <th>Status</th>

        </tr>

      </thead>

      <tbody>

        {todayVisits.length > 0 ? (

          todayVisits.map((visit, index) => (

            <tr key={visit._id}>

              <td>{index + 1}</td>

             
<td>
  {visit.clientName}
</td>

<td>
  {visit.mobile}
</td>

<td>
  {visit.project}
</td>

<td>
  {visit.assigned_manager || "-"}
</td>

<td>
  {
    visit.visitDate
      ? new Date(visit.visitDate).toLocaleString("en-IN")
      : "-"
  }
</td>

<td>
  <span className="visit-status">
    {visit.visitStatus}
  </span>
</td>
            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan="7"
              style={{
                textAlign: "center",
                padding: "20px"
              }}
            >

              No Visits Today

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>

          
        </div>

      </div>

    </div>

  );

}