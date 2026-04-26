import Sidebar from "../components/Sidebar";
import "../styles/leads.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

export default function Leads() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user"))?.user || {};
  }, []);

  const [file, setFile] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

  /* 🔥 PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  /* 🔥 MODALS */
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    project: "",
    assigned_to: "",
  });

  /* ================= FETCH ================= */
  const fetchData = useCallback(() => {

    if (!user?.email || !user?.role) return;

    axios.get(`https://calling-crm-backend-1.onrender.com/dashboard/${user.email}/${user.role}`)
      .then(res => setStats(res.data));

    axios.post("https://calling-crm-backend-1.onrender.com/filter-leads", {
      email: user.email.trim().toLowerCase(),
      role: user.role,
    })
    .then(res => setLeads(res.data));

  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    axios.get("https://calling-crm-backend-1.onrender.com/users")
      .then(res => setUsers(res.data));
  }, []);

  /* ================= CSV ================= */
  const handleUpload = async () => {
    if (!file || !selectedUser) return alert("Select file & user");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assigned_to", selectedUser.trim().toLowerCase());
    formData.append("created_by", user.email);

    await axios.post("https://calling-crm-backend-1.onrender.com/upload", formData);

    alert("Uploaded ✅");
    fetchData();
  };

  /* ================= ADD ================= */
  const handleAddLead = async () => {
    try {
      await axios.post("http://localhost:5000/leads", {
        ...newLead,
        assigned_to: newLead.assigned_to.trim().toLowerCase(),
        created_by: user.email
      });

      alert("Lead Added ✅");
      setShowAddModal(false);
      fetchData();

    } catch {
      alert("Error ❌");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/leads/${selectedLead.id}`, selectedLead);

      alert("Updated ✅");
      setShowModal(false);
      fetchData();

    } catch {
      alert("Update Failed ❌");
    }
  };

  /* ================= STATUS ================= */
  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/leads/status/${id}`, { status })
      .then(fetchData);
  };

  /* ================= SEARCH ================= */
  const filtered = leads.filter(l =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search)
  );

  /* 🔥 PAGINATION LOGIC */
  const indexOfLast = currentPage * itemsPerPage;
  const currentLeads = filtered.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="d-flex">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div style={{
        marginLeft: isOpen ? "240px" : "0px",
        marginTop: "60px",
        width: "100%",
        background: "#f5f7fb"
      }}>

        {/* HEADER */}
        <div className="p-3 bg-white border-bottom">
          <h4>Lead Management</h4>

          {(user.role === "admin" || user.role === "superadmin") && (
            <div className="d-flex gap-2 mt-2">

              <select className="form-select" style={{ width: "200px" }}
                onChange={(e) => setSelectedUser(e.target.value)}>
                <option>Select User</option>
                {users.map(u => (
                  <option key={u.email}>{u.email}</option>
                ))}
              </select>

              <input type="file" accept=".csv"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button className="btn btn-primary" onClick={handleUpload}>
                Upload CSV
              </button>
            </div>
          )}

          <button className="btn btn-success mt-2"
            onClick={() => setShowAddModal(true)}>
            ➕ Add Lead
          </button>

          <input type="text" placeholder="Search"
            className="form-control mt-3"
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* CARDS */}
        <div className="d-flex gap-3 p-3">
          <Card title="New" value={stats.new || 0} color="success" />
          <Card title="Booked" value={stats.completed || 0} color="primary" />
          <Card title="Pending" value={stats.pending || 0} color="warning" />
        </div>

        {/* TABLE */}
        <div className="p-3">
          <table className="table bg-white">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Assigned</th>
                <th>Status</th>
                <th>Project</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No Leads</td>
                </tr>
              ) : (
                currentLeads.map(l => (
                  <tr key={l.id}>
                    <td>{l.name}</td>
                    <td>{l.phone}</td>
                    <td>{l.assigned_to}</td>

                    <td>
                      <select value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}>
                        <option>New</option>
                        <option>Interested</option>
                        <option>Not Interested</option>
                        <option>Booked</option>
                      </select>
                    </td>

                    <td>{l.project || "-"}</td>

                    <td>
                      <button className="btn btn-sm btn-primary"
                        onClick={() => {
                          setSelectedLead(l);
                          setShowModal(true);
                        }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 🔥 PAGINATION UI */}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <span>Page {currentPage} / {totalPages || 1}</span>

            <button
              className="btn btn-secondary"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>

        </div>

      </div>

      {/* EDIT MODAL */}
      {showModal && selectedLead && (
        <div className="modal d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Edit Lead</h5>

              <input className="form-control mt-2"
                value={selectedLead.name}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, name: e.target.value })}
              />

              <input className="form-control mt-2"
                value={selectedLead.phone}
                onChange={(e) =>
                  setSelectedLead({ ...selectedLead, phone: e.target.value })}
              />

              <button className="btn btn-primary mt-3"
                onClick={handleUpdate}>
                Save
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Add Lead</h5>

              <input placeholder="Name" className="form-control mt-2"
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />

              <input placeholder="Phone" className="form-control mt-2"
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              />

              <select className="form-select mt-2"
                onChange={(e) => setNewLead({ ...newLead, assigned_to: e.target.value })}>
                <option>Select User</option>
                {users.map(u => (
                  <option key={u.email}>{u.email}</option>
                ))}
              </select>

              <button className="btn btn-success mt-3"
                onClick={handleAddLead}>
                Save
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* CARD */
function Card({ title, value, color }) {
  return (
    <div className={`card p-3 text-center bg-${color} text-white`}>
      <h6>{title}</h6>
      <h4>{value}</h4>
    </div>
  );
}