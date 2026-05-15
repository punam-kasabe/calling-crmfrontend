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

    const [showAdvancedSearch, setShowAdvancedSearch] =
    useState(false);

    const [projectFilter, setProjectFilter] =
    useState("");

    const [sourceFilter, setSourceFilter] =
    useState("");

    const [executiveFilter, setExecutiveFilter] =
    useState("");


     /* ================= NEW LEAD MODAL ================= */

const [showNewLeadModal, setShowNewLeadModal] =
  useState(false);

const [newLead, setNewLead] = useState({
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
  next_call_date: "",
  department: "",
  description: "",
  deadReason: "",
  deadSubReason: "",
  bookingDate: "",
});

/* ================= DROPDOWNS ================= */

const projectOptions = [
  "99villa.",
  "99 villa plot.",
  "Affordable life",
  "Alibaug Plot.",
  "ANJALI ZAMIN.",
  "Gudipadwa plot in 5 Lacs.",
  "Khopoli-pali Road plots",
  "Maha-Mumbaai",
  "MAHAMUMBAI",
  "Maha-Mumbaii",
  "Mahamumbai Phase 2",
  "Mmahamumbai.",
  "Panvel (99Villa)",
  "Sheetal Campaign.",
  "Thane (Nitesh)",
  "Thane (Virendra)",
];

const statusOptions = [
  "New",
  "Interested",
  "Not Interested",
  "Followup",
  "Booked",
  "Call Cut",
  "Call Back",
  "Ringing",
  "Busy",
  "Switch Off",
  "Out of Service",
  "Wrong Number"
];

const deadReasonOptions = [
  "Budget Issue",
  "Location Issue",
  "Other",
];
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

  
/* ================= ADD NEW LEAD ================= */

const handleAddNewLead = async () => {

  if (newLead.phone.length !== 10) {

  alert("Mobile number must be 10 digits");

  return;
}
  try {

    await axios.post(
      `${API}/add-lead`,
      newLead
    );

    alert("Lead Added Successfully ✅");

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
      next_call_date: "",
      department: "",
      description: "",
      deadReason: "",
      deadSubReason: "",
      bookingDate: "",
    });

    fetchMyLeads();

  }

  catch (err) {

    console.error(err);

    alert("Failed To Add Lead ❌");
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
   ${lead.source}
   ${lead.email}
   ${lead.city}
   ${lead.closingExecutive}`

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

         <option value="">
  All Status
</option>

{statusOptions.map((status, i) => (
  <option key={i} value={status}>
    {status}
  </option>
))}

            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          

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


        </div>

{/* ================= ACTION BUTTONS ================= */}

<div className="top-actions">

  <button
    className="advanced-btn"

    onClick={() =>
      setShowAdvancedSearch(
        !showAdvancedSearch
      )
    }
  >

    Advanced Search

  </button>
    
<button
  className="newlead-btn"

  onClick={() =>
    setShowNewLeadModal(true)
  }
>

  + New Lead

</button>

  <button
    className="export-btn"

    onClick={() => {

      const csvRows = [];

      const headers = [

        "Name",
        "Mobile",
        "Assigned To",
        "Closing Executive",
        "Status",
        "Project",
        "Description",
        "Next Call Date",
        "Sub Source",
        "Created At"

      ];

      csvRows.push(headers.join(","));

      filteredLeads.forEach((lead) => {

        const row = [

          lead.name || "",
          lead.phone || "",
          lead.assigned_To || "",
          lead.closingExecutive || "",
          lead.status || "",
          lead.project || "",
          lead.description || "",
          lead.next_call_date || "",
          lead.subSource || "",
          lead.createdAt || ""

        ];

        csvRows.push(row.join(","));

      });

      const blob = new Blob(
        [csvRows.join("\n")],
        { type: "text/csv" }
      );

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "my-leads.csv";

      a.click();

    }}
  >

    Export CSV

  </button>

       </div>
       {/* ================= ADVANCED SEARCH ================= */}

{showAdvancedSearch && (

  <div className="advanced-search-box">

    <input
      type="text"
      placeholder="Search Project..."
      value={projectFilter}
      onChange={(e) =>
        setProjectFilter(e.target.value)
      }
    />

    <input
      type="text"
      placeholder="Search Source..."
      value={sourceFilter}
      onChange={(e) =>
        setSourceFilter(e.target.value)
      }
    />

    

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
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

    <input
  type="text"
  placeholder="Search Executive..."
  value={executiveFilter}
  onChange={(e) =>
    setExecutiveFilter(e.target.value)
  }
/>

    <button
      className="clear-filter-btn"
      onClick={() => {

        setProjectFilter("");
        setSourceFilter("");
        setStatusFilter("");
        setSearch("");
        setExecutiveFilter("");
      }}
    >
      Clear Filters
    </button>
  </div>
)}
        {/* ================= CONTENT ================= */}

        {loading ? (

          <div className="loader">

            Loading leads...

          </div>

        ) : filteredLeads.length ===
          0 ? (

          <div className="empty-state">

            No leads found.

          </div>

        ) : (

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

                  <th>Description</th>

                  <th>Next Call Date</th>

                  <th>Sub Source</th>

                  <th>Created At</th>

                  <th>Update Status</th>

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

                      <td className="description-cell">
                        {lead.description || "-"}
                      </td>

                      <td>

                        {lead.next_call_date

                          ? new Date(
                              lead.next_call_date
                            )

                              .toISOString()

                              .split(
                                "T"
                              )[0]

                          : "-"}

                      </td>

                      <td>
                        {lead.subSource || "-"}
                      </td>

                      <td>

                        {lead.createdAt

                          ? new Date(
                              lead.createdAt
                            ).toLocaleString()

                          : "-"}

                      </td>

                      {/* STATUS UPDATE */}

                      <td>

                        <select
                          className="status-select"

                          value={
                            lead.status ||
                            "New"
                          }

                          onChange={(e) =>
                            updateStatus(
                              lead._id,
                              e.target
                                .value
                            )
                          }
                        >

                          {statusOptions.map((status, i) => (
                       <option key={i} value={status}>
                        {status}
                    </option>
                          ))}

                        </select>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="action-buttons">

                          <a
                            href={`tel:${lead.phone}`}

                            className="call-btn"
                          >

                            Call

                          </a>

                          <a
                            href={`https://wa.me/91${lead.phone}`}

                            target="_blank"

                            rel="noreferrer"

                            className="whatsapp-btn"
                          >

                            WhatsApp

                          </a>

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

                          

                        </div>

                      </td>

                    </tr>

                  )

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

     {/* ================= NEW LEAD MODAL ================= */}

