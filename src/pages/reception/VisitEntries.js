import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/reception.css";

export default function VisitEntries() {

const [isOpen, setIsOpen] = useState(true);
const [visits, setVisits] = useState([]);
const [showEditModal, setShowEditModal] = useState(false);
const [editVisit, setEditVisit] = useState({
  _id: "",
  clientName: "",
  mobile: "",
  project: "",
  attendedManager: null,
  visitStatus: "",
  bookingStatus: "",
  remark: ""
});

//const navigate = useNavigate();
const handleEdit = (visit) => {
  setEditVisit(visit);
  setShowEditModal(true);
};

useEffect(() => {
  fetchVisits();
}, []);


 const updateVisit = async () => {
  try {
    await axios.put(
`https://calling-crm-backend-7w52.onrender.com/api/update-visit/${editVisit._id}`,

{

  clientName: editVisit.clientName,
  mobile: editVisit.mobile,
  project: editVisit.project,
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

          <table className="visit-table">

            <thead>

              <tr>

                <th>Client</th>
                <th>Mobile</th>
                <th>Project</th>
                <th>Client Type</th>
                <th>Visit Status</th>
                <th>Booking</th>
                <th>Manager</th>
                <th>Calling By</th>
                <th>Remark</th>
                <th>Date</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {visits.length > 0 ? (

                visits.map((v) => (

                  <tr key={v._id}>

                    <td>
                      {v.clientName}
                    </td>

                    <td>
                      {v.mobile}
                    </td>

                    <td>
                      {v.project}
                    </td>
<td>
  {v.clientType === "Old" ? "🟠 Old Client" : "🟢 New Client"}
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
    {v.visitStatus}
  </span>
</td>

                  <td>
  <span
    className={`booking ${
      v.bookingStatus === "PENDING"
        ? "pending"
        : v.bookingStatus === "BOOKED"
        ? "booked"
        : "notbooked"
    }`}
  >
    {v.bookingStatus}
  </span>
</td>

                    <td>

                      {v.attendedManager?.name || "-"}

                    </td>

                    <td>
  {Array.isArray(v.calling_by)
    ? v.calling_by.join(", ")
    : v.calling_by || "-"}
</td>

<td className="remark-cell">
  {v.remark || "-"}
</td>
                
                    <td>

                      {new Date(
                        v.createdAt
                      ).toLocaleDateString()}

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

    <input
      name="clientName"
      value={editVisit.clientName}
      onChange={handleChange}
      placeholder="Client Name"
    />

    <input
      name="mobile"
      value={editVisit.mobile}
      onChange={handleChange}
      placeholder="Mobile"
    />

    <input
      name="project"
      value={editVisit.project}
      onChange={handleChange}
      placeholder="Project"
    />
    <div className="form-group">

  <label>Assigned Manager</label>

  <input
    value={editVisit.attendedManager?.name || "-"}
    readOnly
  />

</div>

    <select
      name="visitStatus"
      value={editVisit.visitStatus}
      onChange={handleChange}
    >
      <option value="IN_OFFICE">IN_OFFICE</option>
      <option value="VISIT_DONE">VISIT_DONE</option>
      <option value="FOLLOWUP">FOLLOWUP</option>
      <option value="BOOKED">BOOKED</option>
      <option value="NOT_BOOKED">NOT_BOOKED</option>
    </select>

    <select
      name="bookingStatus"
      value={editVisit.bookingStatus}
      onChange={handleChange}
    >
      <option value="PENDING">PENDING</option>
      <option value="BOOKED">BOOKED</option>
      <option value="NOT_BOOKED">NOT_BOOKED</option>
    </select>

   <textarea
  name="remark"
  value={editVisit.remark || ""}
  onChange={handleChange}
  placeholder="Remark"
/>

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