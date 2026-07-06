// FILE: src/pages/reception/CreateVisit.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import "../../styles/createvisit.css";

export default function CreateVisit() {

  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // 🔥 NEW

  // 🔥 STATIC EXECUTIVE LIST
  const executivesList = [
    "Vrushali",
    "Manisha",
    "Jyoti",
    "Nirali",
    "Shirisha",
    "Rakhi",
    "Harsh",
    "Patham",
    "Siddhesh",
    "Harsh",
    "Yash",
    "Chaitanya",
    "Avdhut"
  ];

  const [form, setForm] = useState({
    clientName: "",
    mobile: "",
    project: "",
    attendedManager: "",
    visitStatus: "IN_OFFICE",
    bookingStatus: "PENDING",
    calling_by: [],
    remark: "",
    status: "New",
    clientType: "New",
    department: "",
    source: "",
    assigned_to: ""
  });

  useEffect(() => {
  fetchManagers();
  fetchUsers();
}, []);

  const fetchUsers = async () => {
  try {

    const res = await axios.get(
      "https://calling-crm-backend-7w52.onrender.com/api/all-users",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setUsers(res.data || []);

  } catch (err) {
    console.log(err);
  }
};

  // ================= FETCH MANAGERS =================
  const fetchManagers = async () => {
    try {
      const res = await axios.get(
        "https://calling-crm-backend-7w52.onrender.com/api/managers"
      );
      setManagers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ================= MULTI SELECT =================
  const handleCheckboxChange = (name) => {
    setForm((prev) => {
      const exists = prev.calling_by.includes(name);

      if (exists) {
        return {
          ...prev,
          calling_by: prev.calling_by.filter((x) => x !== name)
        };
      } else {
        return {
          ...prev,
          calling_by: [...prev.calling_by, name]
        };
      }
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedManager = managers.find(
        (m) => m._id === form.attendedManager
      );

      await axios.post(
        "https://calling-crm-backend-7w52.onrender.com/api/create-visit",
        {
          ...form,
          assigned_manager: selectedManager?.email || ""
        }
      );

      alert("Visit Created Successfully ✅");

      setForm({
        clientName: "",
        mobile: "",
        project: "",
        attendedManager: "",
        visitStatus: "IN_OFFICE",
        bookingStatus: "PENDING",
        calling_by: [],
        remark: "",
        status: "New",
        clientType: "NEW"
      });

    } catch (err) {
      console.log(err);
      alert("Error creating visit ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <div className="create-visit-page">
          <div className="create-visit-card">

            <div className="visit-header">
              <h1>Create Visit</h1>
              <p>Add new client visit details</p>
            </div>

            <form
              className="create-visit-form"
              onSubmit={handleSubmit}
            >

              {/* CLIENT */}
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* MOBILE */}
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

               {/* CLIENT TYPE */}

<div className="form-group">

  <label>Client Type</label>

  <select
    name="clientType"
    value={form.clientType}
    onChange={handleChange}
  >
    <option value="New">New Client</option>
    <option value="Old">Old Client</option>
  </select>

</div>

              {/* PROJECT */}
              <div className="form-group">
                <label>Project Name</label>
                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Project</option>
                  <option value="99villa">99villa</option>
                  <option value="Karjat">Karjat</option>
                  <option value="Alibaug Plot">Alibaug</option>
                  <option value="Pen">Pen</option>
                  <option value="MahaMumbai">MahaMumbai</option>
                </select>
              </div>


              <div className="form-group">
  <label>Department</label>

  <select
    name="department"
    value={form.department}
    onChange={handleChange}
  >
    <option value="">Select Department</option>

    <option value="Sales & Marketing">
      Sales & Marketing
    </option>

    <option value="HR/Admin">
      HR/Admin
    </option>

    <option value="TeleCaller">
      TeleCaller
    </option>

    <option value="Aasma Ma'am">
      Aasma Ma'am
    </option>

    <option value="Nilesh Sir">
      Nilesh Sir
    </option>

  </select>
</div>

<div className="form-group">
  <label>Source</label>

  <select
    name="source"
    value={form.source}
    onChange={handleChange}
  >

    <option value="">Select Source</option>

    <option value="Facebook">Facebook</option>
    <option value="Instagram">Instagram</option>
    <option value="Google Ads">Google Ads</option>
    <option value="99acres">99acres</option>
    <option value="MagicBricks">MagicBricks</option>
    <option value="Housing">Housing</option>
    <option value="Website">Website</option>
    <option value="WhatsApp">WhatsApp</option>
    <option value="JustDial">JustDial</option>
    <option value="Reference">Reference</option>
    <option value="Hoarding">Hoarding</option>
    <option value="Newspaper">Newspaper</option>
    <option value="Walk-In">Walk-In</option>
    <option value="Call Center">Call Center</option>
    <option value="Property Expo">Property Expo</option>
    <option value="YouTube">YouTube</option>

  </select>
</div>
              {/* VISIT STATUS */}
<div className="form-group">
  <label>Visit Status</label>

  <select
    name="visitStatus"
    value={form.visitStatus}
    onChange={handleChange}
  >
    <option value="IN_OFFICE">In Office</option>

    <option value="VISIT_PENDING">Site Visit Pending</option>

    <option value="VISIT_DONE">Site Visit Done</option>

    <option value="FOLLOWUP">Follow Up</option>

    <option value="DECISION_PENDING">Decision Pending</option>

    <option value="NEGOTIATION">Negotiation</option>

    <option value="BOOKED">Booked</option>

    <option value="TOKEN_RECEIVED">Token Received</option>

    <option value="LOAN_PROCESS">Loan Process</option>

    <option value="REGISTRATION_PENDING">Registration Pending</option>

    <option value="REGISTERED">Registered</option>

    <option value="NOT_BOOKED">Not Booked</option>

    <option value="CANCELLED">Cancelled</option>
  </select>
</div>


              {/* BOOKING STATUS */}
<div className="form-group">
  <label>Booking Status</label>

  <select
    name="bookingStatus"
    value={form.bookingStatus}
    onChange={handleChange}
  >
    <option value="PENDING">Pending</option>

    <option value="DECISION_PENDING">Decision Pending</option>

    <option value="NEGOTIATION">Negotiation</option>

    <option value="BOOKED">Booked</option>

    <option value="TOKEN_RECEIVED">Token Received</option>

    <option value="LOAN_PROCESS">Loan Process</option>

    <option value="REGISTRATION_PENDING">Registration Pending</option>

    <option value="REGISTERED">Registered</option>

    <option value="NOT_BOOKED">Not Booked</option>

    <option value="CANCELLED">Cancelled</option>
  </select>
</div>

               {/* 🔥 CALLING BY DROPDOWN */}
              <div className="form-group">
                <label>Calling By</label>

                <div className="multi-select">

                  <div
                    className="select-box"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {form.calling_by.length > 0
                      ? form.calling_by.join(", ")
                      : "Select Executives"}
                  </div>

                  {showDropdown && (
                    <div className="dropdown-list">
                      {executivesList.map((name) => (
                        <label key={name} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={form.calling_by.includes(name)}
                            onChange={() => handleCheckboxChange(name)}
                          />
                          {name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </div>


<div className="form-group">

  <label>Assign To</label>

  <select
    name="assigned_to"
    value={form.assigned_to}
    onChange={handleChange}
  >

    <option value="">
      Select Executive
    </option>

    {users
      .filter(
        (u) =>
          u.role === "executive"
      )
      .map((u) => (
        <option
          key={u._id}
          value={u.email}
        >
          {u.name}
        </option>
      ))}

  </select>

</div>
{/* LEAD STATUS */}
<div className="form-group">
  <label>Lead Status</label>

  <select
    name="status"
    value={form.status}
    onChange={handleChange}
  >
    <option value="New">New</option>
    <option value="Fresh">Fresh</option>
    <option value="Interested">Interested</option>
    <option value="Followup">Followup</option>
    <option value="Not Interested">Not Interested</option>
    <option value="Visit Done">Visit Done</option>
    <option value="Booked">Booked</option>
  </select>
</div>
             

              {/* REMARK */}
              <div className="form-group">
                <label>Remark</label>
                <textarea
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                />
              </div>

              {/* MANAGER */}
              <div className="form-group">
                <label>Assign Manager</label>
                <select
                  name="attendedManager"
                  value={form.attendedManager}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Manager</option>
                  {managers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Visit"}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}