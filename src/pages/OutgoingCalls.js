import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/OutgoingCalls.css";

export default function OutgoingCalls() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [calls] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      mobile: "9876543210",
      status: "Connected",
      duration: "02:15",
      date: "12 Apr 2026",
    },
    {
      id: 2,
      name: "Priya Mehta",
      mobile: "9123456780",
      status: "Missed",
      duration: "00:00",
      date: "12 Apr 2026",
    },
  ]);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        className="main-content"
        style={{
          marginLeft: isOpen ? "240px" : "0px",
        }}
      >
        {/* HEADER */}
        <div className="page-header">
          <h4>Outgoing Calls</h4>

          <div>
            <button className="btn btn-primary me-2">📞 New Call</button>
            <button className="btn btn-success me-2">📥 Import</button>
            <button className="btn btn-dark">📤 Export</button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <input type="text" placeholder="Search by name or number..." />

          <select>
            <option>All Status</option>
            <option>Connected</option>
            <option>Missed</option>
            <option>Not Answered</option>
          </select>

          <button className="btn btn-secondary">Search</button>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {calls.map((call) => (
                <tr key={call.id}>
                  <td>{call.name}</td>
                  <td>{call.mobile}</td>

                  <td>
                    <span
                      className={`status ${
                        call.status === "Connected"
                          ? "green"
                          : call.status === "Missed"
                          ? "red"
                          : "yellow"
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>

                  <td>{call.duration}</td>
                  <td>{call.date}</td>

                  <td>
                    <button className="btn btn-sm btn-primary me-1">
                      View
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}