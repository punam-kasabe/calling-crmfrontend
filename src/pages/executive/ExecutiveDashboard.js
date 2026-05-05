// FILE: src/pages/executive/ExecutiveDashboard.js

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
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../../styles/executiveDashboard.css";

const API = "http://localhost:5000/api";

export default function ExecutiveDashboard() {

  const navigate = useNavigate();

  const [isOpen, setIsOpen] =
    useState(true);

  const toggleSidebar = () =>
    setIsOpen(!isOpen);

  const [search, setSearch] =
    useState("");

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

        if (!user?.email) return;

        const res =
          await axios.get(
            `${API}/executive/dashboard`,
            {
              params: {
                email: user.email,
              },
            }
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

      } catch (err) {

        console.log(
          "Dashboard Error ❌",
          err
        );

      }

}, [user.email]);

  /* ===================================== */
  /* USE EFFECT */
  /* ===================================== */

  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);

  /* ===================================== */
  /* SEARCH FILTER */
  /* ===================================== */

  const filteredLeads =
    recentLeads.filter((lead) =>

      lead.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      lead.phone
        ?.includes(search) ||

      lead.project
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

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

      {/* SIDEBAR */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN */}

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

            <p>

              Welcome back,
              {" "}

              <strong>
                {user.name}
              </strong>

            </p>

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

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

                {filteredLeads.length > 0 ? (

                  filteredLeads.map(
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

        </div>

      </div>

    </div>
  );
}