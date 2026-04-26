import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/TeamPerformance.css";
export default function TeamPerformance() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [filter, setFilter] = useState("Today");

  /* 🔥 SAMPLE DATA */
  const data = [
    { name: "Jyoti Chaugle", total: 71, newLead: 28, interested: 34 },
    { name: "Manisha", total: 59, newLead: 16, interested: 29 },
    { name: "Rakhi Mane", total: 3, newLead: 0, interested: 0 },
    { name: "Snehal Halde", total: 67, newLead: 1, interested: 10 },
    { name: "Vrushali Jagtap", total: 21, newLead: 0, interested: 14 }
  ];

  /* 🔥 TOTAL */
  const totals = data.reduce(
    (acc, cur) => {
      acc.total += cur.total;
      acc.newLead += cur.newLead;
      acc.interested += cur.interested;
      return acc;
    },
    { total: 0, newLead: 0, interested: 0 }
  );

  /* 🔥 PIE CHART */
  const pieData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: [
          "#4f46e5",
          "#ef4444",
          "#f59e0b",
          "#22c55e",
          "#06b6d4"
        ],
      },
    ],
  };

  return (
    <div className="layout">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <h2 className="page-title">Team Performance Report</h2>

        {/* 🔥 FILTER BUTTONS */}
        <div className="filters">
          {[
            "Today",
            "Last 7 Days",
            "Last 30 Days",
            "This Month",
            "Last Month",
            "Till Date"
          ].map((btn) => (
            <button
              key={btn}
              className={`btn ${filter === btn ? "active" : ""}`}
              onClick={() => setFilter(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* 📊 TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Total</th>
                <th>New</th>
                <th>Interested</th>
              </tr>
            </thead>

            <tbody>
              {data.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.total}</td>
                  <td>{user.newLead}</td>
                  <td>{user.interested}</td>
                </tr>
              ))}

              {/* 🔥 TOTAL ROW */}
              <tr className="total-row">
                <td><b>Total</b></td>
                <td>{totals.total}</td>
                <td>{totals.newLead}</td>
                <td>{totals.interested}</td>
              </tr>
            </tbody>
          </table>

          <p className="entries-text">
            Showing 1 to {data.length} of {data.length} entries
          </p>

          {/* 🔥 CHART */}
          <div className="chart-box">
            <Pie data={pieData} />
          </div>
        </div>

      </div>
    </div>
  );
}