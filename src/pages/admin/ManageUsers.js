import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

/* ✅ FIX */
const API = "https://calling-crm-backend-7w52.onrender.com/api";

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

      await axios.put(
  `${API}/update-user/${editUser._id}`,
  editUser
);

if (
  editUser.newPassword &&
  editUser.newPassword.length < 8
) {
  alert(
    "Password must be minimum 8 characters"
  );
  return;
}


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
                <th>Birth Date</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Activity</th>
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

              {
             users.map((u) => (
               <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>
  {u.birth_date
    ? new Date(u.birth_date)
        .toLocaleDateString("en-GB")
    : "-"}
</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                   <td>
  {u.passwordChangedAt
    ? new Date(u.passwordChangedAt)
        .toLocaleString("en-GB")
    : "-"}
</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-1"
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(u._id)}                    >
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
               
               <input
  type="date"
  name="birth_date"
  className="form-control mb-2"
  value={
    editUser.birth_date
      ? new Date(editUser.birth_date)
          .toISOString()
          .split("T")[0]
      : ""
  }
  onChange={handleEditChange}
/>

<input
  type="password"
  name="newPassword"
  className="form-control mb-2"
  placeholder="New Password (min 8 chars)"
  value={editUser.newPassword || ""}
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