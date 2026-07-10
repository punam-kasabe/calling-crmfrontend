import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";
import "../../styles/projectsReport.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function ProjectsReport() {

  const [isOpen, setIsOpen] =
    useState(true);

  const toggleSidebar = () =>
    setIsOpen(!isOpen);

  const user = useMemo(() => {

    return (
      JSON.parse(
        localStorage.getItem("user")
      ) || {}
    );

  }, []);

  const [loading, setLoading] =
    useState(false);

  const [report, setReport] =
    useState([]);

  const [showAdvanced,
    setShowAdvanced] =
    useState(false);

  const [filters, setFilters] =
    useState({

      from: "",

      to: "",

      period: "today"

    });

  /* ===========================
        FETCH REPORT
  =========================== */

  const fetchReport =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.post(

`${API}/projects-report`,

{

email: user.email,

role: user.role,

filters

}

);

        setReport(
          res.data || []
        );

      }

      catch (err) {

        console.log(err);

      }

      finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchReport();

  }, []);

  /* ===========================
        PERIOD BUTTON
  =========================== */

  const changePeriod =
    (period) => {

      setFilters((prev) => ({

        ...prev,

        period

      }));

    };

  useEffect(() => {

    fetchReport();

  }, [filters.period]);

  /* ===========================
        DATE FILTER
  =========================== */

  const handleDateSearch =
    () => {

      fetchReport();

    };

  /* ===========================
        EXPORT
  =========================== */

  const exportExcel =
    () => {

      const ws =
        XLSX.utils.json_to_sheet(

          report.map((r) => ({

            Name: r.name,

            Assigned:
              r.assigned,

            "Total Leads":
              r.total,

            Interested:
              r.interested,

            Booked:
              r.booked,

            Pending:
              r.pending

          }))

        );

      const wb =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Projects Report"
      );

      XLSX.writeFile(
        wb,
        "ProjectsReport.xlsx"
      );

    };
    return (
  <div className="layout">

    <Sidebar
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
    />

    <div
      className={`main-content ${
        isOpen ? "shifted" : "full"
      }`}
    >

      <h2 className="page-title">
        Projects Report
      </h2>

      {/* FILTER BUTTONS */}

      <div className="filters">

        <button
          className="btn export"
          onClick={exportExcel}
        >
          Export
        </button>

        <button
          className="btn dark"
          onClick={() =>
            changePeriod("today")
          }
        >
          Today
        </button>

        <button
          className="btn blue"
          onClick={() =>
            changePeriod("last7")
          }
        >
          Last 7 Days
        </button>

        <button
          className="btn green"
          onClick={() =>
            changePeriod("last30")
          }
        >
          Last 30 Days
        </button>

        <button
          className="btn teal"
          onClick={() =>
            changePeriod("thisMonth")
          }
        >
          This Month
        </button>

        <button
          className="btn yellow"
          onClick={() =>
            changePeriod("lastMonth")
          }
        >
          Last Month
        </button>

        <button
          className="btn light"
          onClick={() =>
            changePeriod("all")
          }
        >
          Till Date
        </button>

        <button
          className="btn advanced"
          onClick={() =>
            setShowAdvanced(
              !showAdvanced
            )
          }
        >
          Advanced Search
        </button>

      </div>

      {/* ADVANCED */}

      {showAdvanced && (

        <div className="advanced-box">

          <input
            type="date"
            value={filters.from}
            onChange={(e)=>

              setFilters({
                ...filters,
                from:e.target.value
              })

            }
          />

          <input
            type="date"
            value={filters.to}
            onChange={(e)=>

              setFilters({
                ...filters,
                to:e.target.value
              })

            }
          />

          <button
            className="btn btn-primary"
            onClick={handleDateSearch}
          >
            Search
          </button>

        </div>

      )}

      {/* TABLE */}

      <div className="table-container">

        {loading ? (

          <h4
            style={{
              textAlign:"center",
              padding:"40px"
            }}
          >
            Loading...
          </h4>

        ) : (

          <table>

            <thead>

              <tr>

                <th>Sr No</th>

                <th>Name</th>

                <th>
                  Assigned
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

              {report.length>0 ? (

                report.map((row,index)=>(

                  <tr
                    key={index}
                  >

                    <td>
                      {index+1}
                    </td>

                    <td>
                      {row.name}
                    </td>

                    <td>
                      {row.assigned}
                    </td>

                    <td>
                      {row.total}
                    </td>

                    <td>
                      {row.interested}
                    </td>

                    <td>
                      {row.booked}
                    </td>

                    <td>
                      {row.pending}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign:"center"
                    }}
                  >

                    No Data Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  </div>
);

}