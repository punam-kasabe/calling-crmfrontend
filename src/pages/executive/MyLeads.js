import {
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";

import axios from "axios";
import Select from "react-select";
import Sidebar from "../../components/Sidebar";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEdit
} from "react-icons/fa";
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
  
 
const [subSourceFilter, setSubSourceFilter] = useState("");
const [cityFilter, setCityFilter] = useState("");
const [departmentFilter, setDepartmentFilter] = useState("");
const [assignedFilter, setAssignedFilter] = useState("");
const [fromDateFilter, setFromDateFilter] = useState("");
const [toDateFilter, setToDateFilter] = useState("");
const [nextCallFrom, setNextCallFrom] = useState("");
const [nextCallTo, setNextCallTo] = useState("");
const [descriptionFilter, setDescriptionFilter] = useState("");
const [selectedProjects, setSelectedProjects] = useState([]);
const [selectedSources, setSelectedSources] = useState([]);
const [selectedDepartments, setSelectedDepartments] = useState([]);
const [selectedExecutives, setSelectedExecutives] = useState([]);
const [selectedCities, setSelectedCities] = useState([]);

/* ================= PAGINATION ================= */

const [currentPage, setCurrentPage] = useState(1);

const leadsPerPage = 10;


     /* ================= NEW LEAD MODAL ================= */

  
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
  assigned_to_email: "",
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
  "Mahamumbai",
  "MAHAMUMBAI",
  "Maha-Mumbaii",
  "Mahamumbai Phase 2",
  "Mmahamumbai.",
  "Panvel (99Villa)",
  "Sheetal Campaign.",
  "Sheetal THANE.",
  "Thane (Nitesh)",
  "Thane (Virendra)",
  "THANE...( VIRENDRA)",
  "THANE...( VIRENDRAA)"
];

const statusOptions = [
  "New",
  "Ringing",
  "Connected",
  "Interested",
  "Very Interested",
  "Not Interested",
  "Call Cut",
  "Busy",
  "Call Back",
  "Switched Off",
  "Number Not Reachable",
  "Wrong Number",
  "Invalid Number",
  "Duplicate Lead",
  "Follow Up",
  "Follow Up Done",
  "Meeting Scheduled",
  "Site Visit Planned",
  "Site Visit Done",
  "Negotiation",
  "Payment Pending",
  "Booked",
  "Other Property Booked",
  "Token Received",
  "Cancelled",
  "Future Prospect",
  "No Response"
];

const deadReasonOptions = [
  "Budget Issue",
  "Location Issue",
  "Other",
];

const sourceOptions = [
  "Website",
  "99 Acres",
  "Facebook",
  "Google",
  "Hoarding",
  "Microsites",
  "Virtual call"
];

const departmentOptions = [
  "Sales/Marketing",
  "HR/Admin",
  "Aasma Madam",
  "Nilesh Sir",
  "Telecaller"
];

const projectDropdownOptions = projectOptions.map((item) => ({
  value: item,
  label: item
}));

const sourceDropdownOptions = sourceOptions.map((item) => ({
  value: item,
  label: item
}));

const departmentDropdownOptions = departmentOptions.map((item) => ({
  value: item,
  label: item
}));

const executiveDropdownOptions = [
  ...new Set(
    leads
      .map((l) => l.closingExecutive)
      .filter(Boolean)
  )
].map((item) => ({
  value: item,
  label: item
}));

const cityDropdownOptions = [
  ...new Set(
    leads
      .map((l) => l.city)
      .filter(Boolean)
  )
].map((item) => ({
  value: item,
  label: item
}));


  /* ================= USER ================= */

   const user = useMemo(() => {

    return JSON.parse(
      localStorage.getItem("user")
    ) || {};

  }, []);
  
