import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import {
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import CountUp from "react-countup";
import "chart.js/auto";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function Dashboard() {

  const navigate = useNavigate();

  /* =========================================
     SIDEBAR
  ========================================= */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };


  /* =========================================
     PROFILE
  ========================================= */

  const [profileOpen, setProfileOpen] = useState(false);


  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");

  };


  /* =========================================
     USER
  ========================================= */

  const user = useMemo(() => {

    try {

      return (
        JSON.parse(
          localStorage.getItem("user")
        ) || {}
      );

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

  const fetchDashboard = useCallback(
    async () => {

      try {

        if (
          !user?.email ||
          !user?.role
        ) {

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

        setDashboard(
          res.data || {}
        );

      } catch (err) {

        console.log(
          "Dashboard Error ❌",
          err
        );

      } finally {

        setLoading(false);

      }

    },
    [user]
  );


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {

    fetchDashboard();

  }, [fetchDashboard]);


  /* =========================================
     UI
  ========================================= */

  return (

    <div className="dashboard-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />


      {/* =====================================
          MAIN DASHBOARD AREA
      ===================================== */}

      <div
        className={`dashboard-container ${
          isOpen
            ? "sidebar-open"
            : "sidebar-close"
        }`}
      >


        {/* ===================================
            TOP HEADER
        =================================== */}

        <div
          className="dashboard-topbar"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9999,
            width: "100%",
            minHeight: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 24px",
            boxSizing: "border-box"
          }}
        >


          {/* LEFT SIDE */}

          <div
            className="dashboard-topbar-left"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px"
            }}
          >

            <button
              className="topbar-menu-btn"
              onClick={toggleSidebar}
              type="button"
              style={{
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
                padding: "5px 10px"
              }}
            >
              ☰
            </button>


            <span
              className="topbar-title"
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937"
              }}
            >
              CRM Dashboard
            </span>

          </div>



          {/* RIGHT SIDE */}

          <div
            className="dashboard-topbar-right"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}
          >

            <button
              className="profile-btn"
              onClick={() =>
                setProfileOpen(
                  (prev) => !prev
                )
              }
              type="button"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0
              }}
            >

              <span
                className="profile-circle"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #7c3aed, #9333ea)",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "16px"
                }}
              >

                {(
                  user?.name ||
                  user?.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}

              </span>

            </button>



            {/* =================================
                PROFILE DROPDOWN
            ================================= */}

            {profileOpen && (

              <div
                className="profile-dropdown"
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  width: "260px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.18)",
                  border:
                    "1px solid #e5e7eb",
                  padding: "18px",
                  zIndex: 10000
                }}
              >

                <div
                  className="profile-name"
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: "6px"
                  }}
                >
                  {user?.name || "User"}
                </div>


                <div
                  className="profile-email"
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    wordBreak: "break-word"
                  }}
                >
                  {user?.email || ""}
                </div>


                <div
                  className="profile-divider"
                  style={{
                    height: "1px",
                    background: "#e5e7eb",
                    margin:
                      "15px 0"
                  }}
                />


                <button
                  className="profile-logout"
                  onClick={handleLogout}
                  type="button"
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: "7px",
                    padding: "10px 12px",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>



        {/* ===================================
            DASHBOARD CONTENT
        =================================== */}

        <div className="dashboard-content">


          {/* =================================
              LOADING
          ================================= */}

          {loading ? (

            <div className="loading-box">

              <h5>
                Loading Dashboard...
              </h5>

            </div>

          ) : (

            <>


              {/* =================================
                  ROW 1 — SUMMARY CARDS
              ================================= */}

              <div className="cards-grid">

                {[

                  {
                    title: "Total Leads",
                    value:
                      dashboard.total,
                    cls:
                      "card-blue"
                  },

                  {
                    title: "New Leads",
                    value:
                      dashboard.new,
                    cls:
                      "card-blue"
                  },

                  {
                    title: "Interested",
                    value:
                      dashboard.interested,
                    cls:
                      "card-green"
                  },

                  {
                    title: "Booked",
                    value:
                      dashboard.booked,
                    cls:
                      "card-green"
                  },

                  {
                    title: "Pending",
                    value:
                      dashboard.pending,
                    cls:
                      "card-yellow"
                  },

                  {
                    title:
                      "Not Interested",
                    value:
                      dashboard.not_interested,
                    cls:
                      "card-red"
                  },

                  {
                    title:
                      "Reception Entries",
                    value:
                      dashboard.receptionEntries,
                    cls:
                      "card-purple"
                  }

                ].map((item) => (

                  <div
                    key={item.title}
                    className={`compact-card ${item.cls}`}
                    style={{
                      cursor: "pointer"
                    }}

                    onClick={() => {

                      console.log(
                        "Clicked:",
                        item.title
                      );


                      if (
                        item.title ===
                        "Total Leads"
                      ) {

                        navigate(
                          "/reports/total-leads"
                        );

                      }

                      else if (
                        item.title ===
                        "New Leads"
                      ) {

                        navigate(
                          "/reports/new-leads"
                        );

                      }

                      else if (
                        item.title ===
                        "Interested"
                      ) {

                        navigate(
                          "/reports/status/interested"
                        );

                      }

                      else if (
                        item.title ===
                        "Booked"
                      ) {

                        navigate(
                          "/reports/status/booked"
                        );

                      }

                      else if (
                        item.title ===
                        "Pending"
                      ) {

                        navigate(
                          "/reports/status/new"
                        );

                      }

                      else if (
                        item.title ===
                        "Not Interested"
                      ) {

                        navigate(
                          "/reports/status/not-interested"
                        );

                      }

                      else if (
                        item.title ===
                        "Reception Entries"
                      ) {

                        navigate(
                          "/visit-entries"
                        );

                      }

                    }}
                  >

                    <h6>
                      {item.title}
                    </h6>

                    <h3>

                      <CountUp
                        end={
                          item.value || 0
                        }
                        duration={1}
                      />

                    </h3>

                  </div>

                ))}

              </div>



              {/* =================================
                  ROW 3 — EXECUTIVE PERFORMANCE
              ================================= */}

              <div
                className="chart-card mt-4"
              >

                <h5>
                  Executive Performance
                </h5>


                <div
                  className="table-responsive"
                >

                  <table
                    className="table table-bordered"
                  >

                    <thead>

                      <tr>

                        <th>
                          Name
                        </th>

                        <th>
                          Today's Assigned
                        </th>

                        <th>
                          Total Leads
                        </th>

                        <th>
                          Interested
                        </th>

                        <th>
                          Booked
                        </th>

                        <th>
                          Pending
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {dashboard
                        .executives
                        ?.length > 0 ? (

                        dashboard.executives

                          .filter(
                            (e) =>
                              e.name &&
                              e.name.trim() !== ""
                          )

                          .map(
                            (e, i) => (

                              <tr
                                key={i}
                              >

                                <td>

                                  {(e.name || "")
                                    .includes("@")

                                    ? e.name.split(
                                        "@"
                                      )[0]

                                    : e.name || "-"

                                  }

                                </td>


                                <td>
                                  {e.todayAssigned}
                                </td>


                                <td>
                                  {e.total}
                                </td>


                                <td>
                                  {e.interested}
                                </td>


                                <td>
                                  {e.booked}
                                </td>


                                <td>
                                  {e.pending}
                                </td>

                              </tr>

                            )
                          )

                      ) : (

                        <tr>

                          <td
                            colSpan="6"
                            align="center"
                          >
                            No Executive Data
                          </td>

                        </tr>

                      )}

                    </tbody>

                  </table>

                </div>

              </div>



              {/* =================================
                  ROW 4
              ================================= */}

              <div
                className="dashboard-row mt-4"
              >


                {/* ASSIGNMENT */}

                <div
                  className="chart-half"
                >

                  <div
                    className="chart-card"
                  >

                    <h5>
                      Lead Assignment Summary
                    </h5>


                    <Doughnut
                      data={{

                        labels:
                          dashboard
                            .assignments
                            ?.map(
                              (i) =>
                                i.name
                            ),

                        datasets: [

                          {

                            data:
                              dashboard
                                .assignments
                                ?.map(
                                  (i) =>
                                    i.count
                                )

                          }

                        ]

                      }}
                    />

                  </div>

                </div>



                {/* LEADERBOARD */}

                <div
                  className="chart-half"
                >

                  <div
                    className="chart-card"
                  >

                    <h5>
                      Team Leaderboard
                    </h5>


                    <div
                      className="leaderboard-list"
                    >

                      {dashboard
                        .leaderboard
                        ?.length > 0 ? (

                        dashboard
                          .leaderboard
                          .map(
                            (l, index) => (

                              <div
                                className="leader-item"
                                key={index}
                              >

                                <span>

                                  {index + 1}{" "}

                                  {l.name
                                    ?.includes(
                                      "@"
                                    )

                                    ? l.name.split(
                                        "@"
                                      )[0]

                                    : l.name || "-"

                                  }

                                </span>


                                <strong>
                                  {l.count}
                                </strong>

                              </div>

                            )
                          )

                      ) : (

                        <p>
                          No Leaderboard Data
                        </p>

                      )}

                    </div>

                  </div>

                </div>

              </div>



              {/* =================================
                  ROW 5
              ================================= */}

              <div
                className="dashboard-row mt-4"
              >


                {/* FOLLOWUPS */}

                <div
                  className="chart-half"
                >

                  <div
                    className="chart-card"
                  >

                    <h5>
                      Today's Followups
                    </h5>


                    <div
                      className="activity-list"
                    >

                      {dashboard
                        .followups
                        ?.length > 0 ? (

                        dashboard
                          .followups
                          .map(
                            (f, i) => (

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

                            )
                          )

                      ) : (

                        <p>
                          No Followups
                        </p>

                      )}

                    </div>

                  </div>

                </div>



                {/* MISSED */}

                <div
                  className="chart-half"
                >

                  <div
                    className="chart-card"
                  >

                    <h5>
                      Missed Followups
                    </h5>


                    <div
                      className="activity-list"
                    >

                      {dashboard
                        .missedFollowups
                        ?.length > 0 ? (

                        dashboard
                          .missedFollowups
                          .map(
                            (f, i) => (

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

                            )
                          )

                      ) : (

                        <p>
                          No Missed Followups
                        </p>

                      )}

                    </div>

                  </div>

                </div>

              </div>



              {/* =================================
                  TODAY'S VISITS
              ================================= */}

              <div
                className="chart-card mt-4"
              >

                <h5>
                  Today's Visits
                </h5>


                <div
                  className="table-responsive"
                >

                  <table
                    className="table table-bordered"
                  >

                    <thead>

                      <tr>

                        <th>
                          Sr No
                        </th>

                        <th>
                          Client
                        </th>

                        <th>
                          Mobile
                        </th>

                        <th>
                          Project
                        </th>

                        <th>
                          Manager
                        </th>

                        <th>
                          Visit Date
                        </th>

                        <th>
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {dashboard
                        .todayVisitList
                        ?.length > 0 ? (

                        dashboard
                          .todayVisitList
                          .map(
                            (
                              visit,
                              index
                            ) => (

                              <tr
                                key={
                                  visit._id
                                }
                              >

                                <td>
                                  {index + 1}
                                </td>

                                <td>
                                  {
                                    visit.clientName
                                  }
                                </td>

                                <td>
                                  {
                                    visit.mobile
                                  }
                                </td>

                                <td>
                                  {
                                    visit.project
                                  }
                                </td>

                                <td>
                                  {
                                    visit.assigned_manager ||
                                    "-"
                                  }
                                </td>

                                <td>

                                  {visit.visitDate

                                    ? new Date(
                                        visit.visitDate
                                      ).toLocaleString(
                                        "en-IN"
                                      )

                                    : "-"

                                  }

                                </td>

                                <td>

                                  <span className="badge bg-success">

                                    {
                                      visit.visitStatus
                                    }

                                  </span>

                                </td>

                              </tr>

                            )
                          )

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



              {/* =================================
                  RECENT ACTIVITIES
              ================================= */}

              <div
                className="chart-card mt-4"
              >

                <h5>
                  Recent Activities
                </h5>


                <div
                  className="activity-list"
                >

                  {dashboard
                    .activities
                    ?.length > 0 ? (

                    dashboard
                      .activities
                      .map(
                        (a, i) => (

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

                        )
                      )

                  ) : (

                    <p>
                      No Activities Found
                    </p>

                  )}

                </div>

              </div>


            </>

          )}

        </div>

      </div>

    </div>

  );

}