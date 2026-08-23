import {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import {
  Users,
  PhoneCall,
  ClipboardList,
  CheckCircle,
  CalendarCheck,
  Flame,
  Clock3,
  Bell,
  MapPinned,
  TrendingUp,
  Target,
  Activity,
  ArrowUpRight,
  Phone,
  CalendarDays,
  UserCheck,
  BarChart3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/executiveDashboard.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function ExecutiveDashboard() {
  const navigate = useNavigate();

  /* =====================================
     SIDEBAR
  ===================================== */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  /* =====================================
     POPUP STATE
  ===================================== */

  const [showPopup, setShowPopup] = useState(false);

  const [popupData, setPopupData] = useState({
    todayFollowupsList: [],
    todaySiteVisits: [],
  });

  /* =====================================
     STATS
  ===================================== */

  const [stats, setStats] = useState({
  totalLeads: 0,
  followups: 0,
  calls: 0,
  bookingDone: 0,
  todayFollowups: 0,
  hotLeads: 0,
  pendingCalls: 0,
});


  /* =====================================
     RECENT DATA
  ===================================== */

  const [recentLeads, setRecentLeads] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  /* =====================================
     USER
  ===================================== */

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  /* =====================================
     FETCH DASHBOARD
  ===================================== */

  const fetchDashboard = useCallback(async () => {
    try {
      if (!user?.id) return;

      const res = await axios.get(
        `${API}/executive/dashboard/${user.id}`
      );

      /* ================================
         STATS
      ================================= */

      setStats({
        totalLeads: res.data.totalLeads || 0,
        followups: res.data.followups || 0,
        calls: res.data.calls || 0,
         bookingDone: res.data.bookingDone || 0,
        todayFollowups: res.data.todayFollowups || 0,
        hotLeads: res.data.hotLeads || 0,
        pendingCalls: res.data.pendingCalls || 0,
      });

      /* ================================
         RECENT LEADS
      ================================= */

      setRecentLeads(
        res.data.recentLeads || []
      );

      /* ================================
         RECENT ACTIVITIES
      ================================= */

      setRecentActivities(
        res.data.recentActivities || []
      );

      /* ================================
         POPUP DATA
      ================================= */

      const followups =
        res.data.todayFollowupsList || [];

      const siteVisits =
        res.data.todaySiteVisits || [];

      setPopupData({
        todayFollowupsList: followups,
        todaySiteVisits: siteVisits,
      });

      /* ================================
         AUTO OPEN TODAY'S WORK
      ================================= */

      if (
        followups.length > 0 ||
        siteVisits.length > 0
      ) {
        setShowPopup(true);
      }
    } catch (err) {
      console.log(
        "Dashboard Error ❌",
        err
      );
    }
  }, [user?.id]);

  /* =====================================
     USE EFFECT
  ===================================== */

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* =====================================
     CALCULATED PERFORMANCE
  ===================================== */

  const conversionRate =
    stats.totalLeads > 0
      ? (
          (stats.converted /
            stats.totalLeads) *
          100
        ).toFixed(1)
      : 0;

  const followupRate =
    stats.totalLeads > 0
      ? (
          (stats.followups /
            stats.totalLeads) *
          100
        ).toFixed(1)
      : 0;

  const callActivityRate =
    stats.totalLeads > 0
      ? (
          (stats.calls /
            stats.totalLeads) *
          100
        ).toFixed(1)
      : 0;

  /* =====================================
     QUICK ACTIONS
  ===================================== */

  const handleAddFollowup = () => {
    navigate("/followups");
  };

  const handleCallClient = () => {
    navigate("/call-logs");
  };

  const handleUpdateStatus = () => {
    navigate("/my-leads");
  };

  const handleScheduleVisit = () => {
    navigate("/site-visits");
  };

  const handleViewLeads = () => {
    navigate("/my-leads");
  };

  /* =====================================
     STATUS CLASS
  ===================================== */

  const getStatusClass = (status) => {
    if (!status) return "default";

    return status
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="executive-layout">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* =====================================
          TODAY'S WORK POPUP
      ===================================== */}

      {showPopup && (
        <div className="work-popup-overlay">

          <div className="work-popup">

            {/* POPUP HEADER */}

            <div className="popup-header">

              <div className="popup-title">
                <div className="popup-title-icon">
                  <Bell size={20} />
                </div>

                <div>
                  <h2>Today's Work</h2>

                  <p>
                    Your important tasks for today
                  </p>
                </div>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowPopup(false)
                }
              >
                ✕
              </button>

            </div>

            {/* FOLLOWUPS */}

            <div className="popup-section">

              <div className="popup-section-heading">

                <div className="popup-heading-icon followup">
                  <PhoneCall size={17} />
                </div>

                <div>
                  <h3>
                    Today's Followups
                  </h3>

                  <span>
                    {
                      popupData
                        .todayFollowupsList
                        ?.length || 0
                    }{" "}
                    followups
                  </span>
                </div>

              </div>

              {popupData
                .todayFollowupsList
                ?.length > 0 ? (

                <div className="popup-list">

                  {popupData
                    .todayFollowupsList
                    .map(
                      (lead, index) => (
                        <div
                          className="popup-item"
                          key={index}
                        >

                          <div className="popup-item-main">

                            <strong>
                              {lead.name ||
                                "Unknown Client"}
                            </strong>

                            <span>
                              {lead.phone ||
                                "-"}
                            </span>

                          </div>

                          <small>
                            {lead.project ||
                              "No Project"}
                          </small>

                        </div>
                      )
                    )}

                </div>

              ) : (

                <div className="empty-popup">
                  No Followups Today
                </div>

              )}

            </div>

            {/* SITE VISITS */}

            <div className="popup-section">

              <div className="popup-section-heading">

                <div className="popup-heading-icon visit">
                  <MapPinned size={17} />
                </div>

                <div>
                  <h3>
                    Today's Site Visits
                  </h3>

                  <span>
                    {
                      popupData
                        .todaySiteVisits
                        ?.length || 0
                    }{" "}
                    site visits
                  </span>
                </div>

              </div>

              {popupData
                .todaySiteVisits
                ?.length > 0 ? (

                <div className="popup-list">

                  {popupData
                    .todaySiteVisits
                    .map(
                      (visit, index) => (
                        <div
                          className="popup-item"
                          key={index}
                        >

                          <div className="popup-item-main">

                            <strong>
                              {visit.name ||
                                "Unknown Client"}
                            </strong>

                            <span>
                              {visit.phone ||
                                "-"}
                            </span>

                          </div>

                          <small>
                            {visit.project ||
                              "No Project"}
                          </small>

                        </div>
                      )
                    )}

                </div>

              ) : (

                <div className="empty-popup">
                  No Site Visits Today
                </div>

              )}

            </div>

            {/* POPUP FOOTER */}

            <div className="popup-footer">

              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/followups");
                }}
              >
                View Followups
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/site-visits");
                }}
              >
                View Site Visits
                <ArrowUpRight size={16} />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================
          MAIN
      ===================================== */}

      <div
        className={`executive-main ${
          isOpen
            ? "sidebar-open"
            : "sidebar-close"
        }`}
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="executive-header">

          <div>

            <div className="header-badge">
              <Activity size={14} />
              Executive Workspace
            </div>

            <h1>
              Dashboard
            </h1>

            <p className="welcome-text">
              Welcome back,{" "}
              <strong>
                {user.name || "Executive"}
              </strong>
            </p>

          </div>

          <div className="header-right">

            <div className="today-date">

              <CalendarDays size={17} />

              <span>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>

            </div>

            <button
              className="notification-button"
              onClick={() =>
                setShowPopup(true)
              }
            >
              <Bell size={19} />

              {(popupData
                .todayFollowupsList
                ?.length ||
                0) +
                (popupData
                  .todaySiteVisits
                  ?.length ||
                  0) >
                0 && (
                <span className="notification-dot">
                  {(popupData
                    .todayFollowupsList
                    ?.length ||
                    0) +
                    (popupData
                      .todaySiteVisits
                      ?.length ||
                      0)}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* =====================================
            STATS
        ===================================== */}

        <div className="stats-grid">

          {/* TOTAL LEADS */}

          <div className="stat-card">

            <div className="stat-icon">
              <Users size={24} />
            </div>

            <div className="stat-content">

              <span>
                Total Leads
              </span>

              <h2>
                {stats.totalLeads}
              </h2>

              <small>
                Assigned to you
              </small>

            </div>

          </div>

          {/* FOLLOWUPS */}

          <div className="stat-card">

            <div className="stat-icon">
              <ClipboardList size={24} />
            </div>

            <div className="stat-content">

              <span>
                Followups
              </span>

              <h2>
                {stats.followups}
              </h2>

              <small>
                Total followups
              </small>

            </div>

          </div>

          {/* CALLS */}

          <div className="stat-card">

            <div className="stat-icon">
              <PhoneCall size={24} />
            </div>

            <div className="stat-content">

              <span>
                Calls Done
              </span>

              <h2>
                {stats.calls}
              </h2>

              <small>
                Calling activity
              </small>

            </div>

          </div>

          {/* CONVERTED */}

          <div className="stat-card booking-card">

          <div className="stat-icon">
           <CheckCircle size={28} />
             </div>

           <div>
               <h2>
                {stats.bookingDone}
             </h2>

            <p>
               Booking Done
            </p>

            <span className="stat-subtitle">
              Successful bookings
            </span>
         </div>

           </div>

          {/* TODAY FOLLOWUPS */}

          <div className="stat-card">

            <div className="stat-icon">
              <CalendarCheck size={24} />
            </div>

            <div className="stat-content">

              <span>
                Today's Followups
              </span>

              <h2>
                {stats.todayFollowups}
              </h2>

              <small>
                Due today
              </small>

            </div>

          </div>

          {/* HOT LEADS */}

          <div className="stat-card hot-card">

            <div className="stat-icon">
              <Flame size={24} />
            </div>

            <div className="stat-content">

              <span>
                Hot Leads
              </span>

              <h2>
                {stats.hotLeads}
              </h2>

              <small>
                High priority leads
              </small>

            </div>

          </div>

          {/* PENDING */}

          <div className="stat-card warning-card">

            <div className="stat-icon">
              <Clock3 size={24} />
            </div>

            <div className="stat-content">

              <span>
                Pending Calls
              </span>

              <h2>
                {stats.pendingCalls}
              </h2>

              <small>
                Need attention
              </small>

            </div>

          </div>

        </div>

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <div className="quick-actions-section">

          <div className="section-heading">

            <div>
              <h3>
                Quick Actions
              </h3>

              <p>
                Manage your daily work quickly
              </p>
            </div>

          </div>

          <div className="quick-actions">

            <button
              onClick={handleAddFollowup}
              className="action-primary"
            >
              <ClipboardList size={18} />
              Add Followup
              <ArrowUpRight size={16} />
            </button>

            <button
              onClick={handleCallClient}
            >
              <Phone size={18} />
              Call Client
              <ArrowUpRight size={16} />
            </button>

            <button
              onClick={handleUpdateStatus}
            >
              <CheckCircle size={18} />
              Update Status
              <ArrowUpRight size={16} />
            </button>

            <button
              onClick={handleScheduleVisit}
            >
              <MapPinned size={18} />
              Schedule Visit
              <ArrowUpRight size={16} />
            </button>

          </div>

        </div>

        {/* =====================================
            PERFORMANCE + TODAY'S FOCUS
        ===================================== */}

        <div className="dashboard-two-column">

          {/* PERFORMANCE */}

          <div className="dashboard-panel performance-panel">

            <div className="panel-header">

              <div>

                <h3>
                  My Performance
                </h3>

                <p>
                  Your current sales activity
                </p>

              </div>

              <div className="panel-header-icon">
                <BarChart3 size={19} />
              </div>

            </div>

            <div className="performance-list">

              {/* CONVERSION */}

              <div className="performance-row">

                <div className="performance-label">

                  <div className="performance-icon purple">
                    <TrendingUp size={17} />
                  </div>

                  <div>
                    <strong>
                      Conversion Rate
                    </strong>

                    <span>
                      {stats.converted} converted /
                      {" "}
                      {stats.totalLeads} leads
                    </span>
                  </div>

                </div>

                <strong className="performance-value">
                  {conversionRate}%
                </strong>

              </div>

              <div className="performance-progress">

                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      Number(conversionRate),
                      100
                    )}%`,
                  }}
                />

              </div>

              {/* FOLLOWUP */}

              <div className="performance-row">

                <div className="performance-label">

                  <div className="performance-icon blue">
                    <ClipboardList size={17} />
                  </div>

                  <div>
                    <strong>
                      Follow-up Activity
                    </strong>

                    <span>
                      {stats.followups} followups
                      completed
                    </span>
                  </div>

                </div>

                <strong className="performance-value">
                  {followupRate}%
                </strong>

              </div>

              <div className="performance-progress">

                <div
                  className="progress-fill blue-fill"
                  style={{
                    width: `${Math.min(
                      Number(followupRate),
                      100
                    )}%`,
                  }}
                />

              </div>

              {/* CALL ACTIVITY */}

              <div className="performance-row">

                <div className="performance-label">

                  <div className="performance-icon green">
                    <PhoneCall size={17} />
                  </div>

                  <div>
                    <strong>
                      Call Activity
                    </strong>

                    <span>
                      {stats.calls} calls done
                    </span>
                  </div>

                </div>

                <strong className="performance-value">
                  {callActivityRate}%
                </strong>

              </div>

              <div className="performance-progress">

                <div
                  className="progress-fill green-fill"
                  style={{
                    width: `${Math.min(
                      Number(callActivityRate),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* TODAY'S FOCUS */}

          <div className="dashboard-panel focus-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Today's Focus
                </h3>

                <p>
                  Tasks that need your attention
                </p>

              </div>

              <div className="panel-header-icon">
                <Target size={19} />
              </div>

            </div>

            <div className="focus-grid">

              {/* FOLLOWUPS */}

              <div
                className="focus-card"
                onClick={() =>
                  navigate("/followups")
                }
              >

                <div className="focus-icon followup-icon">
                  <PhoneCall size={20} />
                </div>

                <div>

                  <span>
                    Followups
                  </span>

                  <strong>
                    {popupData
                      .todayFollowupsList
                      ?.length || 0}
                  </strong>

                </div>

                <ArrowUpRight
                  size={17}
                />

              </div>

              {/* SITE VISITS */}

              <div
                className="focus-card"
                onClick={() =>
                  navigate("/site-visits")
                }
              >

                <div className="focus-icon visit-icon">
                  <MapPinned size={20} />
                </div>

                <div>

                  <span>
                    Site Visits
                  </span>

                  <strong>
                    {popupData
                      .todaySiteVisits
                      ?.length || 0}
                  </strong>

                </div>

                <ArrowUpRight
                  size={17}
                />

              </div>

              {/* HOT LEADS */}

              <div
                className="focus-card"
                onClick={handleViewLeads}
              >

                <div className="focus-icon hot-icon">
                  <Flame size={20} />
                </div>

                <div>

                  <span>
                    Hot Leads
                  </span>

                  <strong>
                    {stats.hotLeads}
                  </strong>

                </div>

                <ArrowUpRight
                  size={17}
                />

              </div>

              {/* PENDING CALLS */}

              <div
                className="focus-card"
                onClick={handleCallClient}
              >

                <div className="focus-icon pending-icon">
                  <Clock3 size={20} />
                </div>

                <div>

                  <span>
                    Pending Calls
                  </span>

                  <strong>
                    {stats.pendingCalls}
                  </strong>

                </div>

                <ArrowUpRight
                  size={17}
                />

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            RECENT LEADS
        ===================================== */}

        <div className="recent-section">

          <div className="section-heading">

            <div>

              <h3>
                Recent Leads
              </h3>

              <p>
                Latest leads assigned to you
              </p>

            </div>

            <button
              className="view-all-btn"
              onClick={handleViewLeads}
            >
              View All
              <ArrowUpRight size={15} />
            </button>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Date
                  </th>

                  <th>
                    Client
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentLeads.length > 0 ? (

                  recentLeads.map(
                    (lead) => (

                      <tr key={lead._id}>

                        <td>
                          {lead.createdAt
                            ? new Date(
                                lead.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td>

                          <div className="client-cell">

                            <div className="client-avatar">
                              {(
                                lead.name ||
                                "?"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {lead.name ||
                                "-"}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {lead.phone ||
                            "-"}
                        </td>

                        <td>
                          {lead.project ||
                            "-"}
                        </td>

                        <td>

                          <span
                            className={`status ${getStatusClass(
                              lead.status
                            )}`}
                          >
                            {lead.status ||
                              "New"}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      <UserCheck
                        size={22}
                      />

                      No leads found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =====================================
            RECENT ACTIVITIES
        ===================================== */}

        <div className="recent-section">

          <div className="section-heading">

            <div>

              <h3>
                Recent Activities
              </h3>

              <p>
                Your latest lead updates
              </p>

            </div>

          </div>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Created Date
                  </th>

                  <th>
                    Client
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Remark
                  </th>

                  <th>
                    Updated Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentActivities.length > 0 ? (

                  recentActivities.map(
                    (item, index) => (

                      <tr key={index}>

                        <td>
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td>

                          <div className="client-cell">

                            <div className="client-avatar activity-avatar">
                              {(
                                item.name ||
                                "?"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {item.name ||
                                "-"}
                            </strong>

                          </div>

                        </td>

                        <td>

                          <span
                            className={`status ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status ||
                              "-"}
                          </span>

                        </td>

                        <td className="remark-cell">
                          {item.remark ||
                            "-"}
                        </td>

                        <td>
                          {item.updatedAt
                            ? new Date(
                                item.updatedAt
                              ).toLocaleString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      <Activity
                        size={22}
                      />

                      No Recent Activities

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}