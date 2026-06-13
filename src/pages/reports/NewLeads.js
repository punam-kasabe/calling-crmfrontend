import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function NewLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const leadsPerPage = 30;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/all-leads`
      );

      const allLeads = Array.isArray(
        res.data
      )
        ? res.data
        : [];

      const newLeads = allLeads.filter(
        (lead) =>
          String(lead.status || "")
            .toLowerCase()
            .trim() === "new"
      );

      setLeads(newLeads);
    } catch (err) {
      console.error(
        "Fetch Leads Error:",
        err
      );

      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  /* PAGINATION */

  const indexOfLastLead =
    currentPage * leadsPerPage;

  const indexOfFirstLead =
    indexOfLastLead - leadsPerPage;

  const currentLeads =
    leads.slice(
      indexOfFirstLead,
      indexOfLastLead
    );

  const totalPages = Math.ceil(
    leads.length / leadsPerPage
  );

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

          <h2>New Leads</h2>

          <p>
            Total New Leads :
            <strong>
              {" "}
              {leads.length}
            </strong>
          </p>

          {!loading && (
            <p>
              Showing{" "}
              <strong>
                {currentLeads.length}
              </strong>{" "}
              of{" "}
              <strong>
                {leads.length}
              </strong>{" "}
              leads
            </p>
          )}

          {loading ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                fontSize: "18px"
              }}
            >
              Loading Leads...
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                 <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Project</th>
                <th>Assigned To</th>
               <th>Status</th>
               </tr>
                </thead>

                <tbody>
                  {currentLeads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign:
                            "center"
                        }}
                      >
                        No New Leads Found
                      </td>
                    </tr>
                  ) : (
                    currentLeads.map(
                      (lead) => (
                        <tr key={lead._id}>
                      <td>{lead.name || "-"}</td>

                      <td>{lead.phone || "-"}</td>

                      <td>{lead.project || "-"}</td>

                      <td>
                       {lead.assigned_to
                       ? lead.assigned_to.split("@")[0]
                       : "Unassigned"}
                        </td>

                   <td>{lead.status || "-"}</td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    gap: "15px",
                    marginTop: "20px",
                    marginBottom:
                      "20px"
                  }}
                >
                  <button
                    className="btn btn-primary"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage - 1
                      )
                    }
                  >
                    Previous
                  </button>

                  <span>
                    Page{" "}
                    <strong>
                      {currentPage}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {totalPages}
                    </strong>
                  </span>

                  <button
                    className="btn btn-primary"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage + 1
                      )
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}