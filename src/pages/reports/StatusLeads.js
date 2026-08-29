import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function StatusLeads() {

  const { status } = useParams();

  const [isOpen, setIsOpen] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [leads, setLeads] =
    useState([]);

  /* =========================================
     USERS
  ========================================= */

  const [users, setUsers] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState("");

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  /* =========================================
     FETCH ALL USERS
  ========================================= */

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        setLoadingUsers(true);

        const res = await axios.get(
          `${API}/status-report-users`
        );

        setUsers(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (err) {

        console.error(
          "Users fetch error:",
          err
        );

      } finally {

        setLoadingUsers(false);

      }

    };

    fetchUsers();

  }, []);

  /* =========================================
     FETCH LEADS
  ========================================= */

  useEffect(() => {

    const fetchLeads = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          `${API}/all-leads`
        );

        let allLeads =
          Array.isArray(res.data)
            ? res.data
            : [];

        /* =====================================
           STATUS FILTER
        ===================================== */

        const selectedStatus =
          status
            ?.toLowerCase()
            .trim();


        allLeads =
          allLeads.filter((lead) => {

            const leadStatuses =
              Array.isArray(
                lead.status
              )
                ? lead.status
                : lead.status
                  ? [lead.status]
                  : [];


            return leadStatuses.some(
              (item) =>
                item
                  ?.toLowerCase()
                  .trim() ===
                selectedStatus
            );

          });


        /* =====================================
           USER FILTER
        ===================================== */

        if (selectedUser) {

          allLeads =
            allLeads.filter(
              (lead) => {

                const assignedEmail =
                  lead.assigned_to ||
                  lead.assigned_to_email ||
                  lead.executive_email ||
                  "";

                return (
                  assignedEmail
                    ?.toLowerCase()
                    .trim() ===
                  selectedUser
                    ?.toLowerCase()
                    .trim()
                );

              }
            );

        }


        setLeads(allLeads);

      } catch (err) {

        console.error(
          "Leads fetch error:",
          err
        );

        setLeads([]);

      } finally {

        setLoading(false);

      }

    };

    fetchLeads();

  }, [status, selectedUser]);


  /* =========================================
     SELECTED USER NAME
  ========================================= */

  const selectedUserName =
    users.find(
      (user) =>
        user.email === selectedUser
    )?.name || "";


  return (

    <div className="dashboard-page">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar

        isOpen={isOpen}

        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }

      />


      {/* =====================================
          MAIN CONTAINER
      ===================================== */}

      <div
        className="dashboard-container"

        style={{
          marginLeft:
            isOpen
              ? "240px"
              : "70px"
        }}

      >

        {/* ===================================
            TITLE
        =================================== */}

        <h2 className="dashboard-title">

          {status
            ?.toUpperCase()} Leads

        </h2>


        {/* ===================================
            USER FILTER SECTION
        =================================== */}

        <div
          className="user-pending-filter"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "20px",
            marginBottom: "20px",
            padding: "18px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)"
          }}
        >

          {/* USER DROPDOWN */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              minWidth: "320px"
            }}
          >

            <label
              style={{
                fontWeight: "600",
                fontSize: "14px"
              }}
            >
              Select User
            </label>


            <select

              value={selectedUser}

              onChange={(e) =>
                setSelectedUser(
                  e.target.value
                )
              }

              style={{
                height: "42px",
                padding: "0 12px",
                border:
                  "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "14px",
                cursor: "pointer"
              }}

            >

              <option value="">
                -- All Users --
              </option>


              {loadingUsers ? (

                <option disabled>
                  Loading users...
                </option>

              ) : (

                users.map(
                  (user) => (

                    <option
                      key={user._id}
                      value={user.email}
                    >

                      {user.name}
                      {" - "}
                      {user.email}

                    </option>

                  )
                )

              )}

            </select>

          </div>


          {/* =================================
              COUNT CARD
          ================================= */}

          <div
            style={{
              minWidth: "180px",
              height: "72px",
              padding:
                "10px 18px",
              borderRadius: "10px",
              background:
                "#f5f3ff",
              display: "flex",
              flexDirection:
                "column",
              justifyContent:
                "center"
            }}
          >

            <span
              style={{
                fontSize: "13px",
                color: "#666"
              }}
            >

              {selectedUser
                ? `${selectedUserName || "User"} Pending Leads`
                : `Total ${status} Leads`}

            </span>


            <strong
              style={{
                fontSize: "28px",
                color: "#5b3df5",
                lineHeight: "1.2"
              }}
            >

              {loading
                ? "..."
                : leads.length}

            </strong>

          </div>

        </div>


        {/* ===================================
            TABLE CARD
        =================================== */}

        <div className="chart-card">

          <h5>

            {selectedUser
              ? `${selectedUserName || selectedUser} - ${status} Leads (${leads.length})`
              : `Total Leads (${leads.length})`}

          </h5>


          {loading ? (

            <p>
              Loading...
            </p>

          ) : (

            <div className="table-responsive">

              <table
                className="table table-bordered"
              >

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Assigned To
                    </th>

                    <th>
                      Project
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Created At
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {leads.length > 0 ? (

                    leads.map(
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
                            {lead.name ||
                              "-"}
                          </td>


                          <td>
                            {lead.phone ||
                              "-"}
                          </td>


                          <td>

                            {lead.assignedTo ||
                              lead.assigned_to_email ||
                              lead.assigned_to ||
                              "-"}

                          </td>


                          <td>
                            {lead.project ||
                              "-"}
                          </td>


                          <td>

                            {Array.isArray(
                              lead.status
                            )
                              ? lead.status.join(
                                  ", "
                                )
                              : lead.status ||
                                "-"}

                          </td>


                          <td>

                            {lead.createdAt

                              ? new Date(
                                  lead.createdAt
                                ).toLocaleString()

                              : "-"}

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

                        No Leads Found

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}