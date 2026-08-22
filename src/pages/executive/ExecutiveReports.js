import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

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
  Building2,
  CalendarDays
} from "lucide-react";

import "../../styles/executiveReports.css";

/* =====================================================
   API
===================================================== */

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

/* =====================================================
   CHART COLORS
===================================================== */

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#64748b",
  "#14b8a6",
  "#f97316",
  "#6366f1"
];

/* =====================================================
   PAGINATION
===================================================== */

const LEADS_PER_PAGE = 20;

/* =====================================================
   HELPERS
===================================================== */

/*
  Date only helper.

  IMPORTANT:
  MongoDB date UTC मध्ये असू शकते.
  त्यामुळे display/filter साठी IST date वापरतो.
*/

const getDateOnly = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
};

/* =====================================================
   CURRENT IST DATE
===================================================== */

const getCurrentDateIST = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
};

/* =====================================================
   FORMAT DATE
===================================================== */

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  });
};

/* =====================================================
   FORMAT DATE TIME
===================================================== */

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  });
};

/* =====================================================
   COMPONENT
===================================================== */

export default function ExecutiveReports() {

  /* =====================================================
     SIDEBAR
  ===================================================== */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /* =====================================================
     USER
  ===================================================== */

  const user = useMemo(() => {
    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return {};
      }

      return JSON.parse(storedUser) || {};

    } catch (error) {

      console.error(
        "User parse error:",
        error
      );

      return {};
    }
  }, []);

  const userEmail =
    user?.email || "";

  /* =====================================================
     STATES
  ===================================================== */

  const [leads, setLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
    overall
    daily
    weekly
    monthly
  */

  const [reportType, setReportType] =
    useState("overall");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =====================================================
     FETCH EXECUTIVE LEADS
  ===================================================== */

  const fetchReportData =
    useCallback(async () => {

      if (!userEmail) {

        setLoading(false);

        setError(
          "Executive email not found. Please login again."
        );

        return;
      }

      try {

        setLoading(true);
        setError("");

        const res =
          await axios.get(
            `${API}/my-leads`,
            {
              params: {
                email: userEmail
              }
            }
          );

        const data =
          Array.isArray(res.data)
            ? res.data
            : [];

        setLeads(data);

      } catch (err) {

        console.error(
          "Executive Reports Error:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load executive report.";

        setError(message);

        setLeads([]);

      } finally {

        setLoading(false);

      }

    }, [userEmail]);

  /* =====================================================
     INITIAL FETCH
  ===================================================== */

  useEffect(() => {

    fetchReportData();

  }, [fetchReportData]);

  /* =====================================================
     TODAY
  ===================================================== */

  const today = useMemo(() => {

    return getCurrentDateIST();

  }, []);

  /* =====================================================
     FILTERED LEADS
     
     IMPORTANT:
     येथे status based filter नाही.
     
     फक्त:
     Daily  -> createdAt date
     Weekly -> last 7 days
     Monthly -> selected month
     Overall -> all leads
  ===================================================== */

  const filteredLeads =
    useMemo(() => {

      let result = [...leads];

      /* -----------------------------------------------
         DAILY
      ------------------------------------------------ */

      if (
        reportType === "daily" &&
        selectedDate
      ) {

        result =
          result.filter(
            (lead) => {

              return (
                getDateOnly(
                  lead.createdAt
                ) === selectedDate
              );

            }
          );
      }

      /* -----------------------------------------------
         WEEKLY
         
         Last 7 calendar days
      ------------------------------------------------ */

      if (
        reportType === "weekly"
      ) {

        const todayDate =
          new Date();

        const start =
          new Date();

        start.setHours(
          0,
          0,
          0,
          0
        );

        start.setDate(
          start.getDate() - 6
        );

        const end =
          new Date();

        end.setHours(
          23,
          59,
          59,
          999
        );

        result =
          result.filter(
            (lead) => {

              if (
                !lead.createdAt
              ) {
                return false;
              }

              const date =
                new Date(
                  lead.createdAt
                );

              if (
                Number.isNaN(
                  date.getTime()
                )
              ) {
                return false;
              }

              return (
                date >= start &&
                date <= end
              );
            }
          );
      }

      /* -----------------------------------------------
         MONTHLY
      ------------------------------------------------ */

      if (
        reportType === "monthly" &&
        selectedMonth
      ) {

        result =
          result.filter(
            (lead) => {

              if (
                !lead.createdAt
              ) {
                return false;
              }

              const date =
                new Date(
                  lead.createdAt
                );

              if (
                Number.isNaN(
                  date.getTime()
                )
              ) {
                return false;
              }

              /*
                IST month calculate
              */

              const parts =
                new Intl.DateTimeFormat(
                  "en-CA",
                  {
                    timeZone:
                      "Asia/Kolkata",
                    year:
                      "numeric",
                    month:
                      "2-digit"
                  }
                ).formatToParts(
                  date
                );

              const year =
                parts.find(
                  (p) =>
                    p.type ===
                    "year"
                )?.value;

              const month =
                parts.find(
                  (p) =>
                    p.type ===
                    "month"
                )?.value;

              const leadMonth =
                `${year}-${month}`;

              return (
                leadMonth ===
                selectedMonth
              );
            }
          );
      }

      /* -----------------------------------------------
         SEARCH
      ------------------------------------------------ */

      if (
        search.trim()
      ) {

        const query =
          search
            .toLowerCase()
            .trim();

        result =
          result.filter(
            (lead) => {

              const name =
                String(
                  lead.name || ""
                ).toLowerCase();

              const phone =
                String(
                  lead.phone || ""
                ).toLowerCase();

              const project =
                String(
                  lead.project || ""
                ).toLowerCase();

              const status =
                String(
                  lead.status || ""
                ).toLowerCase();

              const email =
                String(
                  lead.email || ""
                ).toLowerCase();

              const city =
                String(
                  lead.city || ""
                ).toLowerCase();

              const source =
                String(
                  lead.source ||
                  lead.lead_source ||
                  ""
                ).toLowerCase();

              return (
                name.includes(query) ||
                phone.includes(query) ||
                project.includes(query) ||
                status.includes(query) ||
                email.includes(query) ||
                city.includes(query) ||
                source.includes(query)
              );
            }
          );
      }

      /*
        Latest first
      */

      result.sort(
        (a, b) => {

          const dateA =
            new Date(
              a.createdAt || 0
            ).getTime();

          const dateB =
            new Date(
              b.createdAt || 0
            ).getTime();

          return (
            dateB - dateA
          );
        }
      );

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
        LEADS_PER_PAGE
      )
    );

  const safePage =
    Math.min(
      currentPage,
      totalPages
    );

  const indexOfFirstLead =
    (safePage - 1) *
    LEADS_PER_PAGE;

  const displayLeads =
    filteredLeads.slice(
      indexOfFirstLead,
      indexOfFirstLead +
      LEADS_PER_PAGE
    );

  /* =====================================================
     DATE-WISE STATISTICS
     
     NOTE:
     No Ringing / Interested calculation.
  ===================================================== */

  const stats =
    useMemo(() => {

      const total =
        filteredLeads.length;

      /*
        Today's leads
      */

      const todayLeads =
        leads.filter(
          (lead) =>
            getDateOnly(
              lead.createdAt
            ) === today
        ).length;

      /*
        Last 7 days
      */

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

      const weekEnd =
        new Date();

      weekEnd.setHours(
        23,
        59,
        59,
        999
      );

      const weekLeads =
        leads.filter(
          (lead) => {

            if (
              !lead.createdAt
            ) {
              return false;
            }

            const date =
              new Date(
                lead.createdAt
              );

            if (
              Number.isNaN(
                date.getTime()
              )
            ) {
              return false;
            }

            return (
              date >= weekStart &&
              date <= weekEnd
            );
          }
        ).length;

      /*
        Current month
      */

      const currentMonth =
        new Intl.DateTimeFormat(
          "en-CA",
          {
            timeZone:
              "Asia/Kolkata",
            year:
              "numeric",
            month:
              "2-digit"
          }
        ).format(
          new Date()
        );

      const monthLeads =
        leads.filter(
          (lead) => {

            if (
              !lead.createdAt
            ) {
              return false;
            }

            const leadMonth =
              new Intl.DateTimeFormat(
                "en-CA",
                {
                  timeZone:
                    "Asia/Kolkata",
                  year:
                    "numeric",
                  month:
                    "2-digit"
                }
              ).format(
                new Date(
                  lead.createdAt
                )
              );

            return (
              leadMonth ===
              currentMonth
            );
          }
        ).length;

      /*
        Followups based only on next_call_date
        No status condition.
      */

      const selectedFollowupDate =
        selectedDate ||
        today;

      const followups =
        leads.filter(
          (lead) => {

            return (
              getDateOnly(
                lead.next_call_date
              ) ===
              selectedFollowupDate
            );

          }
        ).length;

      /*
        Site visit count
        This is kept only as an additional
        useful metric.
      */

      const siteVisits =
        filteredLeads.filter(
          (lead) => {

            const value =
              String(
                lead.status || ""
              )
                .trim()
                .toLowerCase();

            return (
              value ===
                "site visit" ||
              value ===
                "site visit done"
            );
          }
        ).length;

      /*
        Booked count
      */

      const booked =
        filteredLeads.filter(
          (lead) => {

            return (
              String(
                lead.status || ""
              )
                .trim()
                .toLowerCase() ===
              "booked"
            );

          }
        ).length;

      /*
        Conversion
      */

      const conversion =
        total > 0
          ? (
              (booked /
                total) *
              100
            ).toFixed(1)
          : "0.0";

      return {

        total,

        today:
          todayLeads,

        week:
          weekLeads,

        month:
          monthLeads,

        followups,

        siteVisits,

        booked,

        conversion

      };

    }, [
      filteredLeads,
      leads,
      today,
      selectedDate
    ]);

  /* =====================================================
     STATUS DATA
     
     Status chart राहील.
     पण status filter नाही.
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
      )
        .map(
          ([name, value]) => ({
            name,
            value
          })
        )
        .sort(
          (a, b) =>
            b.value -
            a.value
        );

    }, [
      filteredLeads
    ]);

  /* =====================================================
     DATE-WISE FOLLOWUPS
     
     IMPORTANT:
     Status check पूर्णपणे काढला आहे.
  ===================================================== */

  const todayFollowups =
    useMemo(() => {

      const filterDate =
        selectedDate ||
        today;

      return leads.filter(
        (lead) => {

          return (
            getDateOnly(
              lead.next_call_date
            ) ===
            filterDate
          );

        }
      );

    }, [
      leads,
      selectedDate,
      today
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
          ([name, leadsCount]) => ({
            name,
            leads: leadsCount
          })
        )
        .sort(
          (a, b) =>
            b.leads -
            a.leads
        )
        .slice(0, 8);

    }, [
      filteredLeads
    ]);

  /* =====================================================
     REPORT TITLE
  ===================================================== */

  const reportTitle =
    {
      overall:
        "Executive Performance",

      daily:
        "Daily Performance",

      weekly:
        "Last 7 Days Performance",

      monthly:
        "Monthly Performance"

    }[reportType];

  /* =====================================================
     SELECTED DATE LABEL
  ===================================================== */

  const selectedDateLabel =
    useMemo(() => {

      if (!selectedDate) {
        return "Select a date";
      }

      const date =
        new Date(
          `${selectedDate}T00:00:00`
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return selectedDate;
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );

    }, [
      selectedDate
    ]);

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {

    setSelectedDate("");

    setSelectedMonth("");

    setSearch("");

    setReportType(
      "overall"
    );

    setCurrentPage(1);
  };

  /* =====================================================
     REPORT TYPE CHANGE
  ===================================================== */

  const handleReportTypeChange =
    (value) => {

      setReportType(
        value
      );

      setCurrentPage(1);

      /*
        Daily नसल्यास date clear
      */

      if (
        value !== "daily"
      ) {
        setSelectedDate("");
      }

      /*
        Monthly नसल्यास month clear
      */

      if (
        value !== "monthly"
      ) {
        setSelectedMonth("");
      }
    };

  /* =====================================================
     PAGE RESET
  ===================================================== */

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {

      setCurrentPage(
        totalPages
      );

    }

  }, [
    currentPage,
    totalPages
  ]);

  /* =====================================================
     LOADING SCREEN
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
              Preparing your
              performance analytics...
            </p>

          </div>

        </main>

      </div>

    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (

    <div className="executive-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={
          toggleSidebar
        }
      />

      {/* =================================================
          MAIN
      ================================================= */}

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
              Welcome back{" "}
              <strong>
                {user.name ||
                  "Executive"}
              </strong>
              . View your leads
              date-wise performance.
            </p>

          </div>

          <div className="header-actions">

            <button
              className="refresh-btn"
              onClick={
                fetchReportData
              }
              disabled={loading}
            >

              <RefreshCw
                size={17}
              />

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="report-error">

            <strong>
              Report Error:
            </strong>{" "}

            {error}

            <button
              onClick={
                fetchReportData
              }
            >
              Try Again
            </button>

          </div>

        )}

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="executive-filter-card">

          <div className="filter-title">

            <Filter
              size={18}
            />

            <span>
              Report Filters
            </span>

          </div>

          <div className="filter-controls">

            {/* REPORT TYPE */}

            <select
              value={
                reportType
              }
              onChange={(e) =>
                handleReportTypeChange(
                  e.target.value
                )
              }
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

            {/* DAILY DATE */}

            {reportType ===
              "daily" && (

              <div
                className="date-filter-wrapper"
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px"
                }}
              >

                <CalendarDays
                  size={17}
                />

                <input
                  type="date"
                  value={
                    selectedDate
                  }
                  onChange={(e) => {

                    setSelectedDate(
                      e.target.value
                    );

                    setCurrentPage(
                      1
                    );

                  }}
                />

              </div>

            )}

            {/* MONTH */}

            {reportType ===
              "monthly" && (

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "8px"
                }}
              >

                <CalendarDays
                  size={17}
                />

                <input
                  type="month"
                  value={
                    selectedMonth
                  }
                  onChange={(e) => {

                    setSelectedMonth(
                      e.target.value
                    );

                    setCurrentPage(
                      1
                    );

                  }}
                />

              </div>

            )}

            {/* SEARCH */}

            <div className="search-box">

              <Search
                size={17}
              />

              <input
                type="text"
                placeholder="Search lead, phone, project..."
                value={
                  search
                }
                onChange={(e) => {

                  setSearch(
                    e.target.value
                  );

                  setCurrentPage(
                    1
                  );

                }}
              />

            </div>

            {/* CLEAR */}

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
            SELECTED DATE INFO
        ================================================= */}

        {reportType ===
          "daily" &&
          selectedDate && (

          <div
            style={{
              marginTop: "14px",
              padding:
                "12px 16px",
              borderRadius:
                "10px",
              background:
                "#eff6ff",
              border:
                "1px solid #bfdbfe",
              color:
                "#1e40af",
              display:
                "flex",
              alignItems:
                "center",
              gap: "8px",
              fontWeight: 600
            }}
          >

            <CalendarDays
              size={18}
            />

            Showing leads created on{" "}
            <strong>
              {selectedDateLabel}
            </strong>

          </div>

        )}

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <section className="executive-kpi-grid">

          {/* TOTAL */}

          <div className="executive-kpi total">

            <div className="kpi-icon">

              <Users
                size={21}
              />

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

          {/* TODAY */}

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

          {/* BOOKED */}

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
                From current selection
              </small>

            </div>

          </div>

          {/* FOLLOWUPS */}

          <div className="executive-kpi interested">

            <div className="kpi-icon">

              <Phone
                size={21}
              />

            </div>

            <div>

              <span>
                Followups
              </span>

              <strong>
                {stats.followups}
              </strong>

              <small>
                Selected date
              </small>

            </div>

          </div>

          {/* CONVERSION */}

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

            <Clock
              size={18}
            />

            <span>
              Last 7 Days
            </span>

            <strong>
              {stats.week}
            </strong>

          </div>

          <div>

            <BarChart3
              size={18}
            />

            <span>
              This Month
            </span>

            <strong>
              {stats.month}
            </strong>

          </div>

          <div>

            <Phone
              size={18}
            />

            <span>
              Followups
            </span>

            <strong>
              {stats.followups}
            </strong>

          </div>

          <div>

            <MapPin
              size={18}
            />

            <span>
              Site Visits
            </span>

            <strong>
              {stats.siteVisits}
            </strong>

          </div>

          <div>

            <Target
              size={18}
            />

            <span>
              Booked
            </span>

            <strong>
              {stats.booked}
            </strong>

          </div>

        </section>

        {/* =================================================
            ANALYTICS
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
                  Status breakdown for
                  selected date/report
                </p>

              </div>

              <div className="section-icon">

                <BarChart3
                  size={18}
                />

              </div>

            </div>

            <div className="donut-container">

              {statusData.length >
              0 ? (

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
                              entry.name
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

          {/* PROJECT */}

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

              {projectData.length >
              0 ? (

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
                      horizontal={
                        false
                      }
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

          {/* STATUS OVERVIEW */}

          <div className="modern-card">

            <div className="section-heading">

              <div>

                <h3>
                  Status Overview
                </h3>

                <p>
                  Current date/report status
                  distribution
                </p>

              </div>

            </div>

            <div className="status-list">

              {statusData.length >
              0 ? (

                statusData.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="status-row"
                      key={
                        item.name
                      }
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

          {/* FOLLOWUP QUEUE */}

          <div className="modern-card">

            <div className="section-heading">

              <div>

                <h3>
                  Follow-up Queue
                </h3>

                <p>

                  {selectedDate
                    ? `Followups for ${selectedDateLabel}`
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

                          {(
                            lead.name ||
                            "L"
                          )
                            .charAt(
                              0
                            )
                            .toUpperCase()}

                        </div>

                        <div className="followup-info">

                          <strong>
                            {lead.name ||
                              "-"}
                          </strong>

                          <span>
                            {lead.phone ||
                              "-"}
                          </span>

                        </div>

                        <div className="followup-project">

                          {lead.project ||
                            "-"}

                        </div>

                      </div>

                    )
                  )

              ) : (

                <div className="empty-state">

                  No followups
                  scheduled

                </div>

              )}

            </div>

          </div>

        </section>

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

                {
                  displayLeads.length
                }

                {" "}of{" "}

                {
                  filteredLeads.length
                }

                {" "}leads

              </p>

            </div>

            <div className="lead-total-pill">

              <Users
                size={15}
              />

              {
                filteredLeads.length
              }

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

                  <th>
                    Next Call
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
                          lead._id ||
                          index
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

                              {(
                                lead.name ||
                                "L"
                              )
                                .charAt(
                                  0
                                )
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

                          <span className="status-badge">

                            {lead.status ||
                              "No Status"}

                          </span>

                        </td>

                        <td>

                          {formatDate(
                            lead.createdAt
                          )}

                        </td>

                        <td>

                          {lead.next_call_date
                            ? formatDateTime(
                                lead.next_call_date
                              )
                            : "-"}

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="table-empty"
                    >

                      No Leads
                      Found

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
                  (page) =>
                    Math.max(
                      1,
                      page - 1
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

              {" "}of{" "}

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
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
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
                day:
                  "2-digit",
                month:
                  "long",
                year:
                  "numeric",
                timeZone:
                  "Asia/Kolkata"
              }
            )}

          </span>

        </div>

      </main>

    </div>

  );
}