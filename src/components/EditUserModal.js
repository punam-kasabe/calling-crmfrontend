import { useState, useEffect } from "react";

export default function EditUserModal({ show, onClose, userData, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });

  // 🔄 Load selected user data
  useEffect(() => {
    if (userData) {
      setForm(userData);
    }
  }, [userData]);

  if (!show) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* HEADER */}
        <div className="modal-header">
          <h5>Edit User</h5>
          <button onClick={onClose}>✖</button>
        </div>

        {/* BODY */}
        <div className="modal-body">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>

        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn save" onClick={handleSubmit}>
            💾 Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}