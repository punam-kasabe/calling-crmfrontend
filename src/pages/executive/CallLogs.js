import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/calllogs.css";
export default function CallLogs() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className={`main ${isOpen ? "shifted" : ""}`}>
        
        {/* 🔝 TITLE */}
        <div className="header">
          <h2>Communication Analysis</h2>

          <div className="cards">
            <div className="card">
              <p>Missed Calls</p>
              <h3>0</h3>
            </div>

            <div className="card">
              <p>Today's Incoming Calls</p>
              <h3>0</h3>
            </div>

            <div className="card">
              <p>Past Incoming Calls</p>
              <h3>0</h3>
            </div>
          </div>
        </div>

        {/* 🔘 ACTIONS */}
        <div className="actions">
          <button className="export-btn">⬇ Export</button>
          <button className="search-btn">Advanced Search</button>
        </div>

        {/* 📊 TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Executive</th>
                <th>From</th>
                <th>To</th>
                <th>Call</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Lead Status</th>
                <th>Lead Source</th>
                <th>CP</th>
                <th>Project</th>
                <th>Direction</th>
                <th>Overall Duration</th>
                <th>Call Status</th>
                <th>Call Type</th>
                <th>Recording URL</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="17" className="no-data">
                  No Data Available
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}