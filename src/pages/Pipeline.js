import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "../styles/pipeline.css";
import {
  Pencil,
  Trash2,
  Phone
} from "lucide-react";
const API = "https://calling-crm-backend-7w52.onrender.com/api";


export default function Pipeline() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
  console.log("PROJECTS STATE =", projects);
  }, [projects]);
  const [statsData, setStatsData] = useState({
  totalLeads: 0,
  hotLeads: 0,
  newLeads: 0,
  bookedLeads: 0,
  inactiveLeads: 0,
  todayFollowups: 0,
  backlog: 0
});

  // 🔥 FILTER STATE
  const [filters, setFilters] = useState({
  status: [],
  assigned: "",
  closingExecutive: "",
  project: "",
  createdFrom: "",
  createdTo: ""
});
 
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

 

const closingExecutives = [
  ...new Set(
    leads
      .map((l) => l.assigned_manager)
      .filter(Boolean)
  )
];

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Interested", label: "Interested" },
  { value: "Ringing", label: "Ringing" },
  { value: "Call Back", label: "Call Back" },
  { value: "Call Cut", label: "Call Cut" },
  { value: "Booked", label: "Booked" },
  { value: "Not Interested", label: "Not Interested" },
  { value: "Switched Off", label: "Switched Off" },
  { value: "Site Visit", label: "Site Visit" }
   ];


  /* ================= FETCH ================= */
  const fetchLeads = useCallback(async () => {
    console.log("FILTERS SENT =", filters);
    try {
      const res = await axios.post(`${API}/filter-leads`, {
        email: user.email,
        role: user.role,
        page,
        filters,
        search
      });

      setLeads(res.data.data || []);
      console.log(res.data.data);
      setTotalPages(res.data.totalPages || 1);

      setStatsData({
  totalLeads: res.data.totalLeads || 0,
  hotLeads: res.data.hotLeads || 0,
  newLeads: res.data.newLeads || 0,
  bookedLeads: res.data.bookedLeads || 0,
  inactiveLeads: res.data.inactiveLeads || 0,
  todayFollowups: res.data.todayFollowups || 0,
  backlog: res.data.backlog || 0
});


setTotalLeadsCount(
  res.data.totalLeads || 0
);


    } catch (err) {
      console.error("Fetch Leads Error:", err);
      setLeads([]);
    }
}, [user, page, filters, search]);

  useEffect(() => {
  fetchLeads();
 
  const fetchProjects = async () => {
  try {
    const res = await axios.get(
      "https://calling-crm-backend-7w52.onrender.com/api/projects"
    );

    setProjects(res.data.data || []);

  } catch (err) {

    console.log("Projects Error", err);

  }
};


fetchProjects();

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No Token Found");
    return;
  }

 axios
  .get(`${API}/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    console.log("ALL USERS =", res.data);
    console.log("TOTAL USERS =", res.data.length);

    setUsers(Array.isArray(res.data) ? res.data : []);
  })
  .catch((err) => {
    console.log("ERROR =", err.response?.data || err.message);
  });

}, [fetchLeads]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete permanently?",
      icon: "warning",
      showCancelButton: true
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/delete-lead/${id}`);
      toast.success("Deleted ✅");
      fetchLeads();
    } catch (err) {
  console.log(err);

  if (err.response) {
    console.log(err.response.data);
  }

  toast.error("Delete Failed ❌");
}
  };
    
  const handleSelectLead = (id) => {

  setSelectedLeads((prev) => {

    if (prev.includes(id)) {
      return prev.filter((x) => x !== id);
    }

    return [...prev, id];

  });

       };  

       const handleMultipleDelete = async () => {

  if (selectedLeads.length === 0) {

    toast.error("Select Leads First ❌");

    return;

  }

  const result = await Swal.fire({
    title: `Delete ${selectedLeads.length} Leads ?`,
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
  });

  if (!result.isConfirmed) return;

  try {

    await axios.post(
      `${API}/delete-multiple-leads`,
      {
        ids: selectedLeads
      }
    );

    toast.success("Leads Deleted Successfully ✅");

    setSelectedLeads([]);

    fetchLeads();

  } catch (err) {

  console.log(err);

  if (err.response) {
    console.log(err.response.data);
  }

  toast.error("Delete Failed ❌");
}
};

  /* ================= UPDATE ================= */
 const handleUpdate = async () => {

  const selectedUser = users.find(
    (u) => u.email === selectedLead.assigned_to
  );

  selectedLead.assigned_to_email =
    selectedUser?.email || "";

  try {

    await axios.put(
      `${API}/update-lead/${selectedLead._id}`,
      selectedLead
    );

    toast.success("Updated Successfully ✅");
    setShowModal(false);
    fetchLeads();

  } catch {

    toast.error("Update Failed ❌");

  }
};

  /* ================= SEARCH ================= */
  const filteredLeads = leads;


    /* ================= EXPORT EXCEL ================= */

  const handleExport = () => {

    if (filteredLeads.length === 0) {

      toast.error("No Leads To Export ❌");

      return;

    }

   const handleExport = async () => {
  try {
    const res = await axios.post(
      `${API}/export-leads`,
      {
        email: user.email,
        role: user.role,
        filters,
        search,
      }
    );

    const exportData = res.data.map((l) => ({
      Name: l.name,
      Mobile: l.phone,
      Status: l.status,
      Project: l.project,
      Assigned: l.assigned_to,
      "Closing Officer": l.assigned_manager || "-",
      "Created Date": l.createdAt
        ? new Date(l.createdAt).toLocaleDateString("en-GB")
        : "-",
      "Next Call": l.next_call_date
        ? new Date(l.next_call_date).toLocaleDateString("en-GB")
        : "-",
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Pipeline"
    );

    XLSX.writeFile(
      workbook,
      "Pipeline_Leads.xlsx"
    );

    toast.success("Excel Exported ✅");
  } catch (err) {
    console.log(err);
    toast.error("Export Failed ❌");
  }}
};
  /* ================= CARDS ================= */

const stats = {
  totalLeads: statsData.totalLeads,
  todayFollowups: statsData.todayFollowups,
  backlog: statsData.backlog,
  hot: statsData.hotLeads,
  newLeads: statsData.newLeads,
  booked: statsData.bookedLeads,
  inactive: statsData.inactiveLeads
};

  return (
    <div className="d-flex">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
  style={{
    marginLeft: isOpen ? "240px" : "70px",
    marginTop: "60px",
    width: "100%",
    padding: "20px",

    /* 🔥 SCROLL FIX */
    height: "calc(100vh - 60px)",
    overflowY: "auto",
    overflowX: "hidden",
  }}
>

        <h4>Pipeline</h4>
   <h6 className="total-count">
  Total Leads: {totalLeadsCount}
</h6>
        {/* 🔥 CARDS */}
       <div className="stats-wrapper"
  style={{
    display: "flex",
    gap: "15px",
    flexWrap: "nowrap",
    overflowX: "auto",
  }}
>
          {[
  { title: "Total Leads", value: stats.totalLeads, color: "#007bff" },

  { title: "Today's Follow-ups", value: stats.todayFollowups, color: "#007bff" },

  { title: "Backlogs", value: stats.backlog, color: "#007bff" },

  { title: "Hot Leads", value: stats.hot, color: "#007bff" },

  { title: "New Leads", value: stats.newLeads, color: "#17a2b8" },

  { title: "Booked Leads", value: stats.booked, color: "#28a745" },

  { title: "Inactive Leads", value: stats.inactive, color: "#ffc107" },
].map((card, i) => (

<div
  className="stats-card"
  key={card.title}
  style={{
    background: card.color,
    flex: "1",
    minWidth: "170px",
  }}
>         

 <div className="card text-white shadow-sm"
                style={{ background: card.color, borderRadius: "10px", padding: "10px" }}>
                <div className="text-center">
                  <h6 style={{ fontSize: "13px" }}>{card.title}</h6>
                  <h4>{card.value}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
       <div className="card search-card mb-3">
            <input
            className="form-control"
            placeholder="Search leads..."
            value={search}
onChange={(e) => {
  setSearch(e.target.value);
  setPage(1);
}}          />
        </div>

 {showAdvancedSearch && (

<div className="advanced-search-card">

  <div className="row g-2">




    {/* STATUS */}

    <div className="col-md-2">

     <Select
  isMulti
  options={statusOptions}
  closeMenuOnSelect={false}
  value={filters.status}
  onChange={(selected) =>
    setFilters({
      ...filters,
      status: selected || []
    })
  }
  placeholder="Select Status"
/>

    </div>


    {/* ASSIGNED TO */}

    <div className="col-md-2">

   <select
  className="form-select"
  value={filters.assigned}
  onChange={(e) =>
    setFilters({
      ...filters,
      assigned: e.target.value,
    })
  }
>
  <option value="">Assigned To</option>

  {users
    .filter(
      (u) => u.role?.trim().toLowerCase() === "executive"
    )
    .map((u) => (
      <option
        key={u._id}
        value={u.email}   // Backend साठी Email
      >
        {u.name}          {/* User ला फक्त Name दिसेल */}
      </option>
    ))}
</select>

    </div>

    {/* CLOSING EXECUTIVE */}

    <div className="col-md-2">

      <select
        className="form-select"
        value={filters.closingExecutive}
        onChange={(e) =>
          setFilters({
            ...filters,
            closingExecutive: e.target.value
          })
        }
      >

        <option value="">
          Closing Executive
        </option>

        {closingExecutives.map((u, i) => (

          <option
            key={i}
            value={u}
          >
            {u}
          </option>

        ))}

      </select>

    </div>

    {/* PROJECT */}

    <div className="col-md-2">

      <select
        className="form-select"
        value={filters.project}
        onChange={(e) =>
          setFilters({
            ...filters,
            project: e.target.value
          })
        }
      >

      <option value="">
  All Projects
</option>

{projects.map((project) => (
  <option
    key={project._id}
    value={project.name}
  >
    {project.name}
  </option>
))}
      </select>

    </div>

    {/* CREATED DATE FROM */}

    <div className="col-md-2">

      <input
        type="date"
        className="form-control"
        value={filters.createdFrom}
        onChange={(e) =>
          setFilters({
            ...filters,
            createdFrom: e.target.value
          })
        }
      />

    </div>

    {/* CREATED DATE TO */}

    <div className="col-md-2">

      <input
        type="date"
        className="form-control"
        value={filters.createdTo}
        onChange={(e) =>
          setFilters({
            ...filters,
            createdTo: e.target.value
          })
        }
      />

    </div>

    {/* RESET */}

    <div className="col-md-2">

      <button
        className="btn btn-secondary w-100"
        onClick={() =>
          setFilters({
         status: [],
            assigned: "",
            closingExecutive: "",
            project: "",
            createdFrom: "",
            createdTo: ""
          })
        }
      >
        Reset
      </button>

    </div>

  </div>

</div>

)}

        {/* TABLE */}
       <div className="table-card">    
  <div className="d-flex justify-content-between align-items-center mb-3">
<button
  className="btn btn-dark me-2"
  onClick={() =>
    setShowAdvancedSearch(!showAdvancedSearch)
  }
>

  Advanced Search
</button>
  <h5>Leads List</h5>

  <div className="d-flex">

    <button
      className="btn btn-primary"
      onClick={() => {
        console.log("New Lead Clicked");
      }}
    >
      + New Lead
    </button>

    <button
      className="btn btn-success ms-2"
      onClick={handleExport}
    >
      Export Excel
    </button>

    {user.role === "admin" && (
      <button
        className="btn btn-danger ms-2"
        onClick={handleMultipleDelete}
      >
        Delete Selected
      </button>
    )}

  </div>

</div>

            
          <table className="table table-hover">
            <thead className="table-dark">
  <tr>

    {user.role === "admin" && (
      <th>

        <input
          type="checkbox"

          checked={
            filteredLeads.length > 0 &&
            selectedLeads.length === filteredLeads.length
          }

          onChange={(e) => {

            if (e.target.checked) {

              setSelectedLeads(
                filteredLeads.map((l) => l._id)
              );

            } else {

              setSelectedLeads([]);

            }

          }}
        />

      </th>
    )}

                <th>Name</th>
                <th>Mobile</th>
                <th>Assigned</th>
                <th>Closing Officer</th>

                <th>Status</th>
                <th>Project</th>
                 <th>Remark</th>
                <th>Created Date</th>
                <th>Next Call</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((l) => (
<tr key={l._id}>

  {user.role === "admin" && (
    <td>

      <input
        type="checkbox"

        checked={selectedLeads.includes(l._id)}

        onChange={() =>
          handleSelectLead(l._id)
        }
      />

    </td>
  )}                    <td>{l.name}</td>
                    <td>{l.phone}</td>
                    
    
     <td>{l.assigned_to || "-"}</td>

     <td>
  <span className="badge bg-dark">
    {l.assigned_manager || "-"}
  </span>
</td>

<td>
  <span className="badge bg-info">
    {l.status}
  </span>
</td>

     <td>{l.project || "-"}</td>


<td>
  {l.remark ||
   l.description ||
   (l.followups?.length > 0
     ? l.followups[l.followups.length - 1].note
     : "-")}
</td>

<td>
  {l.createdAt
    ? new Date(l.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      })
    : "-"}
</td>

<td>
  {l.next_call_date
    ? new Date(l.next_call_date)
        .toLocaleDateString("en-GB")
    : "-"}
</td>

                  <td>

  <div
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center"
    }}
  >

    {/* CALL */}

    <a
      href={`tel:${l.phone}`}
      className="action-icon call-icon"
      title="Call"
    >
      <Phone size={18} />
    </a>

    {/* EDIT */}

    <button
      className="action-icon edit-icon"

      title="Edit"

      onClick={() => {

        setSelectedLead({ ...l });

        setShowModal(true);

      }}
    >

      <Pencil size={18} />
    </button>

    {/* DELETE */}

    <button
      className="action-icon delete-icon"

      title="Delete"

      onClick={() =>
        handleDelete(l._id)
      }
    >
      <Trash2 size={18} />
    </button>

  </div>

</td>
                  </tr>
                ))
              ) : (
                <tr>
          <td colSpan="13" className="text-center">
                      ❌ No Leads Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
        <div className="pagination-wrapper d-flex justify-content-between">
            <button className="btn btn-outline-primary"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}>
              Prev
            </button>

            <span>Page {page} / {totalPages}</span>

            <button className="btn btn-outline-primary"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      {showModal && selectedLead && (
        <div className="modal fade show d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit Lead</h5>

              <input className="form-control mb-2"
                value={selectedLead.name}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, name: e.target.value })
                } />

              <input className="form-control mb-2"
                value={selectedLead.phone}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, phone: e.target.value })
                } />

<textarea
  className="form-control mb-2"
  rows="3"
  placeholder="Remark"
  value={selectedLead.remark || ""}
  onChange={(e) =>
    setSelectedLead({
      ...selectedLead,
      remark: e.target.value
    })
  }
/>

               <select
  className="form-select mb-2"
  value={selectedLead.assigned_to || ""}
  onChange={(e) =>
    setSelectedLead({
      ...selectedLead,
      assigned_to: e.target.value
    })
  }
>
  <option value="">
    Select Executive
  </option>

  {users
    .filter((u) => u.role === "executive")
    .map((u) => (
      <option
        key={u._id}
        value={u.email}
      >
        {u.name}
      </option>
    ))}
</select>


              <select className="form-select mb-2"
                value={selectedLead.status}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, status: e.target.value })
                }>
                <option>New</option>
                <option>Interested</option>
                <option>Booked</option>
                <option>Not Interested</option>
              </select>

              <input type="date" className="form-control mb-3"
value={
  selectedLead.next_call_date
    ? new Date(selectedLead.next_call_date)
        .toISOString()
        .split("T")[0]
    : ""
}                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, next_call_date: e.target.value })
                } />

              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </button>

                <button className="btn btn-success"
                  onClick={handleUpdate}>
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
