import {
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/myleads.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function MyLeads() {

  const [isOpen, setIsOpen] =
    useState(true);

  const toggleSidebar = () =>
    setIsOpen(!isOpen);

  const [leads, setLeads] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("");

  const [selectedLead,
    setSelectedLead] =
    useState(null);

  const [showModal,
    setShowModal] =
    useState(false);

  const [showAdvancedSearch,
    setShowAdvancedSearch] =
    useState(false);

  const [projectFilter,
    setProjectFilter] =
    useState("");

  const [sourceFilter,
    setSourceFilter] =
    useState("");

  const [executiveFilter,
    setExecutiveFilter] =
    useState("");

  /* ================= NEW LEAD MODAL ================= */

  const [showNewLeadModal,
    setShowNewLeadModal] =
    useState(false);

  const [newLead,
    setNewLead] =
    useState({

      name: "",
      phone: "",
      email: "",
      project: "",
      status: "",
      source: "",
      subSource: "",
      city: "",
      assignedTo: "",
      closingExecutive: "",
      telecallerName: "",
      department: "",
      next_call_date: "",
      comment: "",
      deadReason: "",
      deadSubReason: "",
      bookingDate: ""

    });

  /* ================= USER ================= */

  const user = useMemo(() => {

    return JSON.parse(
      localStorage.getItem("user")
    ) || {};

  }, []);

  /* ================= FETCH LEADS ================= */

  const fetchMyLeads =
    useCallback(async () => {

      try {

        if (!user?.email) {

          setLoading(false);

          return;

        }

        const res =
          await axios.get(

            `${API}/my-leads`,

            {
              params: {
                email: user.email
              }
            }

          );

        setLeads(res.data || []);

      }

      catch (err) {

        console.error(
          "Error fetching leads",
          err
        );

      }

      finally {

        setLoading(false);

      }

    }, [user]);

  useEffect(() => {

    fetchMyLeads();

  }, [fetchMyLeads]);

  /* ================= CREATE LEAD ================= */

  const handleCreateLead =
    async () => {

      try {

        await axios.post(
          `${API}/add-lead`,
          newLead
        );

        alert("Lead Added ✅");

        setShowNewLeadModal(false);

        setNewLead({

          name: "",
          phone: "",
          email: "",
          project: "",
          status: "",
          source: "",
          subSource: "",
          city: "",
          assignedTo: "",
          closingExecutive: "",
          telecallerName: "",
          department: "",
          next_call_date: "",
          comment: "",
          deadReason: "",
          deadSubReason: "",
          bookingDate: ""

        });

        fetchMyLeads();

      }

      catch (err) {

        console.error(err);

        alert("Failed To Add Lead ❌");

      }

    };

  /* ================= UPDATE STATUS ================= */

  const updateStatus =
    async (
      leadId,
      status
    ) => {

      try {

        await axios.put(

          `${API}/update-status/${leadId}`,

          { status }

        );

        setLeads((prev) =>

          prev.map((lead) =>

            lead._id === leadId

              ? {
                  ...lead,
                  status
                }

              : lead

          )

        );

      }

      catch (err) {

        console.error(
          "Status update failed",
          err
        );

      }

    };

  /* ================= UPDATE LEAD ================= */

  const handleUpdateLead =
    async () => {

      try {

        await axios.put(

          `${API}/update-lead/${selectedLead._id}`,

          selectedLead

        );

        setLeads((prev) =>

          prev.map((lead) =>

            lead._id ===
            selectedLead._id

              ? selectedLead

              : lead

          )

        );

        setShowModal(false);

        alert(
          "Lead Updated ✅"
        );

      }

      catch (err) {

        console.error(err);

        alert(
          "Update Failed ❌"
        );

      }

    };

  /* ================= DELETE ================= */

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this lead?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(

          `${API}/delete-lead/${id}`

        );

        setLeads((prev) =>

          prev.filter(
            (lead) =>
              lead._id !== id
          )

        );

      }

      catch (err) {

        console.error(err);

      }

    };

  /* ================= FILTER ================= */

  const filteredLeads =
    useMemo(() => {

      return leads.filter(
        (lead) => {

          const matchesSearch =

            `${lead.name}
             ${lead.phone}
             ${lead.project}
             ${lead.source}`

              .toLowerCase()

              .includes(
                search.toLowerCase()
              );

          const matchesStatus =

            statusFilter
              ? lead.status ===
                statusFilter
              : true;

          const matchesProject =

            projectFilter
              ? lead.project
                  ?.toLowerCase()
                  .includes(
                    projectFilter.toLowerCase()
                  )
              : true;

          const matchesSource =

            sourceFilter
              ? lead.source
                  ?.toLowerCase()
                  .includes(
                    sourceFilter.toLowerCase()
                  )
              : true;

          const matchesExecutive =
            executiveFilter
              ? lead.closingExecutive
                  ?.toLowerCase()
                  .includes(
                    executiveFilter.toLowerCase()
                  )
              : true;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesProject &&
            matchesSource &&
            matchesExecutive
          );
        }
      );

    }, [
      leads,
      search,
      statusFilter,
      projectFilter,
      sourceFilter,
      executiveFilter
    ]);

  /* ================= STATS ================= */

  const stats = useMemo(() => {

    return {

      total:
        leads.length,

      new:
        leads.filter(
          (l) =>
            l.status ===
            "New"
        ).length,

      interested:
        leads.filter(
          (l) =>
            l.status ===
            "Interested"
        ).length,

      booked:
        leads.filter(
          (l) =>
            l.status ===
            "Booked"
        ).length,

      followup:
        leads.filter(
          (l) =>
            l.status ===
            "Followup"
        ).length,

      notInterested:
        leads.filter(
          (l) =>
            l.status ===
            "Not Interested"
        ).length

    };

  }, [leads]);

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={
          toggleSidebar
        }
      />

      <div
        className={`main-content ${
          isOpen
            ? "shifted"
            : "full"
        }`}
      >

        {/* ================= HEADER ================= */}

        <div className="page-header">

          <h2>
            My Leads
          </h2>

          <p>

            Total Leads :

            <strong>
              {" "}
              {leads.length}
            </strong>

          </p>

        </div>

        {/* ================= NEW LEAD BUTTON ================= */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px"
          }}
        >

          <button
            className="save-btn"
            onClick={() =>
              setShowNewLeadModal(true)
            }
          >
            + New Lead
          </button>

        </div>

        {/* ================= SMALL STATS ================= */}

        <div className="stats-grid">

          <div className="stats-card">
            <h5>Total</h5>
            <p>{stats.total}</p>
          </div>

          <div className="stats-card new">
            <h5>New</h5>
            <p>{stats.new}</p>
          </div>

          <div className="stats-card interested">
            <h5>Interested</h5>
            <p>{stats.interested}</p>
          </div>

          <div className="stats-card booked">
            <h5>Booked</h5>
            <p>{stats.booked}</p>
          </div>

          <div className="stats-card followup">
            <h5>Followup</h5>
            <p>{stats.followup}</p>
          </div>

          <div className="stats-card not">
            <h5>Not Interested</h5>
            <p>{stats.notInterested}</p>
          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="filter-bar">

          <input
            type="text"
            placeholder="Search Lead..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="">
              All Status
            </option>

            <option value="New">
              New
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Followup">
              Followup
            </option>

            <option value="Booked">
              Booked
            </option>

            <option value="Not Interested">
              Not Interested
            </option>

          </select>

        </div>

        {/* ================= TABLE ================= */}

        <div className="table-wrapper">

          <table className="leads-table">

            <thead>

              <tr>

                <th>#</th>

                <th>Name</th>

                <th>Call / Mobile</th>

                <th>Assigned To</th>

                <th>Closing Executive</th>

                <th>Status</th>

                <th>Project</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredLeads.map(

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
                      {lead.name || "-"}
                    </td>

                    <td>
                      {lead.phone || "-"}
                    </td>

                    <td>
                      {lead.assignedTo || "-"}
                    </td>

                    <td>
                      {lead.closingExecutive || "-"}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${lead.status
                          ?.toLowerCase()
                          .replace(
                            " ",
                            "-"
                          )}`}
                      >

                        {lead.status ||
                          "New"}

                      </span>

                    </td>

                    <td>
                      {lead.project || "-"}
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() => {

                            setSelectedLead(
                              {
                                ...lead
                              }
                            );

                            setShowModal(
                              true
                            );

                          }}
                        >

                          Edit

                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              lead._id
                            )
                          }
                        >

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= NEW LEAD MODAL ================= */}

      {showNewLeadModal && (

        <div className="modal-overlay">

          <div
            className="modal-box"
            style={{
              width: "95%",
              maxWidth: "1200px"
            }}
          >

            <h2
              style={{
                marginBottom: "20px"
              }}
            >
              Add New Lead
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, 1fr)",
                gap: "15px"
              }}
            >

              <input
                type="text"
                placeholder="Name"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    name:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Mobile"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    phone:
                      e.target.value
                  })
                }
              />

              <input
                type="email"
                placeholder="Primary Email"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    email:
                      e.target.value
                  })
                }
              />

              {/* PROJECT */}

              <select
                value={newLead.project}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    project:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Please select
                </option>

                <option>
                  99villa.
                </option>

                <option>
                  99 villa plot.
                </option>

                <option>
                  Affordable life
                </option>

                <option>
                  Alibaug Plot.
                </option>

                <option>
                  ANJALI ZAMIN.
                </option>

                <option>
                  Maha-Mumbaai
                </option>

                <option>
                  Mahamumbai Phase 2
                </option>

                <option>
                  Panvel (99Villa)
                </option>

              </select>

              {/* STATUS */}

              <select
                value={newLead.status}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    status:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Lead Status
                </option>

                <option value="New">
                  New
                </option>

                <option value="Interested">
                  Interested
                </option>

                <option value="Not Interested">
                  Not Interested
                </option>

                <option value="Call Back">
                  Call Back
                </option>

                <option value="Call cut">
                  Call cut
                </option>

                <option value="Ringing">
                  Ringing
                </option>

                <option value="Switch Off">
                  Switch Off
                </option>

                <option value="Site Visit">
                  Site Visit
                </option>

                <option value="Booked">
                  Booked
                </option>

              </select>

              <input
                type="date"
                value={newLead.next_call_date}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    next_call_date:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Assign To"
                value={newLead.assignedTo}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    assignedTo:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Closing Executive"
                value={newLead.closingExecutive}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    closingExecutive:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Source"
                value={newLead.source}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    source:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Sub Source"
                value={newLead.subSource}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    subSource:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={newLead.city}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    city:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Telecaller Name"
                value={newLead.telecallerName}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    telecallerName:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Department"
                value={newLead.department}
                onChange={(e) =>
                  setNewLead({
                    ...newLead,
                    department:
                      e.target.value
                  })
                }
              />

            </div>

            {/* BOOKING FIELDS */}

            {newLead.status ===
              "Booked" && (

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px"
                }}
              >

                <input
                  type="date"
                  value={
                    newLead.bookingDate
                  }
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      bookingDate:
                        e.target.value
                    })
                  }
                />

                <input
                  type="file"
                />

              </div>

            )}

            {/* DEAD REASON */}

            {newLead.status ===
              "Not Interested" && (

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px"
                }}
              >

                <select
                  value={
                    newLead.deadReason
                  }
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      deadReason:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    Dead Reason
                  </option>

                  <option value="Budget Issue">
                    Budget Issue
                  </option>

                  <option value="Location Issue">
                    Location Issue
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                <input
                  type="text"
                  placeholder="Dead Sub Reason"
                  value={
                    newLead.deadSubReason
                  }
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      deadSubReason:
                        e.target.value
                    })
                  }
                />

              </div>

            )}

            {/* COMMENT */}

            <textarea
              placeholder="Comment"
              rows="5"
              style={{
                width: "100%",
                marginTop: "20px"
              }}
              value={newLead.comment}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  comment:
                    e.target.value
                })
              }
            />

            {/* BUTTONS */}

            <div
              className="modal-actions"
              style={{
                marginTop: "20px"
              }}
            >

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowNewLeadModal(
                    false
                  )
                }
              >

                Cancel

              </button>

              <button
                className="save-btn"
                onClick={
                  handleCreateLead
                }
              >

                Save Lead

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}