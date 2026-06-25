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
import {
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);
export default function ManagerDashboard() {

  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState({
  total: 0,
  booked: 0,
  interested: 0,
  pending: 0,
  visits: 0,
  followups: 0,

  newLeads: 0,
  veryInterested: 0,
  notInterested: 0,
  siteVisit: 0
});
 
  const [todayFollowups, setTodayFollowups] =
  useState([]);
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
const [projectStats, setProjectStats] =
  useState([]);
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
  followups: data.followups || 0,

  newLeads: data.newLeads || 0,
  veryInterested:
    data.veryInterested || 0,

  notInterested:
    data.notInterested || 0,

  siteVisit:
    data.siteVisit || 0,
    
});
setProjectStats(
  data.projectStats || []
);

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

  /* =========================================
   TODAY FOLLOWUPS
========================================= */

useEffect(() => {

  if (!user?.email) return;

  axios
    .get(
      `https://calling-crm-backend-7w52.onrender.com/api/today-followups/${user.email}`
    )

    .then((res) => {

      setTodayFollowups(
        res.data || []
      );

      if (
        res.data &&
        res.data.length > 0
      ) {

        alert(
          `🔔 Today ${res.data.length} Followups Pending`
        );

      }

    })

    .catch((err) =>
      console.log(err)
    );

}, [user?.email]);
const pieData = {
  labels: [
    "New",
    "Interested",
    "Very Interested",
    "Followup",
    "Booked",
    "Not Interested",
    "Site Visit"
  ],

  datasets: [
    {
      data: [
        stats.newLeads,
        stats.interested,
        stats.veryInterested,
        stats.followups,
        stats.booked,
        stats.notInterested,
        stats.siteVisit
      ],

      backgroundColor: [
        "#0d6efd",
        "#20c997",
        "#198754",
        "#ffc107",
        "#6f42c1",
        "#dc3545",
        "#0dcaf0"
      ],

      borderWidth: 1
    }
  ]
};
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
         <div className="notification-bell">

          🔔 {todayFollowups.length}

           </div>
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
<div className="chart-card">

  <h2>
    Lead Status Summary
  </h2>

  <div className="chart-wrapper">
  <Pie data={pieData} />
</div>

</div>


<div className="funnel-card">

  <h2>Sales Conversion Funnel</h2>

  <div className="funnel-step">

    <div className="funnel-box total">
      <h3>Total Leads</h3>
      <span>{stats.total}</span>
    </div>

    <div className="funnel-arrow">➜</div>

    <div className="funnel-box interested">
      <h3>Interested</h3>
      <span>{stats.interested}</span>
    </div>

    <div className="funnel-arrow">➜</div>

    <div className="funnel-box visit">
      <h3>Site Visits</h3>
      <span>{stats.visits}</span>
    </div>

    <div className="funnel-arrow">➜</div>

    <div className="funnel-box booked">
      <h3>Booked</h3>
      <span>{stats.booked}</span>
    </div>

  </div>

</div>
{/* =========================================
   TODAY TASKS
========================================= */}

<div className="tasks-widget">

  <h2>Today's Tasks</h2>

  <div className="tasks-grid">

    <div className="task-box followup-task">
      <h3>🔔 Today's Followups</h3>
      <span>{stats.followups}</span>
    </div>

    <div className="task-box visit-task">
      <h3>🏠 Today's Site Visits</h3>
      <span>{stats.visits}</span>
    </div>

    <div className="task-box call-task">
      <h3>📞 Pending Calls</h3>
      <span>{stats.pending}</span>
    </div>

  </div>

</div>

<div className="project-list">

  {projectStats.map(
    (project, index) => (

      <div key={index}>

        <div className="project-item">

          <span>
            {project.project}
          </span>

          <strong>
            {project.count}
          </strong>

        </div>

        <div className="project-bar">

          <div
            className="project-fill"
            style={{
              width: `${
                (project.count /
                  projectStats[0]?.count) *
                100
              }%`
            }}
          />

        </div>

      </div>

    )
  )}

</div>
        </div>

      </div>

    </div>

  );

}