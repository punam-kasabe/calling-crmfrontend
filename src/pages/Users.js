import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Users() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  /* ================= GET USERS ================= */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/all-users`);

      console.log("API DATA:", res.data); // 🔥 DEBUG

      setUsers(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Fetch Users Error:", err);
      alert("❌ Cannot fetch users (Check backend)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ADD USER ================= */
  const addUser = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields required ❌");
      return;
    }

    try {
      await axios.post(`${API}/add-user`, form);

      alert("User Added ✅");

      setShowForm(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });

      fetchUsers();

    } catch (err) {
      console.error("Add User Error:", err);
      alert("❌ Error adding user");
    }
  };

  /* ================= DELETE ================= */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await axios.delete(`${API}/delete-user/${id}`);
      alert("Deleted ✅");
      fetchUsers();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="d-flex">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div style={{
        marginLeft: isOpen ? "240px" : "70px",
        marginTop: "60px",
        width: "100%",
        padding: "20px"
      }}>

        <h4>User Management</h4>

        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowForm(true)}
        >
          + Add User
        </button>

        {loading && <p>Loading...</p>}

        {/* FORM */}
        {showForm && (
          <div className="card p-3 mb-3 shadow">
            <input className="form-control mb-2"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input className="form-control mb-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input className="form-control mb-2"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input type="password"
              className="form-control mb-2"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select className="form-control mb-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button className="btn btn-success me-2" onClick={addUser}>
              Save
            </button>

            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        )}

        {/* TABLE */}
        <table className="table table-bordered bg-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center">No Users</td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>
                <td>{u.role}</td>
                <td>{u.created_at || "-"}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}