/* ================= NEW LEAD MODAL ================= */

  const [showNewLeadModal, setShowNewLeadModal] =
  useState(false);


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
        fetchMyLeads();

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

       const updatedData = {
  assignedTo: selectedLead.assignedTo,
  assigned_to_email:
  selectedLead.assigned_to_email,
  closingExecutive: selectedLead.closingExecutive,
  status: selectedLead.status,
  source: selectedLead.source,
  project: selectedLead.project,
  next_call_date: selectedLead.next_call_date,
  description: selectedLead.description,
  department: selectedLead.department,
};

      await axios.put(
      `${API}/update-lead/${selectedLead._id}`,
      updatedData
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

      fetchMyLeads();

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

  if (
    !newLead.name ||
    !newLead.phone ||
    !newLead.project
  ) {

    alert(
      "Please fill required fields ❌"
    );

    return;
  }

  try {

    const res = await axios.post(
      `${API}/add-lead`,
      newLead
    );

    /* ================= ADD DIRECTLY IN TABLE ================= */

    const createdLead =
      res.data?.lead || res.data;

    setLeads((prev) => [
      createdLead,
      ...prev
    ]);

    alert(
      "Lead Added Successfully ✅"
    );

    setShowNewLeadModal(false);

    /* ================= RESET FORM ================= */

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

  }

  catch (err) {

    console.error(err);

    alert(
      "Failed To Add Lead ❌"
    );

  }

};

  /* ================= FILTER ================= */

  const filteredLeads =
    useMemo(() => {

      return leads.filter(
        (lead) => {

          const matchesSearch =

           `${lead.name || ""}
            ${lead.phone || ""}
            ${lead.project || ""}
            ${lead.source || ""}
            ${lead.closingExecutive || ""}`
                    
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
  selectedProjects.length > 0
    ? selectedProjects.some(
        (p) => p.value === lead.project
      )
    : true;

const matchesSource =
  selectedSources.length > 0
    ? selectedSources.some(
        (s) => s.value === lead.source
      )
    : true;

const matchesExecutive =
  selectedExecutives.length > 0
    ? selectedExecutives.some(
        (e) =>
          e.value === lead.closingExecutive
      )
    : true;

const matchesCity =
  selectedCities.length > 0
    ? selectedCities.some(
        (c) => c.value === lead.city
      )
    : true;

const matchesDepartment =
  selectedDepartments.length > 0
    ? selectedDepartments.some(
        (d) => d.value === lead.department
      )
    : true;


const matchesDepartment =
  departmentFilter
    ? lead.department
        ?.toLowerCase()
        .includes(
          departmentFilter.toLowerCase()
        )
    : true;

const matchesAssigned =
  assignedFilter
    ? lead.assignedTo
        ?.toLowerCase()
        .includes(
          assignedFilter.toLowerCase()
        )
    : true;

const matchesDescription =
  descriptionFilter
    ? lead.description
        ?.toLowerCase()
        .includes(
          descriptionFilter.toLowerCase()
        )
    : true;

const createdDate =
  lead.createdAt
    ? new Date(lead.createdAt)
        .toISOString()
        .split("T")[0]
    : "";

const matchesFromDate =
  fromDateFilter
    ? createdDate >= fromDateFilter
    : true;

const matchesToDate =
  toDateFilter
    ? createdDate <= toDateFilter
    : true;

const nextCallDate =
  lead.next_call_date
    ? lead.next_call_date
        .split("T")[0]
    : "";

const matchesNextCallFrom =
  nextCallFrom
    ? nextCallDate >= nextCallFrom
    : true;

const matchesNextCallTo =
  nextCallTo
    ? nextCallDate <= nextCallTo
    : true;
return (
  matchesSearch &&
  matchesStatus &&
  matchesProject &&
  matchesSource &&
  matchesExecutive &&
  matchesSubSource &&
  matchesCity &&
  matchesDepartment &&
  matchesAssigned &&
  matchesDescription &&
  matchesFromDate &&
  matchesToDate &&
  matchesNextCallFrom &&
  matchesNextCallTo
);
        }
      );

    }, [


  leads,
  search,
  statusFilter,
  projectFilter,
  sourceFilter,
  executiveFilter,
  subSourceFilter,
  cityFilter,
  departmentFilter,
  assignedFilter,
  fromDateFilter,
  toDateFilter,
  nextCallFrom,
  nextCallTo,
  descriptionFilter,
  selectedProjects,
selectedSources,
selectedExecutives,
selectedCities,
selectedDepartments
]);

