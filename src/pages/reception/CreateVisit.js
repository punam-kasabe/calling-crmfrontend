// FILE: src/pages/reception/CreateVisit.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import "../../styles/createvisit.css";

export default function CreateVisit() {

  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [managers, setManagers] = useState([]);
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
    "Siddhesh"
  ];

  const [form, setForm] = useState({
    clientName: "",
    mobile: "",
    project: "",
    attendedManager: "",
    visitStatus: "IN_OFFICE",
    bookingStatus: "PENDING",
    calling_by: [],
    remark: ""
  });

  useEffect(() => {
    fetchManagers();
  }, []);

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
        remark: ""
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
                  <option value="99 villa plot">99 villa plot</option>
                  <option value="Affordable life">Affordable life</option>
                  <option value="Alibaug Plot">Alibaug Plot</option>
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
                  <option value="VISIT_DONE">Site Visit Done</option>
                  <option value="BOOKED">Booked</option>
                  <option value="FOLLOWUP">Followup</option>
                  <option value="NOT_BOOKED">Not Booked</option>
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
                  <option value="BOOKED">Booked</option>
                  <option value="NOT_BOOKED">Not Booked</option>
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