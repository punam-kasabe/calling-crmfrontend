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

    const [bookingCount, setBookingCount] =
    useState(0);

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
const [showBookingModal,
setShowBookingModal] =
useState(false);

const [bookingData,
setBookingData] =
useState({

unitNo:"",
bookingAmount:""

});

  const [showAdvancedSearch, setShowAdvancedSearch] =
    useState(false);
  
 
const [subSourceFilter, setSubSourceFilter] = useState("");
const [assignedFilter, setAssignedFilter] = useState("");
const [fromDateFilter, setFromDateFilter] = useState("");
const [toDateFilter, setToDateFilter] = useState("");
const [nextCallFrom, setNextCallFrom] = useState("");
const [nextCallTo, setNextCallTo] = useState("");
const [descriptionFilter, setDescriptionFilter] = useState("");
const [selectedProjects, setSelectedProjects] = useState(null);
const [selectedSources, setSelectedSources] = useState([]);
const [selectedDepartments, setSelectedDepartments] = useState([]);
const [selectedExecutives, setSelectedExecutives] = useState([]);
const [selectedCities, setSelectedCities] = useState([]);
const [attendingOfficers, setAttendingOfficers] = useState([]);
const [callModal, setCallModal] = useState(false);

const [activeCall, setActiveCall] = useState(null);

const [callStartTime, setCallStartTime] = useState(null);

const [callDuration, setCallDuration] = useState("");


/* ================= PAGINATION ================= */

const [currentPage, setCurrentPage] = useState(1);

