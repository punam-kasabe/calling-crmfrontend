// FILE: src/pages/reports/MonthlyReport.js

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import "../../styles/monthlyReport.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

/* =====================================================
   MONTH LIST
===================================================== */

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

/* =====================================================
   DEFAULT TOTALS
===================================================== */

const DEFAULT_TOTALS = {
  assigned: 0,
  ringing: 0,
  interested: 0,
  siteVisit: 0,
  booking: 0,
};

/* =====================================================
   MONTHLY REPORT
===================================================== */

export default function MonthlyReport() {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  /* =====================================================
     SELECTED MONTH
  ===================================================== */

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentYear}-${String(currentMonth).padStart(2, "0")}`
  );

  /* =====================================================
     DATA
  ===================================================== */

  const [reportData, setReportData] = useState([]);

  const [totals, setTotals] = useState(
    DEFAULT_TOTALS
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     YEAR LIST
  ===================================================== */

  const years = useMemo(() => {
    const arr = [];

    for (let year = currentYear; year >= 2024; year--) {
      arr.push(year);
    }

    return arr;
  }, [currentYear]);

  /* =====================================================
     FETCH MONTHLY REPORT

     useCallback added so ESLint does not complain
     about useEffect dependency.
  ===================================================== */

  const fetchMonthlyReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/monthly-report`,
        {
          params: {
            month: selectedMonth,
          },
        }
      );

      if (response.data?.success) {
        setReportData(
          response.data.data || []
        );

        setTotals(
          response.data.totals || DEFAULT_TOTALS
        );
      } else {
        setReportData([]);

        setTotals(DEFAULT_TOTALS);

        setError(
          response.data?.message ||
            "No monthly report data found"
        );
      }
    } catch (err) {
      console.error(
        "MONTHLY REPORT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load monthly report"
      );

      setReportData([]);

      setTotals(DEFAULT_TOTALS);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  /* =====================================================
     LOAD REPORT WHEN MONTH CHANGES
  ===================================================== */

  useEffect(() => {
    fetchMonthlyReport();
  }, [fetchMonthlyReport]);

  /* =====================================================
     SELECTED MONTH NAME
  ===================================================== */

  const selectedMonthName = useMemo(() => {
    const [year, month] =
      selectedMonth.split("-");

    const monthObj = MONTHS.find(
      (item) => item.value === month
    );

    return `${monthObj?.label || ""} ${year}`;
  }, [selectedMonth]);

  /* =====================================================
     CHANGE MONTH
  ===================================================== */

  const handleMonthChange = (e) => {
    const month = e.target.value;

    const year =
      selectedMonth.split("-")[0];

    setSelectedMonth(
      `${year}-${month}`
    );
  };

  /* =====================================================
     CHANGE YEAR
  ===================================================== */

  const handleYearChange = (e) => {
    const year = e.target.value;

    const month =
      selectedMonth.split("-")[1];

    setSelectedMonth(
      `${year}-${month}`
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="monthly-report-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="monthly-report-header">

        <div>
          <h1>
            Monthly Report
          </h1>

          <p>
            Executive-wise monthly performance
          </p>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="monthly-filters">

          {/* YEAR */}

          <div className="filter-group">

            <label>
              Year
            </label>

            <select
              value={
                selectedMonth.split("-")[0]
              }
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>

          </div>

          {/* MONTH */}

          <div className="filter-group">

            <label>
              Month
            </label>

            <select
              value={
                selectedMonth.split("-")[1]
              }
              onChange={handleMonthChange}
            >
              {MONTHS.map((month) => (
                <option
                  key={month.value}
                  value={month.value}
                >
                  {month.label}
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

      {/* =================================================
          SELECTED MONTH
      ================================================= */}

      <div className="selected-month-title">

        <span>
          Monthly Performance
        </span>

        <strong>
          {selectedMonthName}
        </strong>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="monthly-error">
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="monthly-summary-grid">

        {/* ASSIGNED */}

        <div className="monthly-summary-card assigned-card">

          <div className="summary-icon">
            👥
          </div>

          <div>
            <span>
              Assigned Leads
            </span>

            <strong>
              {totals.assigned || 0}
            </strong>
          </div>

        </div>

        {/* RINGING */}

        <div className="monthly-summary-card ringing-card">

          <div className="summary-icon">
            📞
          </div>

          <div>
            <span>
              Call Ringing
            </span>

            <strong>
              {totals.ringing || 0}
            </strong>
          </div>

        </div>

        {/* INTERESTED */}

        <div className="monthly-summary-card interested-card">

          <div className="summary-icon">
            ⭐
          </div>

          <div>
            <span>
              Interested
            </span>

            <strong>
              {totals.interested || 0}
            </strong>
          </div>

        </div>

        {/* SITE VISIT */}

        <div className="monthly-summary-card visit-card">

          <div className="summary-icon">
            📍
          </div>

          <div>
            <span>
              Site Visits
            </span>

            <strong>
              {totals.siteVisit || 0}
            </strong>
          </div>

        </div>

        {/* BOOKING */}

        <div className="monthly-summary-card booking-card">

          <div className="summary-icon">
            🏆
          </div>

          <div>
            <span>
              Bookings
            </span>

            <strong>
              {totals.booking || 0}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="monthly-table-card">

        {/* TABLE HEADER */}

        <div className="table-header">

          <div>

            <h2>
              Executive Performance
            </h2>

            <p>
              Performance for{" "}
              {selectedMonthName}
            </p>

          </div>

          <button
            type="button"
            className="refresh-btn"
            onClick={fetchMonthlyReport}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "↻ Refresh"}
          </button>

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table className="monthly-report-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Executive
                </th>

                <th>
                  Assigned Leads
                </th>

                <th>
                  Call Ringing
                </th>

                <th>
                  Interested
                </th>

                <th>
                  Site Visits
                </th>

                <th>
                  Bookings
                </th>

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="7"
                    className="loading-row"
                  >
                    Loading monthly report...
                  </td>

                </tr>

              ) : reportData.length === 0 ? (

                /* NO DATA */

                <tr>

                  <td
                    colSpan="7"
                    className="empty-row"
                  >
                    No data available for{" "}
                    {selectedMonthName}
                  </td>

                </tr>

              ) : (

                /* DATA */

                reportData.map(
                  (item, index) => (

                    <tr
                      key={
                        item.executive ||
                        index
                      }
                    >

                      {/* INDEX */}

                      <td>
                        {index + 1}
                      </td>

                      {/* EXECUTIVE */}

                      <td>

                        <div className="executive-name">

                          <div className="executive-avatar">

                            {(
                              item.executive ||
                              "E"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <span>
                            {item.executive ||
                              "Unknown"}
                          </span>

                        </div>

                      </td>

                      {/* ASSIGNED */}

                      <td>

                        <span className="number-badge assigned">

                          {item.assigned || 0}

                        </span>

                      </td>

                      {/* RINGING */}

                      <td>

                        <span className="number-badge ringing">

                          {item.ringing || 0}

                        </span>

                      </td>

                      {/* INTERESTED */}

                      <td>

                        <span className="number-badge interested">

                          {item.interested || 0}

                        </span>

                      </td>

                      {/* SITE VISIT */}

                      <td>

                        <span className="number-badge visit">

                          {item.siteVisit || 0}

                        </span>

                      </td>

                      {/* BOOKING */}

                      <td>

                        <span className="number-badge booking">

                          {item.booking || 0}

                        </span>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

            {/* =================================================
                TOTAL
            ================================================= */}

            {!loading &&
              reportData.length > 0 && (

                <tfoot>

                  <tr>

                    <td>
                    </td>

                    <td>
                      <strong>
                        TOTAL
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {totals.assigned || 0}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {totals.ringing || 0}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {totals.interested || 0}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {totals.siteVisit || 0}
                      </strong>
                    </td>

                    <td>
                      <strong>
                        {totals.booking || 0}
                      </strong>
                    </td>

                  </tr>

                </tfoot>

              )}

          </table>

        </div>

      </div>

    </div>
  );
}