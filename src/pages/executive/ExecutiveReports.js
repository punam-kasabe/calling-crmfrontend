import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function ExecutiveReports() {
  const [isOpen, setIsOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const toggleSidebar = () =>
    setIsOpen(!isOpen);


 const fetchReportData = async () => {
  try {
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
    console.log(err);
  } finally {
    setLoading(false);
  }
};

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchReportData();
}, []);


  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter(
        (l) => l.status === "New"
      ).length,

      interested: leads.filter(
        (l) =>
          l.status === "Interested" ||
          l.status === "Very Interested"
      ).length,

      followup: leads.filter(
        (l) => l.status === "Follow Up"
      ).length,

      booked: leads.filter(
        (l) => l.status === "Booked"
      ).length,

      siteVisit: leads.filter(
        (l) =>
          l.status === "Site Visit Done"
      ).length,

      notInterested: leads.filter(
        (l) =>
          l.status === "Not Interested"
      ).length,

      callback: leads.filter(
        (l) =>
          l.status === "Call Back"
      ).length,

      meeting: leads.filter(
        (l) =>
          l.status ===
          "Meeting Scheduled"
      ).length,

      negotiation: leads.filter(
        (l) =>
          l.status === "Negotiation"
      ).length,

      tokenReceived: leads.filter(
        (l) =>
          l.status ===
          "Token Received"
      ).length
    };
  }, [leads]);

  const todayFollowups = useMemo(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    return leads.filter(
      (lead) =>
        lead.next_call_date &&
        lead.next_call_date
          .split("T")[0] === today
    );
  }, [leads]);

const downloadReport = () => {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  let csv =
    "Name,Phone,Project,Status,Next Call Date\n";

  leads.forEach((lead) => {
    csv += `"${lead.name || ""}","${lead.phone || ""}","${lead.project || ""}","${lead.status || ""}","${lead.next_call_date || ""}"\n`;
  });

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    `Executive_Report_${today}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
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
       <div className="page-header">
  <h2>Executive Reports</h2>

  <p>
    Welcome,
    <strong>
      {" "}
      {user.name}
    </strong>
  </p>

  <div
    style={{
      marginTop: "15px",
      marginBottom: "20px"
    }}
  >
    <button
      onClick={downloadReport}
      style={{
        background: "#198754",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600"
      }}
    >
      Download Daily Report
    </button>
  </div>
</div>

        {loading ? (
          <div className="loader">
            Loading Reports...
          </div>
        ) : (
          <>
            {/* STATS */}

            <div className="stats-grid">

              <div className="stats-card">
                <h5>Total Leads</h5>
                <p>{stats.total}</p>
              </div>

              <div className="stats-card new">
                <h5>New Leads</h5>
                <p>{stats.new}</p>
              </div>

              <div className="stats-card interested">
                <h5>Interested</h5>
                <p>{stats.interested}</p>
              </div>

              <div className="stats-card followup">
                <h5>Follow Up</h5>
                <p>{stats.followup}</p>
              </div>

              <div className="stats-card booked">
                <h5>Booked</h5>
                <p>{stats.booked}</p>
              </div>

              <div className="stats-card sitevisit">
                <h5>Site Visit Done</h5>
                <p>{stats.siteVisit}</p>
              </div>

              <div className="stats-card not">
                <h5>Not Interested</h5>
                <p>{stats.notInterested}</p>
              </div>

              <div className="stats-card">
                <h5>Call Back</h5>
                <p>{stats.callback}</p>
              </div>

              <div className="stats-card">
                <h5>Meeting Scheduled</h5>
                <p>{stats.meeting}</p>
              </div>

              <div className="stats-card">
                <h5>Negotiation</h5>
                <p>{stats.negotiation}</p>
              </div>

              <div className="stats-card booked">
                <h5>Token Received</h5>
                <p>{stats.tokenReceived}</p>
              </div>

            </div>

            {/* TODAY FOLLOWUPS */}

            <div
              style={{
                marginTop: "30px"
              }}
            >
              <h3>
                Today's Followups (
                {todayFollowups.length})
              </h3>

              <div className="table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Next Call</th>
                    </tr>
                  </thead>

                  <tbody>
                    {todayFollowups.length >
                    0 ? (
                      todayFollowups.map(
                        (lead) => (
                          <tr
                            key={
                              lead._id
                            }
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
                              {lead.status}
                            </td>

                            <td>
                              {lead.next_call_date
                                ?.split(
                                  "T"
                                )[0]}
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign:
                              "center"
                          }}
                        >
                          No Followups
                          Today
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PROJECT SUMMARY */}

            <div
              style={{
                marginTop: "30px"
              }}
            >
              <h3>
                Project Wise Leads
              </h3>

              <div className="table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Leads</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(
                      leads.reduce(
                        (acc, lead) => {
                          const project =
                            lead.project ||
                            "Unknown";

                          acc[project] =
                            (acc[
                              project
                            ] || 0) + 1;

                          return acc;
                        },
                        {}
                      )
                    ).map(
                      (
                        [project,
                          count],
                        index
                      ) => (
                        <tr
                          key={index}
                        >
                          <td>
                            {project}
                          </td>

                          <td>
                            {count}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}