{showNewLeadModal && (

  <div className="modal-overlay">

    <div className="modal-box large-modal">

      <h2>Add New Lead</h2>

      <div className="lead-form-grid">

        <input
          type="text"
          placeholder="Name"
          value={newLead.name}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              name: e.target.value
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
              phone: e.target.value
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
              email: e.target.value
            })
          }
        />

        <select
          value={newLead.project}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              project: e.target.value
            })
          }
        >

          <option value="">
            Please Select Project
          </option>

          {projectOptions.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}

        </select>

        <select
          value={newLead.status}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              status: e.target.value
            })
          }
        >

          <option value="">
            Lead Status
          </option>

          {statusOptions.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}

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
          placeholder="Source"
          value={newLead.source}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              source: e.target.value
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
              subSource: e.target.value
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
              city: e.target.value
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
              assignedTo: e.target.value
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

      {/* DEAD REASON */}

      {newLead.status ===
        "Not Interested" && (

        <div className="lead-form-grid">

          <select
            value={newLead.deadReason}
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

            {deadReasonOptions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Dead Sub Reason"
            value={newLead.deadSubReason}
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

      {/* BOOKING */}

      {newLead.status ===
        "Booked" && (

        <div className="lead-form-grid">

          <input
            type="date"
            value={newLead.bookingDate}
            onChange={(e) =>
              setNewLead({
                ...newLead,
                bookingDate:
                  e.target.value
              })
            }
          />

          <input type="file" />

        </div>

      )}

      <textarea
        placeholder="Comment"
        rows="4"
        value={newLead.description}
        onChange={(e) =>
          setNewLead({
            ...newLead,
            description:
              e.target.value
          })
        }
      />

      <div className="modal-actions">

        <button
          className="cancel-btn"
          onClick={() =>
            setShowNewLeadModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="save-btn"
          onClick={handleAddNewLead}
        >
          Save Lead
        </button>

      </div>

    </div>

  </div>

)}

      {/* ================= EDIT MODAL ================= */}

      {showModal &&
        selectedLead && (

          <div className="modal-overlay">

            <div className="modal-box">

              <h3>
                Edit Lead
              </h3>

              <input
                type="text"

                value={
                  selectedLead.name
                }

                onChange={(e) =>

                  setSelectedLead({

                    ...selectedLead,

                    name:
                      e.target
                        .value

                  })

                }
              />

              <input
                type="text"

                value={
                  selectedLead.phone
                }

                onChange={(e) =>

                  setSelectedLead({

                    ...selectedLead,

                    phone:
                      e.target
                        .value

                  })

                }
              />

              <input
                type="text"

                value={
                  selectedLead.project
                }

                onChange={(e) =>

                  setSelectedLead({

                    ...selectedLead,

                    project:
                      e.target
                        .value

                  })

                }
              />

              <select
                value={
                  selectedLead.status
                }

                onChange={(e) =>

                  setSelectedLead({

                    ...selectedLead,

                    status:
                      e.target
                        .value

                  })

                }
              >

                {statusOptions.map((status, i) => (
  <option key={i} value={status}>
    {status}
  </option>
))}

              </select>

              <input
                type="date"

                value={
                  selectedLead.next_call_date

                    ? new Date(
                        selectedLead.next_call_date
                      )

                        .toISOString()

                        .split("T")[0]

                    : ""
                }

                onChange={(e) =>

                  setSelectedLead({

                    ...selectedLead,

                    next_call_date:
                      e.target
                        .value

                  })

                }
              />

              <div className="modal-actions">

                <button
                  className="cancel-btn"

                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >

                  Cancel

                </button>

                <button
                  className="save-btn"

                  onClick={
                    handleUpdateLead
                  }
                >

                  Save

                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}

