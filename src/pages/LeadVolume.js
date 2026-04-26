import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../styles/LeadVolume.css";

import Sidebar from "../components/Sidebar";

export default function LeadVolume() {
  const [active, setActive] = useState("Today");
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const labels = [
    "Apr 13","Apr 14","Apr 15","Apr 16",
    "Apr 17","Apr 18","Apr 19","Apr 20"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Leads Generated",
        data: [35, 20, 0, 8, 6, 40, 25, 95],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78,115,223,0.2)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Visits Done",
        data: [0,0,0,0,0,0,0,0],
        borderColor: "#e74a3b",
        backgroundColor: "#e74a3b",
        pointRadius: 4
      },
      {
        label: "Conversions",
        data: [0,0,0,0,0,0,0,0],
        borderColor: "#f6c23e",
        backgroundColor: "#f6c23e",
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <>
      {/* 🔥 SIDEBAR */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* 🔥 MAIN CONTENT */}
      <div className={`main ${isOpen ? "" : "collapsed"}`}>

        <h2>Lead Volume Report</h2>

        {/* FILTER BUTTONS */}
        <div className="filters">
          {["Today","Last 7 Days","Last 30 Days","This Month","Last Month","Till Date"].map(btn => (
            <button
              key={btn}
              className={active === btn ? "active" : ""}
              onClick={() => setActive(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* CHART */}
        <div className="chart-box">
          <Line data={data} options={options} />
        </div>

      </div>
    </>
  );
}