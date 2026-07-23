import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/visitentries.css";

export default function VisitEntries() {

const [isOpen, setIsOpen] = useState(true);
const [visits, setVisits] = useState([]);
const [searchMobile, setSearchMobile] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [showEditModal, setShowEditModal] = useState(false);
const [users, setUsers] = useState([]);
const [editVisit, setEditVisit] = useState({
  _id: "",
  clientName: "",
  mobile: "",
  project: "",
  visitDate: "",   
  clientType: "New",
  department: "",
  source: "",
  status: "New",
  assigned_to: "",
  attendedManager: null,
  visitStatus: "",
  bookingStatus: "",
  remark: ""
});

//const navigate = useNavigate();
const handleEdit = (visit) => {
  setEditVisit({
    ...visit,

    visitDate: visit.visitDate
      ? new Date(visit.visitDate)
          .toISOString()
          .split("T")[0]
      : ""
  });

  setShowEditModal(true);
};

useEffect(() => {
  fetchVisits();
  fetchUsers();
}, []);


 const updateVisit = async () => {
  try {
    await axios.put(
`https://calling-crm-backend-7w52.onrender.com/api/update-visit/${editVisit._id}`,

{
  clientName: editVisit.clientName,
  mobile: editVisit.mobile,
  project: editVisit.project,
  visitDate: editVisit.visitDate,
  clientType: editVisit.clientType,
  department: editVisit.department,
  source: editVisit.source,
  status: editVisit.status,
  assigned_to: editVisit.assigned_to,
  visitStatus: editVisit.visitStatus,
  bookingStatus: editVisit.bookingStatus,
  remark: editVisit.remark,
  attendedManager:
    editVisit.attendedManager?._id ||
    editVisit.attendedManager
}
);
    alert("Visit Updated Successfully");
    setShowEditModal(false);
    fetchVisits();
  }
  catch (err) {
    console.log(err);
  }
};

const handleChange = (e) => {

  setEditVisit({

    ...editVisit,

    [e.target.name]: e.target.value

  });

};

  const fetchVisits = async () => {

    try {

      const res = await axios.get(
        "https://calling-crm-backend-7w52.onrender.com/api/visits"
      );

      setVisits(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };

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

  const handleSearchChange = async (e) => {

  const value = e.target.value;

  setSearchMobile(value);

  if (value.trim().length < 2) {

    setSuggestions([]);

    return;

  }

  try {

    const res = await axios.get(

`https://calling-crm-backend-7w52.onrender.com/api/search-suggestions/${value}`

    );

    setSuggestions(res.data);

  }

  catch (err) {

    console.log(err);

  }

};
 const searchVisit = async (value = "") => {

  const search = (value || searchMobile).trim();

  if (!search) {
    fetchVisits();
    return;
  }

  try {

    const res = await axios.get(
      `https://calling-crm-backend-7w52.onrender.com/api/search-client-details/${encodeURIComponent(search)}`
    );

    setVisits([res.data]);
    setSuggestions([]);

  } catch (err) {

    alert("Client Not Found");

  }

   };
  return (
    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <div className="reception-page">

          <h1>Visit Entries</h1>
        <div className="search-area">

  <div className="search-box">

    <input
      type="text"
      placeholder="Search by Mobile or Client Name"
      value={searchMobile}
      onChange={handleSearchChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          searchVisit();
        }
      }}
    />

    {suggestions.length > 0 && (

      <div className="search-suggestions">

        {suggestions.map((item) => (

          <div
            key={item._id}
            className="suggestion-item"
            onClick={() => {
  setSearchMobile(item.name);
  setSuggestions([]);
  searchVisit(item.phone || item.name);
}}
          >

            <div className="s-name">
              {item.name}
            </div>

            <div className="s-phone">
              {item.phone}
            </div>

          </div>

        ))}

      </div>

    )}

  </div>

  <button
    className="search-btn"
    onClick={searchVisit}
  >
    Search
  </button>

  <button
    className="reset-btn"
    onClick={() => {
      setSearchMobile("");
      setSuggestions([]);
      fetchVisits();
    }}
  >
    Reset
  </button>

</div>
          <table className="visit-table">

            <thead>

              <tr>

                <th>Client</th>
                <th>Mobile</th>
                <th>Project</th>
                <th>Client Type</th>
                <th>Visit Status</th>
              
                <th>Manager</th>
                <th>Calling By</th>
                <th>Remark</th>
                <th>Visit Date</th>
                <th>Created Date</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {visits.length > 0 ? (

                visits.map((v) => (

                  <tr key={v._id}>

                    <td>
                      {v.clientName || v.name}
                    </td>

                    <td>
                      {v.mobile || v.phone}
                    </td>

                    <td>
                      {v.project}
                    </td>
<td>
  {(v.clientType || "") === "Old"
    ? "🟠 Old Client"
    : "🟢 New Client"}
</td>
                    <td>
  <span
    className={`status ${
      v.visitStatus === "IN_OFFICE"
        ? "inoffice"
        : v.visitStatus === "VISIT_DONE"
        ? "done"
        : v.visitStatus === "FOLLOWUP"
        ? "follow"
        : "booked"
    }`}
  >
    {v.visitStatus || v.status}
  </span>
</td>

                 

                    <td>

                  {v.attendedManager?.name || v.assigned_manager || "-"}

                    </td>

                   <td>

                {Array.isArray(v.calling_by)

               ? v.calling_by.join(", ")

           : v.assignedTo || v.calling_by || "-"}

           </td>

          <td className="remark-cell">
           {v.remark || "-"}
           </td>


               <td>
  {v.visitDate
    ? new Date(v.visitDate).toLocaleDateString("en-GB")
    : "-"}
</td>


<td>
  {v.createdAt || v.created_date
    ? new Date(v.createdAt || v.created_date).toLocaleDateString("en-GB")
    : "-"}
</td>

     <td>
  <button
    className="edit-btn"
    onClick={() => handleEdit(v)}
  >
    Edit
  </button>
</td>
                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="10"
                    style={{
                      textAlign: "center"
                    }}
                  >

                    No Entries Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>
{showEditModal && (
  <div className="modal-overlay">
    <div className="edit-modal">

      <h2>Edit Visit</h2>

      <div className="modal-form">

        <div className="form-group">
          <label>Client Name</label>
          <input
            value={editVisit.clientName}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input
            value={editVisit.mobile}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Project</label>
          <select
            name="project"
            value={editVisit.project}
            onChange={handleChange}
          >
            <option value="99villa">99villa</option>
            <option value="Karjat">Karjat</option>
            <option value="Alibaug Plot">Alibaug</option>
            <option value="Pen">Pen</option>
            <option value="MahaMumbai">MahaMumbai</option>
          </select>
        </div>

        <div className="form-group">
          <label>Client Type</label>
          <select
            name="clientType"
            value={editVisit.clientType}
            onChange={handleChange}
          >
            <option value="New">New Client</option>
            <option value="Old">Old Client</option>
          </select>
        </div>

        <div className="form-group">
          <label>Visit Date</label>
          <input
            type="date"
            name="visitDate"
            value={editVisit.visitDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Assigned Manager</label>

          <select
            name="attendedManager"
            value={
              editVisit.attendedManager?._id ||
              editVisit.attendedManager ||
              ""
            }
            onChange={handleChange}
          >
            <option value="">Select Manager</option>

            {users
              .filter(
                u =>
                  u.role === "manager" ||
                  u.role === "executive"
              )
              .map(u => (
                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Department</label>

          <select
            name="department"
          value={editVisit.department || ""}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="HR/Admin">HR/Admin</option>
            <option value="TeleCaller">TeleCaller</option>
            <option value="Aasma Ma'am">Aasma Ma'am</option>
            <option value="Nilesh Sir">Nilesh Sir</option>
          </select>
        </div>

        <div className="form-group">
          <label>Source</label>

          <select
            name="source"
            value={editVisit.source || ""}
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

        <div className="form-group">
          <label>Assign To</label>

          <select
            name="assigned_to"
            value={editVisit.assigned_to || ""}
            onChange={handleChange}
          >
            <option value="">Select Executive</option>

            {users
              .filter(u => u.role === "executive")
              .map(u => (
                <option
                  key={u._id}
                  value={u.email}
                >
                  {u.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Lead Status</label>

          <select
            name="status"
           value={editVisit.status || "New"}
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

        <div className="form-group full-width">
          <label>Visit Status</label>

          <select
            name="visitStatus"
           value={editVisit.visitStatus || "IN_OFFICE"}
            onChange={handleChange}
          >
            <option value="IN_OFFICE">In Office</option>
            <option value="VISIT_PENDING">Site Visit Pending</option>
            <option value="VISIT_DONE">Site Visit Done</option>
            <option value="DECISION_PENDING">Decision Pending</option>
            <option value="FOLLOWUP">Follow Up</option>
            <option value="BOOKED">Booked</option>
            <option value="NOT_BOOKED">Not Booked</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Booking Status</label>

          <select
            name="bookingStatus"
          value={editVisit.bookingStatus || "PENDING"}
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

        <div className="form-group full-width">
          <label>Remark</label>

          <textarea
            name="remark"
            value={editVisit.remark}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="modal-buttons">
        <button
          className="save-btn"
          onClick={updateVisit}
        >
          Save
        </button>

        <button
          className="cancel-btn"
          onClick={() => setShowEditModal(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

        </div>

      </div>

    </div>

  );

}