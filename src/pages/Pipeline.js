import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "../styles/pipeline.css";

const API = "https://calling-crm-backend-1.onrender.com/api";

export default function Pipeline() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // 🔥 FILTER STATE
  const [filters, setFilters] = useState({
    status: "",
    assigned: "",
    project: "",
    date: "",
    from: "",
    to: ""
  });

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

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
      setTotalPages(res.data.totalPages || 1);

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

  /* ================= CARDS ================= */
  const stats = useMemo(() => {
    let todayFollowups = 0;
    let backlog = 0;
    let hot = 0;
    let newLeads = 0;
    let booked = 0;
    let inactive = 0;

    const today = new Date().toISOString().split("T")[0];

    leads.forEach((l) => {
      if (l.next_call_date === today) todayFollowups++;
      if (!l.next_call_date) backlog++;

      if (l.status === "Interested") hot++;
      if (l.status === "New") newLeads++;
      if (l.status === "Booked") booked++;
      if (l.status === "Not Interested") inactive++;
    });

    return {
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

      <div style={{
        marginLeft: isOpen ? "240px" : "70px",
        marginTop: "60px",
        width: "100%",
        padding: "20px"
      }}>

        <h4>Pipeline</h4>

        {/* 🔥 CARDS */}
        <div className="row mb-4">
          {[
            { title: "Today's Follow-ups", value: stats.todayFollowups, color: "#007bff" },
            { title: "Backlogs", value: stats.backlog, color: "#6c757d" },
            { title: "Hot Leads", value: stats.hot, color: "#dc3545" },
            { title: "New Leads", value: stats.newLeads, color: "#17a2b8" },
            { title: "Booked Leads", value: stats.booked, color: "#28a745" },
            { title: "Inactive Leads", value: stats.inactive, color: "#ffc107" },
          ].map((card, i) => (
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-3" key={card.title}>
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

        {/* 🔥 FILTER BAR */}
        <div className="card p-3 mb-3 shadow-sm">
          <div className="row g-2">

            <div className="col-md-2">
              <select className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }>
                <option value="">Status</option>
                <option>New</option>
                <option>Interested</option>
                <option>Pending</option>
                <option>Booked</option>
                <option>Not Interested</option>
              </select>
            </div>

            <div className="col-md-2">
              <select className="form-select"
                value={filters.assigned}
                onChange={(e) =>
                  setFilters({ ...filters, assigned: e.target.value })
                }>
                <option value="">Assigned</option>
                {users.map(u => (
                  <option key={u._id} value={u.email}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input className="form-control"
                placeholder="Project"
                value={filters.project}
                onChange={(e) =>
                  setFilters({ ...filters, project: e.target.value })
                } />
            </div>

            <div className="col-md-2">
              <select className="form-select"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }>
                <option value="">Date</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {filters.date === "custom" && (
              <>
                <div className="col-md-2">
                  <input type="date" className="form-control"
                    value={filters.from}
                    onChange={(e) =>
                      setFilters({ ...filters, from: e.target.value })
                    } />
                </div>

                <div className="col-md-2">
                  <input type="date" className="form-control"
                    value={filters.to}
                    onChange={(e) =>
                      setFilters({ ...filters, to: e.target.value })
                    } />
                </div>
              </>
            )}

            <div className="col-md-2">
              <button className="btn btn-secondary w-100"
                onClick={() => setFilters({
                  status: "",
                  assigned: "",
                  project: "",
                  date: "",
                  from: "",
                  to: ""
                })}>
                Reset
              </button>
            </div>

          </div>
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

        {/* TABLE */}
        <div className="card p-3 shadow-sm">
          <h5>Leads List</h5>

           {/* 🔥 HEADER WITH BUTTON */}
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5>Leads List</h5>

    <button
      className="btn btn-primary"
      onClick={() => {
        console.log("New Lead Clicked");
      }}
    >
      + New Lead
    </button>
            </div>
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Call</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Project</th>
                <th>Next Call</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((l) => (
                    <tr key={l._id}>
                    <td>{l.name}</td>
                    <td>{l.phone}</td>
                    <td>{l.assigned_to}</td>
                    <td>
  <a href={`tel:${l.phone}`} className="btn btn-success btn-sm">
    Call
  </a>
</td>
                    <td><span className="badge bg-info">{l.status}</span></td>
                    <td>{l.project || "-"}</td>
                    <td>{l.next_call_date || "-"}</td>

                    <td>
                      <button className="btn btn-sm btn-warning me-2"
                        onClick={() => {
                          setSelectedLead({ ...l });
                          setShowModal(true);
                        }}>
                        Edit
                      </button>

                      <button className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(l._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
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
                value={selectedLead.next_call_date || ""}
                onChange={(e) =>
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
