import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
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

  // 🔥 FILTER STATE
  const [filters, setFilters] = useState({
  status: "",
  assigned: "",
  closingExecutive: "",
  project: "",
  createdFrom: "",
  createdTo: ""
});
 
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

   const assignedUsers = [
  ...new Set(
    leads
      .map((l) => l.assigned_to)
      .filter(Boolean)
  )
];

const closingExecutives = [
  ...new Set(
    leads
      .map((l) => l.assigned_manager)
      .filter(Boolean)
  )
];
  /* ================= FETCH ================= */
  const fetchLeads = useCallback(async () => {
    try {
      const res = await axios.post(`${API}/filter-leads`, {
        email: user.email,
        role: user.role,
        page,
        filters
      });

      setLeads(res.data.data || []);
      console.log(res.data.data);
      setTotalPages(res.data.totalPages || 1);
      setTotalLeadsCount(res.data.total || 0);

    } catch (err) {
      console.error("Fetch Leads Error:", err);
      setLeads([]);
    }
  }, [user, page, filters]);

  useEffect(() => {
    fetchLeads();

    axios.get(`${API}/all-users`)
      .then(res => setUsers(res.data || []));
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
    } catch {
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

    toast.error("Delete Failed ❌");

  }

};

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/update-lead/${selectedLead._id}`, selectedLead);
      toast.success("Updated Successfully ✅");
      setShowModal(false);
      fetchLeads();
    } catch {
      toast.error("Update Failed ❌");
    }
  };

  /* ================= SEARCH ================= */
  const filteredLeads = useMemo(() => {
    return leads.filter((l) =>
      `${l.name} ${l.phone} ${l.status} ${l.project} ${l.assigned_to}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, leads]);


    /* ================= EXPORT EXCEL ================= */

  const handleExport = () => {

    if (filteredLeads.length === 0) {

      toast.error("No Leads To Export ❌");

      return;

    }

    const exportData = filteredLeads.map((l) => ({

      Name: l.name,

      Mobile: l.phone,

      Status: l.status,

      Project: l.project,
    "Created Date": l.createdAt
  ? new Date(l.createdAt).toLocaleDateString("en-GB")
  : "-",


      Assigned: l.assigned_to,
      "Closing Officer": l.assigned_manager || "-",

      "Next Call": l.next_call_date
  ? new Date(l.next_call_date)
      .toLocaleDateString("en-GB")
  : "-"

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

  };

  /* ================= CARDS ================= */
  const stats = useMemo(() => {

  let totalLeads = totalLeadsCount;
  let todayFollowups = 0;
  let backlog = 0;
  let hot = 0;
  let newLeads = 0;
  let booked = 0;
  let inactive = 0;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  leads.forEach((l) => {

    const nextCall = l.next_call_date
      ? new Date(l.next_call_date)
          .toISOString()
          .split("T")[0]
      : "";

    if (nextCall === today)
      todayFollowups++;

    if (!l.next_call_date)
      backlog++;

    if (l.status === "Interested")
      hot++;

    if (l.status === "New")
      newLeads++;

    if (l.status === "Booked")
      booked++;

    if (l.status === "Not Interested")
      inactive++;

  });

  return {

    totalLeads,

    todayFollowups,

    backlog,

    hot,

    newLeads,

    booked,

    inactive

  };

}, [leads]);


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

        {/* 🔥 CARDS */}
       <div
  className="mb-4"
  style={{
    display: "flex",
    gap: "15px",
    flexWrap: "nowrap",
    overflowX: "auto",
  }}
>
          {[
  { title: "Total Leads", value: stats.totalLeads, color: "#343a40" },

  { title: "Today's Follow-ups", value: stats.todayFollowups, color: "#007bff" },

  { title: "Backlogs", value: stats.backlog, color: "#6c757d" },

  { title: "Hot Leads", value: stats.hot, color: "#dc3545" },

  { title: "New Leads", value: stats.newLeads, color: "#17a2b8" },

  { title: "Booked Leads", value: stats.booked, color: "#28a745" },

  { title: "Inactive Leads", value: stats.inactive, color: "#ffc107" },
].map((card, i) => (
<div
  className="mb-3"
  key={card.title}
  style={{
    flex: "1",
    minWidth: "170px",
  }}
>              <div className="card text-white shadow-sm"
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
        <div className="card p-2 mb-3 shadow-sm">
          <input
            className="form-control"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


{/* ADVANCED SEARCH */}
  {showAdvancedSearch && (

<div className="card p-3 mb-3 shadow-sm">

  <div className="row g-2">

    {/* STATUS */}

    <div className="col-md-2">

      <select
        className="form-select"
        value={filters.status}
        onChange={(e) =>
          setFilters({
            ...filters,
            status: e.target.value
          })
        }
      >

        <option value="">
          All Status
        </option>

        <option>New</option>
        <option>Interested</option>
        <option>Ringing</option>
        <option>Booked</option>
        <option>Not Interested</option>
        <option>Switch Off</option>
        <option>Site Visit</option>


      </select>

    </div>

    {/* ASSIGNED TO */}

    <div className="col-md-2">

      <select
        className="form-select"
        value={filters.assigned}
        onChange={(e) =>
          setFilters({
            ...filters,
            assigned: e.target.value
          })
        }
      >

        <option value="">
          Assigned To
        </option>

        {assignedUsers.map((u, i) => (

          <option
            key={i}
            value={u}
          >
            {u}
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

    <option value="99villa">
      99villa
    </option>

    <option value="99 villa plot">
      99 villa plot
    </option>

    <option value="Affordable life">
      Affordable life
    </option>

    <option value="Alibaug Plot">
      Alibaug Plot
    </option>

    <option value="ANJALI ZAMIN">
      ANJALI ZAMIN
    </option>

    <option value="Gudipadwa plot in 5 Lacs">
      Gudipadwa plot in 5 Lacs
    </option>

    <option value="Khopoli-pali Road plots">
      Khopoli-pali Road plots
    </option>

    <option value="Maha-Mumbaai">
      Maha-Mumbaai
    </option>

    <option value="MAHAMUMBAI">
      MAHAMUMBAI
    </option>

    <option value="Maha-Mumbaii">
      Maha-Mumbaii
    </option>

    <option value="Mahamumbai Phase 2">
      Mahamumbai Phase 2
    </option>

    <option value="Mmahamumbai">
      Mmahamumbai
    </option>

    <option value="Panvel (99Villa)">
      Panvel (99Villa)
    </option>

    <option value="Sheetal Campaign">
      Sheetal Campaign
    </option>

    <option value="Thane (Nitesh)">
      Thane (Nitesh)
    </option>

    <option value="Thane (Virendra)">
      Thane (Virendra)
    </option>


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
            status: "",
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
        <div className="card p-3 shadow-sm">     
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
  {l.createdAt
    ? new Date(l.createdAt)
        .toLocaleDateString("en-GB")
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
          <td colSpan="11" className="text-center">
                      ❌ No Leads Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between mt-3">
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