const leadsPerPage = 10;


     /* ================= NEW LEAD MODAL ================= */

  
  const [newLead, setNewLead] = useState({
  name: "",
  phone: "",
  email: "",
  project: "",
  status: "New",
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
  "Old Booking From Old Data",
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
  "Virtual call",
  "Vishal Sir Leads",
  "Chatbot"
];

const departmentOptions = [
  "Sales/Marketing",
  "HR/Admin",
  "Aasma Madam",
  "Nilesh Sir",
  "Telecaller"
];


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

  const fetchBookingsCount =
async () => {

  try {

    const res =
      await axios.get(
        `${API}/bookings-count`
      );

    setBookingCount(
      res.data.total || 0
    );

  }

  catch (err) {

    console.log(err);

  }

};

  /* ================= FETCH EXECUTIVES ================= */

const fetchExecutives = async () => {

  try {

    const res = await axios.get(
      `${API}/users`
    );

    const attendingUsers = res.data.filter(
      (u) =>
        u.role === "attending officer"
    );

    setAttendingOfficers(attendingUsers);

  }

  catch (err) {

    console.error(
      "Error fetching attending officers",
      err
    );

  }

};

useEffect(() => {

  fetchMyLeads();

  fetchBookingsCount();

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
  name: selectedLead.name,
  phone: selectedLead.phone,
  email: selectedLead.email,

  assignedTo:
    selectedLead.assignedTo,

  assigned_to_email:
    selectedLead.assigned_to_email,

  closingExecutive:
    selectedLead.closingExecutive,

  status:
    selectedLead.status,

  source:
    selectedLead.source,

  subSource:
    selectedLead.subSource,

  city:
    selectedLead.city,

  project:
    selectedLead.project,

  next_call_date:
    selectedLead.next_call_date,

  description:
    selectedLead.description,

  department:
    selectedLead.department,

  deadReason:
    selectedLead.deadReason,

  deadSubReason:
    selectedLead.deadSubReason,

  bookingDate:
    selectedLead.bookingDate
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

    const startCall = async (lead) => {

  setActiveCall(lead);

  setCallStartTime(new Date());

  window.open(`tel:${lead.phone}`);

  setTimeout(() => {
    setCallModal(true);
  }, 3000);

};


useEffect(() => {

  let interval;

  if (callModal && callStartTime) {

    interval = setInterval(() => {

      const seconds = Math.floor(
        (new Date() - callStartTime) / 1000
      );

      setCallDuration(`${seconds} sec`);

    }, 1000);

  }

  return () => clearInterval(interval);

}, [callModal, callStartTime]);


  const handleCreateBooking =
async()=>{

try{

await axios.post(

`${API}/create-booking`,

{

leadId:
selectedLead._id,

clientName:
selectedLead.name,

phone:
selectedLead.phone,

project:
selectedLead.project,

executive:
selectedLead.closingExecutive,

attendingOfficer:
selectedLead.assignedTo,

unitNo:
bookingData.unitNo,

bookingAmount:
bookingData.bookingAmount

}

);

alert(
"Booking Added ✅"
);

setShowBookingModal(false);

setBookingData({

unitNo:"",
bookingAmount:""

});

fetchMyLeads();

}catch(err){

console.log(err);

alert(
"Booking Failed ❌"
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
  assigned_to_email: "",
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
  /* ================= RESET PAGE ON FILTER CHANGE ================= */

useEffect(() => {

  setCurrentPage(1);

}, [
  search,
  statusFilter,
  selectedProjects,
  selectedSources,
  selectedExecutives,
  selectedCities,
  selectedDepartments,
  subSourceFilter,
  assignedFilter,
  fromDateFilter,
  toDateFilter,
  nextCallFrom,
  nextCallTo,
  descriptionFilter
]);
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
  selectedProjects
    ? selectedProjects.value === lead.project ||
      selectedProjects.label === lead.project
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


const matchesSubSource =
  subSourceFilter
    ? lead.subSource
        ?.toLowerCase()
        .includes(
          subSourceFilter.toLowerCase()
        )
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
  assignedFilter,
  subSourceFilter,
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
        ).length,

        siteVisitDone:
        leads.filter(
        (l) =>
        l.status ===
        "Site Visit Done"
  ).length,

         
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
         
          <div className="stats-card sitevisit">
         <h5>Site Visit Done</h5>
          <p>{stats.siteVisitDone}</p>
         </div>

        </div>
          
     

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
  `"${
  lead.next_call_date
    ? lead.next_call_date.split("T")[0]
    : ""
}"`,
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
    options={[
       { value: "Mahamumbai", label: "Mahamumbai" },
      { value: "6975", label: "Mahamumbai Phase 2" },
      { value: "7142", label: "Thane (Nitesh)" },
      { value: "6674", label: "Panvel (99Villa)" },
      { value: "6673", label: "Thane (Virendra)" },
      { value: "7517", label: "Affordable life" },
      { value: "7514", label: "99villa." },
      { value: "7670", label: "99 villa plot." },
      { value: "7743", label: "MAHAMUMBAI" },
      { value: "7747", label: "Khopoli-pali Road plots" },
      { value: "7843", label: "ANJALI ZAMIN." },
      { value: "7876", label: "Sheetal THANE." },
      { value: "7898", label: "THANE...( VIRENDRA)" },
      { value: "7899", label: "Alibaug Plot." },
      { value: "7871", label: "Sheetal Campaign." },
      { value: "7912", label: "Maha-Mumbaai" },
      { value: "7929", label: "THANE...( VIRENDRAA)" },
      { value: "7930", label: "Maha-Mumbaii" },
      { value: "7941", label: "Gudipadwa plot in 5 Lacs." },
      { value: "7950", label: "Mmahamumbai." }
    ]}

    isSearchable
    isClearable

    value={selectedProjects}

    onChange={(selected) =>
      setSelectedProjects(selected)
    }

    placeholder="Search Project..."

    styles={{
      control: (base) => ({
        ...base,
        minHeight: "45px",
        borderRadius: "10px"
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999
      })
    }}
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

    setSubSourceFilter("");
    setAssignedFilter("");
    setStatusFilter("");
    setFromDateFilter("");
    setToDateFilter("");
    setNextCallFrom("");
    setNextCallTo("");
    setDescriptionFilter("");

    setSelectedProjects(null);
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
    lead.status || "New"
  }

  onChange={async (e) => {

    const value =
      e.target.value;

    setLeads((prev) =>

      prev.map((l) =>

        l._id === lead._id
          ? {
              ...l,
              status: value
            }
          : l
      )
    );

    await updateStatus(
      lead._id,
      value
    );

  }}
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

  <button
  className="call-btn icon-btn"
  title="Call"
  onClick={() => startCall(lead)}
>
  <FaPhoneAlt />
</button>





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
{lead.status === "Booked" && (

<button
className="booking-btn"

onClick={()=>{

setSelectedLead(lead);

setShowBookingModal(true);

}}
>

Booking

</button>

)}
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
  Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={handleNextPage}
   disabled={
  currentPage === totalPages ||
  totalPages === 0
}
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

       <div>


  <label>Assign To Attending Officer</label>

  <select
    value={selectedLead.assignedTo || ""}

    onChange={(e) => {

      const selectedOfficer =
        attendingOfficers.find(
          (officer) =>
            officer.name === e.target.value
        );

      setSelectedLead({

        ...selectedLead,

        assignedTo:
          selectedOfficer?.name || "",

        assigned_to_email:
          selectedOfficer?.email || ""

      });

    }}
    
  >

    <option value="">
      Select Attending Officer
    </option>

    {attendingOfficers.map((officer) => (

      <option
        key={officer._id}
        value={officer.name}
      >
        {officer.name}
      </option>

    ))}

  </select>
</div>

        {/* CLOSING EXECUTIVE */}

<div>
<label>Closing Executive</label>

 <select
  value={
    selectedLead.closingExecutive || ""
  }

  onChange={(e) => {

    
    setSelectedLead({
  ...selectedLead,
  closingExecutive: e.target.value
});


  }}
>

    <option value="">
      Select Executive
    </option>

{attendingOfficers.map((officer) => (

      <option
       key={officer._id}
value={officer.name}
>
  {officer.name}
      </option>

    ))}

  </select>
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

{showBookingModal && (

<div className="modal-overlay">

<div className="modal-box">

<h3>Add Booking</h3>

<input
type="text"
placeholder="Unit No"

value={bookingData.unitNo}

onChange={(e)=>

setBookingData({

...bookingData,

unitNo:e.target.value

})

}
/>

<input
type="number"
placeholder="Booking Amount"

value={bookingData.bookingAmount}

onChange={(e)=>

setBookingData({

...bookingData,

bookingAmount:e.target.value

})

}
/>

<div className="modal-actions">

<button
className="cancel-btn"

onClick={()=>{

setShowBookingModal(false);

}}
>

Cancel

</button>

<button
className="save-btn"

onClick={handleCreateBooking}
>

Save Booking

</button>

</div>

</div>

</div>

)}

{/* ================= CALL MODAL ================= */}

{callModal && activeCall && (

  <div className="modal-overlay">

    <div className="modal-box">

      <h3>Call In Progress</h3>

      <p>
        <strong>Name:</strong> {activeCall.name}
      </p>

      <p>
        <strong>Phone:</strong> {activeCall.phone}
      </p>

      <p>
        <strong>Duration:</strong> {callDuration}
      </p>

      <button
        className="save-btn"
        onClick={() => {
  setCallModal(false);
  setCallDuration("");
  setCallStartTime(null);
  setActiveCall(null);
}}
      >
        Close
      </button>

    </div>

  </div>

)}

    </div>

  );

}

