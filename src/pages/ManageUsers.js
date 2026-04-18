import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

/* ✅ FIX */
const API = "http://localhost:5000/api";

export default function ManageUsers() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/all-users`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("❌ Cannot fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await axios.delete(`${API}/delete-user/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (user) => {
    setEditUser(user);
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/update-user/${editUser.id}`, editUser);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        style={{
          marginLeft: isOpen ? "240px" : "70px",
          marginTop: "60px",
          padding: "20px",
          width: "100%",
        }}
      >
        <h4>Manage Users</h4>

        <div className="card p-3 mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th width="150">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Users Found
                  </td>
                </tr>
              )}

              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-primary me-1"
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔥 EDIT MODAL */}
        {editUser && (
          <div className="modal d-block" style={{ background: "#00000088" }}>
            <div className="modal-dialog">
              <div className="modal-content p-3">

                <h5>Edit User</h5>

                <input
                  type="text"
                  name="name"
                  className="form-control mb-2"
                  value={editUser.name}
                  onChange={handleEditChange}
                />

                <input
                  type="email"
                  name="email"
                  className="form-control mb-2"
                  value={editUser.email}
                  onChange={handleEditChange}
                />

                <select
                  name="role"
                  className="form-select mb-3"
                  value={editUser.role}
                  onChange={handleEditChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setEditUser(null)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}