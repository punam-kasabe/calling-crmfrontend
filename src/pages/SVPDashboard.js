import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { useState } from "react";

export default function SvpDashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* MAIN CONTENT */}
      <div
        className="main-content"
        style={{
          marginLeft: isOpen ? "240px" : "70px",
          marginTop: "60px",
          width: "100%",
          transition: "0.3s",
          padding: "20px",
        }}
      >
        {/* 🔝 HEADER */}
        <div className="dashboard-header d-flex justify-content-between align-items-center mb-3">
          <h4>SVP Dashboard</h4>

          <div>
            <button className="btn btn-primary me-2">➕ Add Task</button>
            <button className="btn btn-success me-2">📥 Import</button>
            <button className="btn btn-dark">📤 Export</button>
          </div>
        </div>

        {/* 🔥 SUMMARY CARDS */}
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <div className="card card-blue p-3">
              <h6>Total Visits</h6>
              <h3>120</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-green p-3">
              <h6>Completed</h6>
              <h3>80</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-yellow p-3">
              <h6>Pending</h6>
              <h3>30</h3>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card card-red p-3">
              <h6>Cancelled</h6>
              <h3>10</h3>
            </div>
          </div>
        </div>

        {/* 📊 TABLE */}
        <div className="card p-3">
          <div className="d-flex justify-content-between mb-2">
            <h5>Scheduled Visits</h5>
            <button className="btn btn-sm btn-primary">
              Advanced Search
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Scheduled Date</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Assigned To</th>
                  <th>Project</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Rahul Sharma</td>
                  <td>20 Feb 2026</td>
                  <td>Monday</td>
                  <td>11:00 AM</td>
                  <td>Sales Team</td>
                  <td>Project A</td>
                  <td>Site Visit</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Priya Patil</td>
                  <td>21 Feb 2026</td>
                  <td>Tuesday</td>
                  <td>2:00 PM</td>
                  <td>Manager</td>
                  <td>Project B</td>
                  <td>Follow-up</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>Amit Joshi</td>
                  <td>22 Feb 2026</td>
                  <td>Wednesday</td>
                  <td>4:00 PM</td>
                  <td>Executive</td>
                  <td>Project C</td>
                  <td>Discussion</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-1">
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}