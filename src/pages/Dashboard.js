import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import CountUp from "react-countup";
import "chart.js/auto";

const API = "http://localhost:5000";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    total: 0,
    new: 0,
    completed: 0,
    pending: 0,
    interested: 0,
    not_interested: 0,
    status: [],
    users: [],
  });

  /* ================= FETCH ================= */
  const fetchDashboard = useCallback(() => {
    if (!user.email || !user.role) return;

    setLoading(true);

    axios
      .get(`${API}/dashboard`, {
        params: {
          email: user.email,
          role: user.role,
        },
      })
      .then((res) => {
        setData({
          total: res.data.total || 0,
          new: res.data.new || 0,
          completed: res.data.completed || 0,
          pending: res.data.pending || 0,
          interested: res.data.interested || 0,
          not_interested: res.data.not_interested || 0,
          status: res.data.status || [],
          users: res.data.users || [],
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
  fetchDashboard(); // only first load
}, [fetchDashboard]);
  /* ================= CHART DATA ================= */

  const pieData = {
    labels: data.status.length
      ? data.status.map((s) => s.status)
      : ["No Data"],
    datasets: [
      {
        data: data.status.length
          ? data.status.map((s) => s.count)
          : [1],
      },
    ],
  };


  const trendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Leads",
        data: [12, 19, 8, 15, 22, 18, 25],
        fill: true,
      },
    ],
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        className="dashboard-container"
        style={{
          marginLeft: isOpen ? "240px" : "70px",
          marginTop: "60px",
          padding: "20px",
          width: `calc(100% - ${isOpen ? "240px" : "70px"})`,
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        {/* HEADER */}
        <div className="dashboard-header mb-3">
          <h4>Dashboard</h4>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <h5>Loading Dashboard...</h5>
          </div>
        ) : (
          <>
            {/* 🔥 STATS */}
            <div className="row mb-4">
              {[
                { title: "Total Leads", value: data.total, cls: "card-blue" },
                { title: "New Leads", value: data.new, cls: "card-blue" },
                { title: "Completed", value: data.completed, cls: "card-green" },
                { title: "Pending", value: data.pending, cls: "card-yellow" },
                { title: "Interested", value: data.interested, cls: "card-green" },
                { title: "Not Interested", value: data.not_interested, cls: "card-red" },
              ].map((item, i) => (
                <div key={i} className="col-xl-2 col-md-4 col-sm-6 mb-3">
                  <div className={`card compact-card ${item.cls}`}>
                    <h6>{item.title}</h6>
                    <h3><CountUp end={item.value} /></h3>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 TOP ROW */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="chart-card">
                  <h5>Trends Report</h5>
                  <Line data={trendData} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Marketing Campaign</h5>
                  <Pie data={pieData} />
                </div>
              </div>
            </div>

            {/* 🔥 SECOND ROW */}
            <div className="row">
              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Leads Report</h5>
                  <Pie data={pieData} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Source Report</h5>
                  <Pie data={pieData} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Projects Report</h5>
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}