/* ================= PAGINATION LOGIC ================= */

const totalPages = Math.ceil(
  filteredLeads.length / leadsPerPage
);

const indexOfLastLead =
  currentPage * leadsPerPage;

const indexOfFirstLead =
  indexOfLastLead - leadsPerPage;

const currentLeads =
  filteredLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

/* ================= PAGE CHANGE ================= */

const handleNextPage = () => {

  if (currentPage < totalPages) {

    setCurrentPage(currentPage + 1);

  }

};

const handlePrevPage = () => {

  if (currentPage > 1) {

    setCurrentPage(currentPage - 1);

  }

};

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
       l.status === "Interested" ||
       l.status === "Very Interested"
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
      "Follow Up"
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
     

         {/* ================= SINGLE SEARCH ================= */}

         <div className="filter-bar">

        <input
         type="text"
         placeholder="Type to search"
         value={search}
         onChange={(e) =>
        setSearch(e.target.value)
       }
         className="global-search"
       />

       </div>
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

  onClick={() => {

 setNewLead((prev) => ({
  ...prev,

  assignedTo:
    user?.name ||
    user?.username ||
    "",

  assigned_to_email:
    user?.email || "",

  closingExecutive:
    user?.name ||
    user?.username ||
    ""
}));

  setShowNewLeadModal(true);

}}
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

  `"${lead.name || ""}"`,
  `"${lead.phone || ""}"`,
  `"${lead.assignedTo || ""}"`,
  `"${lead.closingExecutive || ""}"`,
  `"${lead.status || ""}"`,
  `"${lead.project || ""}"`,
  `"${lead.description || ""}"`,
  `"${lead.next_call_date || ""}"`,
  `"${lead.subSource || ""}"`,
  `"${lead.createdAt || ""}"`

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
       {showAdvancedSearch && (

  <div className="advanced-search-box">

    <div className="multi-filter">
  <label>Project</label>

  <Select
    options={projectDropdownOptions}
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    value={selectedProjects}
    onChange={setSelectedProjects}
    placeholder="Select Project"
  />
</div>

   <div className="multi-filter">
  <label>Source</label>

  <Select
    options={sourceDropdownOptions}
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    value={selectedSources}
    onChange={setSelectedSources}
    placeholder="Select Source"
  />
</div>

    <input
      type="text"
      placeholder="Search Sub Source..."
      value={subSourceFilter}
      onChange={(e) =>
        setSubSourceFilter(e.target.value)
      }
    />

   <div className="multi-filter">
  <label>City</label>

  <Select
    options={cityDropdownOptions}
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    value={selectedCities}
    onChange={setSelectedCities}
    placeholder="Select City"
  />
</div>


<div className="multi-filter">
  <label>Executive</label>

  <Select
    options={executiveDropdownOptions}
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    value={selectedExecutives}
    onChange={setSelectedExecutives}
    placeholder="Select Executive"
  />
</div>

    <div className="multi-filter">
  <label>Department</label>

  <Select
    options={departmentDropdownOptions}
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    value={selectedDepartments}
    onChange={setSelectedDepartments}
    placeholder="Select Department"
  />
</div>

    <input
      type="text"
      placeholder="Assigned To..."
      value={assignedFilter}
      onChange={(e) =>
        setAssignedFilter(e.target.value)
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

      {statusOptions.map((status, i) => (
        <option
          key={i}
          value={status}
        >
          {status}
        </option>
      ))}
    </select>

    {/* CREATED DATE */}

    <div className="date-group">
      <label>
        Created Date From
      </label>

      <input
        type="date"
        value={fromDateFilter}
        onChange={(e) =>
          setFromDateFilter(e.target.value)
        }
      />
    </div>

    <div className="date-group">
      <label>
        Created Date To
      </label>

      <input
        type="date"
        value={toDateFilter}
        onChange={(e) =>
          setToDateFilter(e.target.value)
        }
      />
    </div>

    {/* NEXT CALL DATE */}

    <div className="date-group">
      <label>
        Next Call Date From
      </label>

      <input
        type="date"
        value={nextCallFrom}
        onChange={(e) =>
          setNextCallFrom(e.target.value)
        }
      />
    </div>

    <div className="date-group">
      <label>
        Next Call Date To
      </label>

      <input
        type="date"
        value={nextCallTo}
        onChange={(e) =>
          setNextCallTo(e.target.value)
        }
      />
    </div>

    <input
      type="text"
      placeholder="Description..."
      value={descriptionFilter}
      onChange={(e) =>
        setDescriptionFilter(e.target.value)
      }
    />

    <button
      className="clear-filter-btn"
      onClick={() => {

        setProjectFilter("");
        setSourceFilter("");
        setSubSourceFilter("");
        setCityFilter("");
        setExecutiveFilter("");
        setDepartmentFilter("");
        setAssignedFilter("");
        setStatusFilter("");
        setFromDateFilter("");
        setToDateFilter("");
        setNextCallFrom("");
        setNextCallTo("");
        setDescriptionFilter("");
        setSelectedProjects([]);
        setSelectedSources([]);
        setSelectedDepartments([]);
        setSelectedExecutives([]);
        setSelectedCities([]);

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

                  <th>Department</th>

                  <th>Next Call Date</th>

                  <th>Sub Source</th>

                  <th>Created At</th>

                  <th>Update Status</th>

                  <th>Action</th>

                </tr>
              </thead>
              <tbody>

                {currentLeads.map(

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
                       {indexOfFirstLead + index + 1}
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
                           .replace(/\s+/g, "-")
                          }`}
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
                         {lead.department || "-"}
                           </td>
                     <td>
                {lead.next_call_date
                ? lead.next_call_date.split("T")[0]
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

  {/* CALL ICON */}

  <a
    href={`tel:${lead.phone}`}
    className="call-btn icon-btn"
    title="Call"
  >
    <FaPhoneAlt />
  </a>

  {/* WHATSAPP ICON */}

  <a
    href={`https://wa.me/91${String(
      lead.phone
    ).replace(/\D/g, "")}`}

    target="_blank"
    rel="noreferrer"

    className="whatsapp-btn icon-btn"
    title="WhatsApp"
  >
    <FaWhatsapp />
  </a>

  {/* EDIT ICON */}

  <button
    className="edit-btn icon-btn"

    title="Edit"

    onClick={() => {

      setSelectedLead({
        ...lead,

        assignedTo:
          lead.assignedTo ||
          user.name ||
          user.username ||
          "",
        assigned_to_email:
  lead.assigned_to_email ||
  user.email ||
  "",


        next_call_date:
          lead.next_call_date
            ? lead.next_call_date.split("T")[0]
            : ""
      });

      setShowModal(true);

    }}
  >
    <FaEdit />
  </button>

</div>

                      </td>

                    </tr>

                  )

                )}

              </tbody>

            </table>

  {/* ================= PAGINATION ================= */}

<div className="pagination">

  <button
    onClick={handlePrevPage}
    disabled={currentPage === 1}
    className="page-btn"
  >
    Previous
  </button>

  <span className="page-info">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="page-btn"
  >
    Next
  </button>

</div>


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

           <select
         value={newLead.source}
        onChange={(e) =>
        setNewLead({
        ...newLead,
         source: e.target.value
         })
           }
           >
           <option value="">
              Select Source
          </option>

           {sourceOptions.map((source, i) => (
            <option
              key={i}
            value={source}
             >
            {source}
            </option>
                ))}
             </select>

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

        <select
  value={newLead.department}
  onChange={(e) =>
    setNewLead({
      ...newLead,
      department: e.target.value
    })
  }
>
  <option value="">
    Please Select Department
  </option>

  {departmentOptions.map((dept, i) => (
    <option
      key={i}
      value={dept}
    >
      {dept}
    </option>
  ))}
</select>

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

{showModal && selectedLead && (

  <div className="modal-overlay">

    <div className="modal-box large-modal">

      <h2>Edit Lead</h2>

      <div className="lead-form-grid">

        {/* ASSIGN TO */}

        <div>
          <label>Assign To</label>

          <input
            type="text"
            value={
              selectedLead.assignedTo ||
              user.name ||
              ""
            }
            readOnly
          />
        </div>

        {/* CLOSING EXECUTIVE */}

        <div>
          <label>Closing Executive</label>

          <input
            type="text"
            value={
              selectedLead.closingExecutive || ""
            }

            onChange={(e) =>

              setSelectedLead({

                ...selectedLead,

                closingExecutive:
                  e.target.value

              })

            }
          />
        </div>

        {/* STATUS */}

        <div>
          <label>Status</label>

          <select
            value={
              selectedLead.status || ""
            }

            onChange={(e) =>

              setSelectedLead({

                ...selectedLead,

                status:
                  e.target.value

              })

            }
          >

            <option value="">
              Select Status
            </option>

            {statusOptions.map((status, i) => (

              <option
                key={i}
                value={status}
              >
                {status}
              </option>

            ))}

          </select>
        </div>

        {/* PROJECT */}

        <div>
          <label>Project</label>

          <select
            value={
              selectedLead.project || ""
            }

            onChange={(e) =>

              setSelectedLead({

                ...selectedLead,

                project:
                  e.target.value

              })

            }
          >

            <option value="">
              Select Project
            </option>

            {projectOptions.map((project, i) => (

              <option
                key={i}
                value={project}
              >
                {project}
              </option>

            ))}

          </select>
        </div>


      {/* SOURCE */}

<div>
  <label>Source</label>

  <select
    value={
      selectedLead.source || ""
    }

    onChange={(e) =>

      setSelectedLead({

        ...selectedLead,

        source:
          e.target.value

      })

    }
  >

    <option value="">
      Select Source
    </option>

    {sourceOptions.map((source, i) => (

      <option
        key={i}
        value={source}
      >
        {source}
      </option>

    ))}

        </select>
       </div>

        {/* DEPARTMENT */}

<div>
  <label>Department</label>

  <select
    value={
      selectedLead.department || ""
    }

    onChange={(e) =>

      setSelectedLead({

        ...selectedLead,

        department:
          e.target.value

      })

    }
  >

    <option value="">
      Please Select Department
    </option>

    {departmentOptions.map((dept, i) => (

      <option
        key={i}
        value={dept}
      >
        {dept}
      </option>

    ))}

  </select>
</div>



        {/* NEXT CALL DATE */}

        <div>
          <label>Next Call Date</label>

          <input
            type="date"

            value={
              selectedLead.next_call_date || ""
            }

            onChange={(e) =>

              setSelectedLead({

                ...selectedLead,

                next_call_date:
                  e.target.value

              })

            }
          />
        </div>

      </div>

      {/* COMMENT */}

      <textarea
        placeholder="Comment"
        rows="4"

        value={
          selectedLead.description || ""
        }

        onChange={(e) =>

          setSelectedLead({

            ...selectedLead,

            description:
              e.target.value

          })

        }
      />

      {/* BUTTONS */}

      <div className="modal-actions">

        <button
          className="cancel-btn"

          onClick={() =>
            setShowModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="save-btn"

          onClick={handleUpdateLead}
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

