import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

import {
  Pie,
  Line,
  Bar,
  Doughnut
} from "react-chartjs-2";

import CountUp from "react-countup";

import "chart.js/auto";

const API = "https://calling-crm-backend-7w52.onrender.com/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  /* =========================================
     USER
  ========================================= */
  
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  /* =========================================
     STATES
  ========================================= */

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    total: 0,
    new: 0,
    interested: 0,
    booked: 0,
    not_interested: 0,
    pending: 0,

    statusData: [],
    executives: [],
    assignments: [],
    leaderboard: [],
    followups: [],
    missedFollowups: [],
    projects: [],
    sources: [],
    revenue: [],
    activities: [],
    weekly: [],
    todayVisitList: [],
    receptionEntries: 0
  });

  /* =========================================
     FETCH DASHBOARD
  ========================================= */

  const fetchDashboard = useCallback(async () => {

    try {

      if (!user?.email || !user?.role) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await axios.get(
        `${API}/dashboard-full`,
        {
          params: {
            email: user.email,
            role: user.role
          }
        }
      );

      setDashboard(res.data || {});

    } catch (err) {

      console.log("Dashboard Error ❌", err);

    } finally {

      setLoading(false);

    }

  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* =========================================
     CHARTS
  ========================================= */

  const statusChart = {
    labels:
      dashboard.statusData?.length > 0
        ? dashboard.statusData.map(i => i._id)
        : ["No Data"],

    datasets: [
      {
        data:
          dashboard.statusData?.length > 0
            ? dashboard.statusData.map(i => i.count)
            : [1]
      }
    ]
  };

  const weeklyChart = {
    labels:
      dashboard.weekly?.length > 0
        ? dashboard.weekly.map(i => i.day)
        : [],

    datasets: [
      {
        label: "Leads",
        data:
          dashboard.weekly?.length > 0
            ? dashboard.weekly.map(i => i.count)
            : [],
        fill: true
      }
    ]
  };

  const projectChart = {
    labels:
      dashboard.projects?.length > 0
        ? dashboard.projects.map(i => i._id)
        : [],

    datasets: [
      {
        label: "Projects",
        data:
          dashboard.projects?.length > 0
            ? dashboard.projects.map(i => i.count)
            : []
      }
    ]
  };

  const sourceChart = {
    labels:
      dashboard.sources?.length > 0
        ? dashboard.sources.map(i => i._id)
        : [],

    datasets: [
      {
        label: "Sources",
        data:
          dashboard.sources?.length > 0
            ? dashboard.sources.map(i => i.count)
            : []
      }
    ]
  };

  const revenueChart = {
    labels:
      dashboard.revenue?.length > 0
        ? dashboard.revenue.map(i => i.month)
        : [],

    datasets: [
      {
        label: "Revenue",
        data:
          dashboard.revenue?.length > 0
            ? dashboard.revenue.map(i => i.amount)
            : [],
        fill: true
      }
    ]
  };

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="dashboard-page">

      {/* =========================================
         SIDEBAR
      ========================================= */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* =========================================
         MAIN CONTAINER
      ========================================= */}

      <div
        className="dashboard-container"
        style={{
          marginLeft: isOpen ? "240px" : "70px"
        }}
      >

        {/* =========================================
           TITLE
        ========================================= */}

        <h2 className="dashboard-title">
          CRM Dashboard
        </h2>

        {/* =========================================
           LOADING
        ========================================= */}

        {loading ? (

          <div className="loading-box">
            <h5>Loading Dashboard...</h5>
          </div>

        ) : (

          <>

            {/* =========================================
               ROW 1 — SUMMARY CARDS
            ========================================= */}

            <div className="cards-grid">

              {[
                {
                  title: "Total Leads",
                  value: dashboard.total,
                  cls: "card-blue"
                },

                {
                  title: "New Leads",
                  value: dashboard.new,
                  cls: "card-blue"
                },

                {
                  title: "Interested",
                  value: dashboard.interested,
                  cls: "card-green"
                },

                {
                  title: "Booked",
                  value: dashboard.booked,
                  cls: "card-green"
                },

                {
                  title: "Pending",
                  value: dashboard.pending,
                  cls: "card-yellow"
                },

                {
                  title: "Not Interested",
                  value: dashboard.not_interested,
                  cls: "card-red"
                },
                
{
  title: "Reception Entries",
  value: dashboard.receptionEntries,
  cls: "card-purple"
}
               
              ].map((item) => (

                <div
  key={item.title}
  className={`compact-card ${item.cls}`}
  style={{ cursor: "pointer" }}

  onClick={() => {

  console.log("Clicked:", item.title);

  if (item.title === "Total Leads") {
    navigate("/reports/total-leads");
  }

  else if (item.title === "New Leads") {
    navigate("/reports/new-leads");
  }

  else if (item.title === "Interested") {
  navigate("/reports/status/interested");
}

else if (item.title === "Booked") {
  navigate("/reports/status/booked");
}

else if (item.title === "Pending") {
  navigate("/reports/status/new");
}

else if (item.title === "Not Interested") {
  navigate("/reports/status/not-interested");
}
else if (item.title === "Reception Entries") {
  navigate("/admin/reception-entries");
}

}}
>

                  <h6>{item.title}</h6>

                  <h3>
                    <CountUp
                      end={item.value || 0}
                      duration={1}
                    />
                  </h3>

                </div>

              ))}

            </div>

            {/* =========================================
               ROW 2 — WEEKLY + STATUS
            ========================================= */}

            <div className="dashboard-row">

              {/* LEFT */}

              <div className="chart-large">

                <div className="chart-card">

                  <h5>Weekly Trends</h5>

                  <Line data={weeklyChart} />

                </div>

              </div>

              {/* RIGHT */}

              <div className="chart-small">

                <div className="chart-card">

                  <h5>Status Distribution</h5>

                  <Pie data={statusChart} />

                </div>

              </div>

            </div>

            {/* =========================================
               ROW 3 — EXECUTIVE PERFORMANCE
            ========================================= */}

            <div className="chart-card mt-4">

              <h5>Executive Performance</h5>

              <div className="table-responsive">

                <table className="table table-bordered">

                  <thead>

                    <tr>

                      <th>Name</th>

                      <th>Total Leads</th>

                      <th>Interested</th>

                      <th>Booked</th>

                      <th>Pending</th>

                    </tr>

                  </thead>

                  <tbody>

                    {dashboard.executives?.length > 0 ? (

                      dashboard.executives.map((e, i) => (

                        <tr key={i}>

                          <td>
                  {e.name?.includes("@")
                    ? e.name.split("@")[0]
                   : e.name}
                  </td>

                          <td>{e.total}</td>

                          <td>{e.interested}</td>

                          <td>{e.booked}</td>

                          <td>{e.pending}</td>

                        </tr>

                      ))

                    ) : (

                      <tr>
                        <td colSpan="5" align="center">
                          No Executive Data
                        </td>
                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* =========================================
               ROW 4
            ========================================= */}

            <div className="dashboard-row mt-4">

              {/* ASSIGNMENT */}

              <div className="chart-half">

                <div className="chart-card">

                  <h5>Lead Assignment Summary</h5>

                  <Doughnut
                    data={{
                      labels:
                        dashboard.assignments?.map(i => i.name),

                      datasets: [
                        {
                          data:
                            dashboard.assignments?.map(i => i.count)
                        }
                      ]
                    }}
                  />

                </div>

              </div>

              {/* LEADERBOARD */}

              <div className="chart-half">

                <div className="chart-card">

                  <h5>Team Leaderboard</h5>

                  <div className="leaderboard-list">

                    {dashboard.leaderboard?.length > 0 ? (

                      dashboard.leaderboard.map((l, index) => (

                        <div
                          className="leader-item"
                          key={index}
                        >

                          <span>
                           {index + 1} {

  l.name?.includes("@")
    ? l.name.split("@")[0]
    : l.name

}
                          </span>

                          <strong>
                            {l.count}
                          </strong>

                        </div>

                      ))

                    ) : (

                      <p>No Leaderboard Data</p>

                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* =========================================
               ROW 5
            ========================================= */}

            <div className="dashboard-row mt-4">

              {/* FOLLOWUPS */}

              <div className="chart-half">

                <div className="chart-card">

                  <h5>Today's Followups</h5>

                  <div className="activity-list">

                    {dashboard.followups?.length > 0 ? (

                      dashboard.followups.map((f, i) => (

                        <div
                          className="activity-item"
                          key={i}
                        >

                          <strong>
                            {f.name}
                          </strong>

                          <span>
                            {f.phone}
                          </span>

                        </div>

                      ))

                    ) : (

                      <p>No Followups</p>

                    )}

                  </div>

                </div>

              </div>

              {/* MISSED */}

              <div className="chart-half">

                <div className="chart-card">

                  <h5>Missed Followups</h5>

                  <div className="activity-list">

                    {dashboard.missedFollowups?.length > 0 ? (

                      dashboard.missedFollowups.map((f, i) => (

                        <div
                          className="activity-item"
                          key={i}
                        >

                          <strong>
                            {f.name}
                          </strong>

                          <span>
                            {f.phone}
                          </span>

                        </div>

                      ))

                    ) : (

                      <p>No Missed Followups</p>

                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* =========================================
               ROW 6
            ========================================= */}

            <div className="dashboard-row mt-4">

              {/* PROJECT */}

              <div className="chart-half">

                <div className="chart-card">

                  <h5>Project Performance</h5>

                  <Bar data={projectChart} />

                </div>

              </div>

              {/* SOURCE */}

              <div className="chart-half">

                <div className="chart-card">

                  <h5>Source Analysis</h5>

                  <Pie data={sourceChart} />

                </div>

              </div>

            </div>

            {/* =========================================
               ROW 7 — REVENUE
            ========================================= */}

            <div className="chart-card mt-4">

              <h5>Revenue Chart</h5>

              <Line data={revenueChart} />

            </div>

              {/* =========================================
   TODAY'S VISITS
========================================= */}

<div className="chart-card mt-4">

  <h5>Today's Visits</h5>

  <div className="table-responsive">

    <table className="table table-bordered">

      <thead>

        <tr>

          <th>Sr No</th>

          <th>Client</th>

          <th>Mobile</th>

          <th>Project</th>

          <th>Manager</th>

          <th>Visit Date</th>

          <th>Status</th>

        </tr>

      </thead>

      <tbody>

        {dashboard.todayVisitList?.length > 0 ? (

          dashboard.todayVisitList.map((visit, index) => (

            <tr key={visit._id}>

              <td>{index + 1}</td>

              <td>{visit.clientName}</td>

              <td>{visit.mobile}</td>

              <td>{visit.project}</td>

              <td>{visit.assigned_manager || "-"}</td>

              <td>

                {visit.visitDate
                  ? new Date(
                      visit.visitDate
                    ).toLocaleString("en-IN")
                  : "-"}

              </td>

              <td>

                <span className="badge bg-success">

                  {visit.visitStatus}

                </span>

              </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan="7"
              align="center"
            >

              No Visits Today

            </td>

          </tr>

        )}

      </tbody>

    </table>

         </div>

          </div>
            {/* =========================================
               ROW 8 — RECENT ACTIVITIES
            ========================================= */}

            <div className="chart-card mt-4">

              <h5>Recent Activities</h5>

              <div className="activity-list">

                {dashboard.activities?.length > 0 ? (

                  dashboard.activities.map((a, i) => (

                    <div
                      className="activity-item"
                      key={i}
                    >

                      <strong>
                        {a.user}
                      </strong>

                      <span>
                        {a.message}
                      </span>

                    </div>

                  ))

                ) : (

                  <p>No Activities Found</p>

                )}

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
}