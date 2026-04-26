import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import CountUp from "react-countup";
import "chart.js/auto";

const API = "http://localhost:5000/api";

export default function Dashboard() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  /* ✅ USER SAFE LOAD */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    total: 0,
    new: 0,
    booked: 0,
    interested: 0,
    not_interested: 0,
    pending: 0,
    status: []
  });

  /* ================= FETCH ================= */
  const fetchDashboard = useCallback(async () => {
    try {
      if (!user?.email || !user?.role) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const res = await axios.get(`${API}/dashboard`, {
        params: {
          email: user.email,
          role: user.role
        }
      });

      const d = res.data || {};

      setData({
        total: d.total || 0,
        new: d.new || 0,
        booked: d.booked || 0,
        interested: d.interested || 0,
        not_interested: d.not_interested || 0,
        pending:
          (d.total || 0) -
          (d.booked || 0) -
          (d.not_interested || 0),
        status: d.status || []
      });

    } catch (err) {
      console.log("Dashboard Error ❌", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ================= CHART ================= */

  const pieData = {
    labels: data.status.length
      ? data.status.map((s) => s._id)
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

        <h4 className="mb-3">Dashboard</h4>

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
                { title: "Booked", value: data.booked, cls: "card-green" },
                { title: "Pending", value: data.pending, cls: "card-yellow" },
                { title: "Interested", value: data.interested, cls: "card-green" },
                { title: "Not Interested", value: data.not_interested, cls: "card-red" },
              ].map((item) => (
                <div key={item.title} className="col-xl-2 col-md-4 col-sm-6 mb-3">
                  <div className={`card compact-card ${item.cls}`}>
                    <h6>{item.title}</h6>
                    <h3>
                      <CountUp end={item.value} duration={1} />
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 CHARTS */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="chart-card">
                  <h5>Weekly Trends</h5>
                  <Line data={trendData} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Status Distribution</h5>
                  <Pie data={pieData} />
                </div>
              </div>
            </div>

            {/* 🔥 EXTRA */}
            <div className="row">
              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Leads Overview</h5>
                  <Pie data={pieData} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Source Analysis</h5>
                  <Pie data={pieData} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="chart-card">
                  <h5>Projects Performance</h5>
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