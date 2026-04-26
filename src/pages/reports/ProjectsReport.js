import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/projectsReport.css";

export default function ProjectsReport() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const data = [
    {
      project: "ABC plot.",
      total: 1,
      new: 0,
      interested: 1,
      ringing: 0,
      callback: 0,
      notInterested: 0,
      switchOff: 0,
      callCut: 0,
    },
    {
      project: "Maha Mumbai 3.0.",
      total: 6,
      new: 0,
      interested: 0,
      ringing: 3,
      callback: 1,
      notInterested: 2,
      switchOff: 0,
      callCut: 0,
    },
    {
      project: "Maha-Mumbaai",
      total: 21,
      new: 0,
      interested: 12,
      ringing: 7,
      callback: 0,
      notInterested: 1,
      switchOff: 1,
      callCut: 0,
    },
  ];

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>
        <h2 className="page-title">Projects Report</h2>

        {/* 🔥 FILTER BUTTONS */}
        <div className="filters">
          <button className="btn export">Export</button>
          <button className="btn dark">Today</button>
          <button className="btn blue">Last 7 Days</button>
          <button className="btn green">Last 30 Days</button>
          <button className="btn teal">This Month</button>
          <button className="btn yellow">Last Month</button>
          <button className="btn light">Till Date</button>

          <button className="btn advanced">Advanced Search</button>
        </div>

        {/* 📊 TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Total</th>
                <th>New</th>
                <th>Interested</th>
                <th>Ringing</th>
                <th>Call Back</th>
                <th>Not Interested</th>
                <th>Switch Off</th>
                <th>Call Cut</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.project}</td>
                  <td>{row.total}</td>
                  <td>{row.new}</td>
                  <td>{row.interested}</td>
                  <td>{row.ringing}</td>
                  <td>{row.callback}</td>
                  <td>{row.notInterested}</td>
                  <td>{row.switchOff}</td>
                  <td>{row.callCut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}