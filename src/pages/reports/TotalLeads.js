import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function TotalLeads() {

  const [isOpen, setIsOpen] =
    useState(true);

  const [leads, setLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const leadsPerPage = 30;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/all-leads`
      );

      setLeads(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(err);

      setLeads([]);

    } finally {

      setLoading(false);

    }

  };

  /* ======================
     PAGINATION
  ====================== */

  const indexOfLastLead =
    currentPage * leadsPerPage;

  const indexOfFirstLead =
    indexOfLastLead - leadsPerPage;

  const currentLeads =
    leads.slice(
      indexOfFirstLead,
      indexOfLastLead
    );

  const totalPages =
    Math.ceil(
      leads.length / leadsPerPage
    );

  return (

    <div className="dashboard-page">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className="dashboard-container"
        style={{
          marginLeft: isOpen
            ? "240px"
            : "70px"
        }}
      >

        <h2 className="dashboard-title">
          Total Leads Report
        </h2>

        <div className="chart-card">

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "15px"
            }}
          >

            <h5>
              All Leads (
              {leads.length}
              )
            </h5>

            <span>
              Page {currentPage} of{" "}
              {totalPages || 1}
            </span>

          </div>

          {loading ? (

            <div
              style={{
                textAlign: "center",
                padding: "30px"
              }}
            >
              Loading Leads...
            </div>

          ) : (

            <>

              <div className="table-responsive">

                <table className="table table-bordered table-hover">

                  <thead>

                    <tr>

                      <th>#</th>

                      <th>Name</th>

                      <th>Phone</th>

                      <th>Project</th>

                      <th>Assigned To</th>

                      <th>Status</th>

                    </tr>

                  </thead>

                  <tbody>

                    {currentLeads.length >
                    0 ? (

                      currentLeads.map(
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
                              {indexOfFirstLead +
                                index +
                                1}
                            </td>

                            <td>
                              {lead.name ||
                                "-"}
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

                              {lead.assigned_to
                                ? lead.assigned_to
                                    .split(
                                      "@"
                                    )[0]
                                    .replace(
                                      /\./g,
                                      " "
                                    )
                                : "Unassigned"}

                            </td>

                            <td>
                              {lead.status ||
                                "-"}
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
                          No Leads Found
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    gap: "15px",
                    marginTop:
                      "20px"
                  }}
                >

                  <button
                    className="btn btn-primary"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        currentPage -
                          1
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
                        currentPage +
                          1
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