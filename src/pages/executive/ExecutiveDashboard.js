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
} from "lucide-react";


import { useNavigate } from "react-router-dom";

import "../../styles/executiveDashboard.css";

const API = "https://calling-crm-backend-7w52.onrender.com/api";

export default function ExecutiveDashboard() {

  const navigate = useNavigate();

  const [isOpen, setIsOpen] =
    useState(true);

  const toggleSidebar = () =>
    setIsOpen(!isOpen);

  

  /* ===================================== */
  /* POPUP STATE */
  /* ===================================== */

  const [showPopup, setShowPopup] =
    useState(false);

  const [popupData, setPopupData] =
    useState({
      todayFollowupsList: [],
      todaySiteVisits: [],
    });

  /* ===================================== */
  /* STATS */
  /* ===================================== */

  const [stats, setStats] =
    useState({
      totalLeads: 0,
      followups: 0,
      calls: 0,
      converted: 0,
      todayFollowups: 0,
      hotLeads: 0,
      pendingCalls: 0,
    });

  const [recentLeads, setRecentLeads] =
    useState([]);
  
  const [recentActivities, setRecentActivities] =
  useState([]);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  /* ===================================== */
  /* FETCH DASHBOARD */
  /* ===================================== */

  const fetchDashboard =
    useCallback(async () => {

      try {

    if (!user?.id) return;

        const res =
  await axios.get(
    `${API}/executive/dashboard/${user.id}`
  );
        setStats({

          totalLeads:
            res.data.totalLeads || 0,

          followups:
            res.data.followups || 0,

          calls:
            res.data.calls || 0,

          converted:
            res.data.converted || 0,

          todayFollowups:
            res.data.todayFollowups || 0,

          hotLeads:
            res.data.hotLeads || 0,

          pendingCalls:
            res.data.pendingCalls || 0,

        });

        setRecentLeads(
          res.data.recentLeads || []
        );


         setRecentActivities(
         res.data.recentActivities || []
           );
        /* ===================================== */
        /* POPUP DATA */
        /* ===================================== */

        setPopupData({

          todayFollowupsList:
            res.data.todayFollowupsList || [],

          todaySiteVisits:
            res.data.todaySiteVisits || [],

        });

        /* ===================================== */
        /* AUTO OPEN POPUP */
        /* ===================================== */

        if (
          (res.data.todayFollowupsList
            ?.length > 0) ||

          (res.data.todaySiteVisits
            ?.length > 0)
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

  /* ===================================== */
  /* USE EFFECT */
  /* ===================================== */

  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);


  /* ===================================== */
  /* QUICK ACTIONS */
  /* ===================================== */

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

  return (

    <div className="executive-layout">

      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* ===================================== */}
      {/* POPUP */}
      {/* ===================================== */}

      {showPopup && (

        <div className="work-popup-overlay">

          <div className="work-popup">

            <div className="popup-header">

              <h2>

                <Bell size={22} />

                Today's Work

              </h2>

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

              <h3>
                📞 Today's Followups
              </h3>

              {popupData
                .todayFollowupsList
                ?.length > 0 ? (

                popupData
                  .todayFollowupsList
                  .map((lead, index) => (

                    <div
                      className="popup-item"
                      key={index}
                    >

                      <strong>
                        {lead.name}
                      </strong>

                      <span>
                        {lead.phone}
                      </span>

                      <small>
                        {lead.project}
                      </small>

                    </div>

                  ))

              ) : (

                <p>
                  No Followups Today
                </p>

              )}

            </div>

            {/* SITE VISITS */}

            <div className="popup-section">

              <h3>

                <MapPinned
                  size={18}
                />

                Today's Site Visits

              </h3>

              {popupData
                .todaySiteVisits
                ?.length > 0 ? (

                popupData
                  .todaySiteVisits
                  .map((visit, index) => (

                    <div
                      className="popup-item"
                      key={index}
                    >

                      <strong>
                        {visit.name}
                      </strong>

                      <span>
                        {visit.phone}
                      </span>

                      <small>
                        {visit.project}
                      </small>

                    </div>

                  ))

              ) : (

                <p>
                  No Site Visits Today
                </p>

              )}

            </div>

          </div>

        </div>

      )}

      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <div
        className={`executive-main ${
          isOpen
            ? "sidebar-open"
            : "sidebar-close"
        }`}
      >

        {/* HEADER */}

        <div className="executive-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p className="welcome-text">
             Welcome back, <strong>{user.name}</strong>
               </p>

          </div>
          

        </div>

        {/* ===================================== */}
        {/* STATS */}
        {/* ===================================== */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              <Users size={28} />
            </div>

            <div>

              <h2>
                {stats.totalLeads}
              </h2>

              <p>
                Total Leads
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <ClipboardList size={28} />
            </div>

            <div>

              <h2>
                {stats.followups}
              </h2>

              <p>
                Followups
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <PhoneCall size={28} />
            </div>

            <div>

              <h2>
                {stats.calls}
              </h2>

              <p>
                Calls Done
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <CheckCircle size={28} />
            </div>

            <div>

              <h2>
                {stats.converted}
              </h2>

              <p>
                Converted Leads
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <CalendarCheck size={28} />
            </div>

            <div>

              <h2>
                {stats.todayFollowups}
              </h2>

              <p>
                Today's Followups
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <Flame size={28} />
            </div>

            <div>

              <h2>
                {stats.hotLeads}
              </h2>

              <p>
                Hot Leads
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              <Clock3 size={28} />
            </div>

            <div>

              <h2>
                {stats.pendingCalls}
              </h2>

              <p>
                Pending Calls
              </p>

            </div>

          </div>

        </div>

        {/* ===================================== */}
        {/* QUICK ACTIONS */}
        {/* ===================================== */}

        <div className="quick-actions">

          <button
            onClick={handleAddFollowup}
          >
            Add Followup
          </button>

          <button
            onClick={handleCallClient}
          >
            Call Client
          </button>

          <button
            onClick={handleUpdateStatus}
          >
            Update Status
          </button>

          <button
            onClick={handleScheduleVisit}
          >
            Schedule Visit
          </button>

        </div>

        {/* ===================================== */}
        {/* RECENT LEADS */}
        {/* ===================================== */}

        <div className="recent-section">

          <h3>
            Recent Leads
          </h3>

          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

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

                      <tr
                        key={lead._id}
                      >

                        <td>
                          {lead.name}
                        </td>

                        <td>
                          {lead.phone}
                        </td>

                        <td>
                          {lead.project}
                        </td>

                        <td>

                          <span
                            className={`status ${lead.status}`}
                          >
                            {lead.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                    >
                      No leads found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>
          {/* RECENT ACTIVITIES */}

<div className="recent-section">

  <h3>
    Recent Activities
  </h3>

  <div className="table-wrapper">

    <table>

      <thead>

<tr>

  <th>Created Date</th>

  <th>Client</th>

  <th>Status</th>

  <th>Remark</th>

  <th>Updated Date</th>

</tr>

</thead>


      <tbody>

{recentActivities.length > 0 ? (

  recentActivities.map((item, index) => (

    <tr key={index}>

      <td>
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-IN")
          : "-"}
      </td>

      <td>{item.name}</td>

      <td>{item.status}</td>

      <td>{item.remark || "-"}</td>

      <td>
        {item.updatedAt
          ? new Date(item.updatedAt).toLocaleString("en-IN")
          : "-"}
      </td>

    </tr>

  ))

) : (

<tr>
  <td colSpan="5" style={{ textAlign: "center" }}>
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

    </div>
  );
}