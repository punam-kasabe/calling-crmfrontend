import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../styles/sourceReport.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SourceReport() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  /* 🔥 STATIC DATA (API नंतर जोडू) */
  const data = [
    {
      source: "Facebook",
      total: 180,
      new: 17,
      interested: 82,
      ringing: 43,
      callback: 4,
      notInterested: 24,
      switchOff: 5,
      callCut: 5,
    },
    {
      source: "Microsites",
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
      source: "Virtual call",
      total: 8,
      new: 0,
      interested: 8,
      ringing: 0,
      callback: 0,
      notInterested: 0,
      switchOff: 0,
      callCut: 0,
    },
  ];

  /* 🔥 TOTAL ROW */
  const totals = data.reduce((acc, cur) => {
    Object.keys(cur).forEach(key => {
      if (key !== "source") {
        acc[key] = (acc[key] || 0) + cur[key];
      }
    });
    return acc;
  }, {});

  /* 🔥 PIE CHART */
  const chartData = {
    labels: data.map(d => d.source),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: ["#4f46e5", "#ef4444", "#f59e0b"],
      },
    ],
  };

  return (
    <div className="layout">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <h2 className="page-title">Source Report</h2>

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
                <th>Source</th>
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
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.source}</td>
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

              {/* 🔥 TOTAL ROW */}
              <tr className="total-row">
                <td><b>Total</b></td>
                <td>{totals.total}</td>
                <td>{totals.new}</td>
                <td>{totals.interested}</td>
                <td>{totals.ringing}</td>
                <td>{totals.callback}</td>
                <td>{totals.notInterested}</td>
                <td>{totals.switchOff}</td>
                <td>{totals.callCut}</td>
              </tr>
            </tbody>
          </table>

          <p className="entries-text">
            Showing 1 to {data.length} of {data.length} entries
          </p>

          {/* 🔥 PIE CHART */}
          <div className="chart-box">
            <Pie data={chartData} />
          </div>

        </div>
      </div>
    </div>
  );
}