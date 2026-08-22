import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import {
  Users,
  UserPlus,
  Heart,
  CalendarCheck,
  Phone,
  MapPin,
  TrendingUp,
  BarChart3,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Target,
  Clock,
  Building2
} from "lucide-react";

import "../../styles/executiveReports.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function ExecutiveReports() {

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };


  /* =====================================================
     USER
  ===================================================== */

  const user =
    JSON.parse(localStorage.getItem("user")) || {};


  /* =====================================================
     STATES
  ===================================================== */

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [reportType, setReportType] =
    useState("overall");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const leadsPerPage = 20;


  /* =====================================================
     FETCH DATA
  ===================================================== */

  const fetchReportData = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/my-leads`,
        {
          params: {
            email: user.email
          }
        }
      );

      setLeads(res.data || []);

    } catch (err) {

      console.log(
        "Executive Reports Error:",
        err
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (user.email) {
      fetchReportData();
    }

  }, [user.email]);


  /* =====================================================
     FILTERED LEADS
  ===================================================== */

  const filteredLeads = useMemo(() => {

    let result = [...leads];


    /* DATE FILTER */

    if (reportType === "daily" && selectedDate) {

      result = result.filter(
        (lead) =>
          lead.createdAt?.split("T")[0] ===
          selectedDate
      );

    }


    /* WEEK FILTER */

    if (reportType === "weekly") {

      const today = new Date();

      const start = new Date();

      start.setHours(0, 0, 0, 0);

      start.setDate(
        today.getDate() - 6
      );

      result = result.filter((lead) => {

        const date =
          new Date(lead.createdAt);

        return date >= start &&
          date <= today;

      });

    }


    /* MONTH FILTER */

    if (
      reportType === "monthly" &&
      selectedMonth
    ) {

      result = result.filter((lead) => {

        const date =
          new Date(lead.createdAt);

        const month =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

        return month === selectedMonth;

      });

    }


    /* SEARCH */

    if (search.trim()) {

      const q =
        search.toLowerCase().trim();

      result = result.filter((lead) => {

        return (

          lead.name
            ?.toLowerCase()
            .includes(q)

          ||

          lead.phone
            ?.toString()
            .includes(q)

          ||

          lead.project
            ?.toLowerCase()
            .includes(q)

          ||

          lead.status
            ?.toLowerCase()
            .includes(q)

        );

      });

    }


    return result;

  }, [
    leads,
    reportType,
    selectedDate,
    selectedMonth,
    search
  ]);


  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredLeads.length /
        leadsPerPage
      )
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages
    );

  const indexOfFirstLead =
    (safePage - 1) *
    leadsPerPage;

  const displayLeads =
    filteredLeads.slice(
      indexOfFirstLead,
      indexOfFirstLead +
        leadsPerPage
    );


  /* =====================================================
     DATE HELPERS
  ===================================================== */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  /* =====================================================
     STATISTICS
  ===================================================== */

  const stats = useMemo(() => {

    const total =
      filteredLeads.length;

    const newLeads =
      filteredLeads.filter(
        (lead) =>
          lead.status === "New"
      ).length;

    const interested =
      filteredLeads.filter(
        (lead) =>
          lead.status === "Interested" ||
          lead.status ===
            "Very Interested"
      ).length;

    const followup =
      filteredLeads.filter(
        (lead) =>
          lead.status === "Followup" ||
          lead.status === "Follow Up"
      ).length;

    const booked =
      filteredLeads.filter(
        (lead) =>
          lead.status === "Booked"
      ).length;

    const siteVisit =
      filteredLeads.filter(
        (lead) =>
          lead.status ===
          "Site Visit"
      ).length;

    const notInterested =
      filteredLeads.filter(
        (lead) =>
          lead.status ===
          "Not Interested"
      ).length;

    const callback =
      filteredLeads.filter(
        (lead) =>
          lead.status ===
          "Call Back"
      ).length;

    const meeting =
      filteredLeads.filter(
        (lead) =>
          lead.status ===
          "Meeting Scheduled"
      ).length;


    const todayLeads =
      leads.filter(
        (lead) =>
          lead.createdAt
            ?.split("T")[0] === today
      ).length;


    const weekStart =
      new Date();

    weekStart.setHours(
      0,
      0,
      0,
      0
    );

    weekStart.setDate(
      weekStart.getDate() - 6
    );


    const weekLeads =
      leads.filter((lead) => {

        const d =
          new Date(lead.createdAt);

        return d >= weekStart;

      }).length;


    const currentMonth =
      new Date().getMonth();

    const currentYear =
      new Date().getFullYear();


    const monthLeads =
      leads.filter((lead) => {

        const d =
          new Date(lead.createdAt);

        return (
          d.getMonth() ===
            currentMonth &&
          d.getFullYear() ===
            currentYear
        );

      }).length;


    const conversion =
      total > 0
        ? (
            (booked / total) *
            100
          ).toFixed(1)
        : 0;


    return {

      total,

      today:
        todayLeads,

      week:
        weekLeads,

      month:
        monthLeads,

      new:
        newLeads,

      interested,

      followup,

      booked,

      siteVisit,

      notInterested,

      callback,

      meeting,

      conversion

    };

  }, [
    filteredLeads,
    leads,
    today
  ]);


  /* =====================================================
     STATUS CHART
  ===================================================== */

  const statusData =
    useMemo(() => {

      const count = {};

      filteredLeads.forEach(
        (lead) => {

          const status =
            lead.status ||
            "No Status";

          count[status] =
            (count[status] || 0) +
            1;

        }
      );

      return Object.entries(
        count
      ).map(
        ([name, value]) => ({
          name,
          value
        })
      );

    }, [filteredLeads]);


  /* =====================================================
     TODAY FOLLOWUPS
  ===================================================== */

  const todayFollowups =
    useMemo(() => {

      const filterDate =
        selectedDate || today;

      return leads.filter(
        (lead) => {

          const nextCall =
            lead.next_call_date
              ?.split("T")[0];

          return (
            nextCall ===
              filterDate &&
            (
              lead.status ===
                "Followup" ||
              lead.status ===
                "Follow Up"
            )
          );

        }
      );

    }, [
      leads,
      selectedDate,
      today
    ]);


  /* =====================================================
     SELECTED STATUS
  ===================================================== */

  const statusWiseLeads =
    useMemo(() => {

      if (!selectedStatus)
        return [];

      return filteredLeads.filter(
        (lead) =>
          (
            lead.status ||
            "No Status"
          ) === selectedStatus
      );

    }, [
      filteredLeads,
      selectedStatus
    ]);


  /* =====================================================
     PROJECT DATA
  ===================================================== */

  const projectData =
    useMemo(() => {

      const count = {};

      filteredLeads.forEach(
        (lead) => {

          const project =
            lead.project ||
            "Unknown";

          count[project] =
            (count[project] || 0) +
            1;

        }
      );

      return Object.entries(
        count
      )
        .map(
          ([name, leads]) => ({
            name,
            leads
          })
        )
        .sort(
          (a, b) =>
            b.leads -
            a.leads
        )
        .slice(0, 8);

    }, [filteredLeads]);


  /* =====================================================
     COLORS
  ===================================================== */

  const COLORS = [
    "#4f46e5",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#64748b"
  ];


  /* =====================================================
     REPORT TITLE
  ===================================================== */

  const reportTitle = {

    overall:
      "Executive Performance",

    daily:
      "Daily Performance",

    weekly:
      "Weekly Performance",

    monthly:
      "Monthly Performance"

  }[reportType];


  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {

    setSelectedDate("");

    setSelectedMonth("");

    setSelectedStatus("");

    setSearch("");

    setReportType(
      "overall"
    );

    setCurrentPage(1);

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div className="executive-layout">

        <Sidebar
          isOpen={isOpen}
          toggleSidebar={
            toggleSidebar
          }
        />

        <main
          className={`executive-main ${
            isOpen
              ? "sidebar-open"
              : "sidebar-closed"
          }`}
        >

          <div className="executive-loader">

            <div className="loader-spinner" />

            <h3>
              Loading Executive Report
            </h3>

            <p>
              Preparing your performance analytics...
            </p>

          </div>

        </main>

      </div>

    );

  }


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="executive-layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={
          toggleSidebar
        }
      />


      <main
        className={`executive-main ${
          isOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="executive-header">

          <div>

            <div className="header-kicker">
              EXECUTIVE ANALYTICS
            </div>

            <h1>
              {reportTitle}
            </h1>

            <p>
              Welcome back,{" "}
              <strong>
                {user.name ||
                  "Executive"}
              </strong>
              . Here's your lead
              performance overview.
            </p>

          </div>


          <div className="header-actions">

            <button
              className="refresh-btn"
              onClick={
                fetchReportData
              }
            >
              <RefreshCw
                size={17}
              />

              Refresh

            </button>

          </div>

        </section>


        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="executive-filter-card">

          <div className="filter-title">

            <Filter size={18} />

            <span>
              Report Filters
            </span>

          </div>


          <div className="filter-controls">

            <select
              value={reportType}
              onChange={(e) => {

                setReportType(
                  e.target.value
                );

                setCurrentPage(1);

                setSelectedStatus("");

              }}
            >

              <option value="overall">
                Overall Report
              </option>

              <option value="daily">
                Daily Report
              </option>

              <option value="weekly">
                Last 7 Days
              </option>

              <option value="monthly">
                Monthly Report
              </option>

            </select>


            {reportType ===
              "daily" && (

              <input
                type="date"
                value={
                  selectedDate
                }
                onChange={(e) => {

                  setSelectedDate(
                    e.target.value
                  );

                  setCurrentPage(1);

                  setSelectedStatus("");

                }}
              />

            )}


            {reportType ===
              "monthly" && (

              <input
                type="month"
                value={
                  selectedMonth
                }
                onChange={(e) => {

                  setSelectedMonth(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
              />

            )}


            <div className="search-box">

              <Search
                size={17}
              />

              <input
                type="text"
                placeholder="Search lead, phone, project..."
                value={search}
                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
              />

            </div>


            <button
              className="clear-filter-btn"
              onClick={
                clearFilters
              }
            >
              Clear
            </button>

          </div>

        </section>


        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="executive-kpi-grid">


          <div className="executive-kpi total">

            <div className="kpi-icon">
              <Users size={21} />
            </div>

            <div>

              <span>
                Total Leads
              </span>

              <strong>
                {stats.total}
              </strong>

              <small>
                Current selection
              </small>

            </div>

          </div>


          <div className="executive-kpi today">

            <div className="kpi-icon">
              <UserPlus
                size={21}
              />
            </div>

            <div>

              <span>
                Today's Leads
              </span>

              <strong>
                {stats.today}
              </strong>

              <small>
                Created today
              </small>

            </div>

          </div>


          <div className="executive-kpi interested">

            <div className="kpi-icon">
              <Heart size={21} />
            </div>

            <div>

              <span>
                Interested
              </span>

              <strong>
                {stats.interested}
              </strong>

              <small>
                Interested + Very Interested
              </small>

            </div>

          </div>


          <div className="executive-kpi booked">

            <div className="kpi-icon">
              <CalendarCheck
                size={21}
              />
            </div>

            <div>

              <span>
                Booked
              </span>

              <strong>
                {stats.booked}
              </strong>

              <small>
                Successful bookings
              </small>

            </div>

          </div>


          <div className="executive-kpi conversion">

            <div className="kpi-icon">
              <TrendingUp
                size={21}
              />
            </div>

            <div>

              <span>
                Conversion
              </span>

              <strong>
                {stats.conversion}%
              </strong>

              <small>
                Lead → Booking
              </small>

            </div>

          </div>


        </section>


        {/* =================================================
            MINI PERFORMANCE STRIP
        ================================================= */}

        <section className="performance-strip">

          <div>

            <Clock size={18} />

            <span>
              Last 7 Days
            </span>

            <strong>
              {stats.week}
            </strong>

          </div>


          <div>

            <BarChart3 size={18} />

            <span>
              This Month
            </span>

            <strong>
              {stats.month}
            </strong>

          </div>


          <div>

            <Phone size={18} />

            <span>
              Followups
            </span>

            <strong>
              {stats.followup}
            </strong>

          </div>


          <div>

            <MapPin size={18} />

            <span>
              Site Visits
            </span>

            <strong>
              {stats.siteVisit}
            </strong>

          </div>


          <div>

            <Target size={18} />

            <span>
              Meetings
            </span>

            <strong>
              {stats.meeting}
            </strong>

          </div>

        </section>


        {/* =================================================
            ANALYTICS ROW
        ================================================= */}

        <section className="analytics-grid">


          {/* STATUS DONUT */}

          <div className="analytics-card chart-large">

            <div className="section-heading">

              <div>

                <h3>
                  Lead Status Distribution
                </h3>

                <p>
                  Current lead status breakdown
                </p>

              </div>

              <div className="section-icon">
                <BarChart3
                  size={18}
                />
              </div>

            </div>


            <div className="donut-container">

              {statusData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={330}
                >

                  <PieChart>

                    <Pie
                      data={
                        statusData
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={
                        75
                      }
                      outerRadius={
                        115
                      }
                      paddingAngle={
                        3
                      }
                      dataKey="value"
                    >

                      {statusData.map(
                        (
                          entry,
                          index
                        ) => (

                          <Cell
                            key={
                              index
                            }
                            fill={
                              COLORS[
                                index %
                                COLORS.length
                              ]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <div className="empty-state">
                  No status data
                </div>

              )}

            </div>

          </div>


          {/* PROJECT CHART */}

          <div className="analytics-card">

            <div className="section-heading">

              <div>

                <h3>
                  Project Performance
                </h3>

                <p>
                  Leads by project
                </p>

              </div>

              <div className="section-icon">
                <Building2
                  size={18}
                />
              </div>

            </div>


            <div className="bar-chart-container">

              {projectData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={330}
                >

                  <BarChart
                    data={
                      projectData
                    }
                    layout="vertical"
                    margin={{
                      left: 15,
                      right: 20
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{
                        fontSize: 11
                      }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="leads"
                      radius={[
                        0,
                        7,
                        7,
                        0
                      ]}
                      fill="#4f46e5"
                    />

                  </BarChart>

                </ResponsiveContainer>

              ) : (

                <div className="empty-state">
                  No project data
                </div>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            STATUS + FOLLOWUPS
        ================================================= */}

        <section className="reports-grid">


          {/* STATUS TABLE */}

          <div className="modern-card">

            <div className="section-heading">

              <div>

                <h3>
                  Status Overview
                </h3>

                <p>
                  Click a status to view leads
                </p>

              </div>

            </div>


            <div className="status-list">

              {statusData.length > 0 ? (

                statusData.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className={`status-row ${
                        selectedStatus ===
                        item.name
                          ? "selected"
                          : ""
                      }`}
                      key={
                        item.name
                      }
                      onClick={() => {

                        setSelectedStatus(
                          selectedStatus ===
                            item.name
                            ? ""
                            : item.name
                        );

                        setCurrentPage(
                          1
                        );

                      }}
                    >

                      <div className="status-name">

                        <span
                          className="status-dot"
                          style={{
                            background:
                              COLORS[
                                index %
                                COLORS.length
                              ]
                          }}
                        />

                        <span>
                          {
                            item.name
                          }
                        </span>

                      </div>

                      <strong>
                        {
                          item.value
                        }
                      </strong>

                    </div>

                  )
                )

              ) : (

                <div className="empty-state">
                  No status data
                </div>

              )}

            </div>

          </div>


          {/* FOLLOWUPS */}

          <div className="modern-card">

            <div className="section-heading">

              <div>

                <h3>
                  Follow-up Queue
                </h3>

                <p>
                  {selectedDate
                    ? selectedDate
                    : "Today's scheduled followups"}
                </p>

              </div>

              <div className="followup-count">
                {
                  todayFollowups.length
                }
              </div>

            </div>


            <div className="followup-list">

              {todayFollowups.length >
              0 ? (

                todayFollowups
                  .slice(0, 7)
                  .map(
                    (lead) => (

                      <div
                        className="followup-item"
                        key={
                          lead._id
                        }
                      >

                        <div className="followup-avatar">
                          {
                            (
                              lead.name ||
                              "L"
                            )
                              .charAt(
                                0
                              )
                              .toUpperCase()
                          }
                        </div>

                        <div className="followup-info">

                          <strong>
                            {
                              lead.name ||
                              "-"
                            }
                          </strong>

                          <span>
                            {
                              lead.phone ||
                              "-"
                            }
                          </span>

                        </div>

                        <div className="followup-project">
                          {
                            lead.project ||
                            "-"
                          }
                        </div>

                      </div>

                    )
                  )

              ) : (

                <div className="empty-state">
                  No followups scheduled
                </div>

              )}

            </div>

          </div>

        </section>


        {/* =================================================
            SELECTED STATUS LEADS
        ================================================= */}

        {selectedStatus && (

          <section className="modern-card selected-leads-card">

            <div className="section-heading">

              <div>

                <h3>
                  {selectedStatus} Leads
                </h3>

                <p>
                  {statusWiseLeads.length}
                  {" "}
                  leads found
                </p>

              </div>

              <button
                className="close-status-btn"
                onClick={() =>
                  setSelectedStatus("")
                }
              >
                Clear Selection
              </button>

            </div>


            <div className="table-scroll">

              <table className="modern-table">

                <thead>

                  <tr>

                    <th>
                      #
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

                  {statusWiseLeads.length >
                  0 ? (

                    statusWiseLeads
                      .slice(
                        0,
                        20
                      )
                      .map(
                        (
                          lead,
                          index
                        ) => (

                          <tr
                            key={
                              lead._id
                            }
                          >

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <strong>
                                {
                                  lead.name ||
                                  "-"
                                }
                              </strong>
                            </td>

                            <td>
                              {
                                lead.phone ||
                                "-"
                              }
                            </td>

                            <td>
                              {
                                lead.project ||
                                "-"
                              }
                            </td>

                            <td>

                              <span className="status-badge">
                                {
                                  lead.status ||
                                  "-"
                                }
                              </span>

                            </td>

                          </tr>

                        )
                      )

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="table-empty"
                      >
                        No Leads Found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* =================================================
            ALL LEADS
        ================================================= */}

        <section className="modern-card">

          <div className="section-heading">

            <div>

              <h3>
                Lead Details
              </h3>

              <p>
                Showing{" "}
                {displayLeads.length}
                {" "}
                of{" "}
                {filteredLeads.length}
                {" "}
                leads
              </p>

            </div>

            <div className="lead-total-pill">

              <Users size={15} />

              {filteredLeads.length}

            </div>

          </div>


          <div className="table-scroll">

            <table className="modern-table">

              <thead>

                <tr>

                  <th>
                    #
                  </th>

                  <th>
                    Client Name
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

                  <th>
                    Created
                  </th>

                </tr>

              </thead>


              <tbody>

                {displayLeads.length >
                0 ? (

                  displayLeads.map(
                    (
                      lead,
                      index
                    ) => (

                      <tr
                        key={
                          lead._id
                        }
                      >

                        <td>
                          {
                            indexOfFirstLead +
                            index +
                            1
                          }
                        </td>

                        <td>

                          <div className="client-cell">

                            <div className="client-avatar">

                              {
                                (
                                  lead.name ||
                                  "L"
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()
                              }

                            </div>

                            <strong>
                              {
                                lead.name ||
                                "-"
                              }
                            </strong>

                          </div>

                        </td>

                        <td>
                          {
                            lead.phone ||
                            "-"
                          }
                        </td>

                        <td>
                          {
                            lead.project ||
                            "-"
                          }
                        </td>

                        <td>

                          <span className="status-badge">

                            {
                              lead.status ||
                              "No Status"
                            }

                          </span>

                        </td>

                        <td>

                          {
                            lead.createdAt
                              ? new Date(
                                  lead.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"
                          }

                        </td>

                      </tr>

                    )

                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="table-empty"
                    >
                      No Leads Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* PAGINATION */}

          <div className="modern-pagination">

            <button
              disabled={
                safePage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (p) =>
                    Math.max(
                      1,
                      p - 1
                    )
                )
              }
            >

              <ChevronLeft
                size={17}
              />

              Previous

            </button>


            <div className="page-info">

              Page{" "}
              <strong>
                {safePage}
              </strong>
              {" "}
              of{" "}
              <strong>
                {totalPages}
              </strong>

            </div>


            <button
              disabled={
                safePage >=
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (p) =>
                    Math.min(
                      totalPages,
                      p + 1
                    )
                )
              }
            >

              Next

              <ChevronRight
                size={17}
              />

            </button>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="executive-footer">

          <span>
            Executive CRM Analytics
          </span>

          <span>
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "long",
                year: "numeric"
              }
            )}
          </span>

        </div>

      </main>

    </div>

  );

}