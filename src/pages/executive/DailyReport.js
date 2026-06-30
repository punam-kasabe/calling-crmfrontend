import { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dailyreport.css";

const API = "https://calling-crm-backend-7w52.onrender.com/api";

export default function DailyReport() {

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({

    totalCalls: "",

    followups: "",

    interested: "",

    siteVisits: "",

    bookings: "",

    pendingWork: "",

    tomorrowPlan: "",

    remarks: ""

  });

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  const saveReport = async () => {

    try {

      await axios.post(`${API}/daily-report`, {

        executive_name: user.name,

        executive_email: user.email,

        ...form

      });

      alert("Daily Report Saved Successfully ✅");

      setForm({

        totalCalls: "",

        followups: "",

        interested: "",

        siteVisits: "",

        bookings: "",

        pendingWork: "",

        tomorrowPlan: "",

        remarks: ""

      });

    }

    catch (err) {

      console.log(err);

      alert("Error Saving Report");

    }

  };

  return (

    <>
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`main-content ${
          isOpen ? "expanded" : "collapsed"
        }`}
      >

<div className="dashboard-container daily-report-page">
          <h2 className="daily-report-title">
Daily Work Report
</h2>

<p className="daily-report-subtitle">
Submit today's work summary.
</p>

          <br />

       <div className="report-card">

            <div className="report-grid">

<div className="form-group">
                <label>Total Calls</label>

                <input
                  type="number"
                  className="form-control"
                  name="totalCalls"
                  value={form.totalCalls}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>Followups</label>

                <input
                  type="number"
                  className="form-control"
                  name="followups"
                  value={form.followups}
                  onChange={handleChange}
                />

              </div>

             <div className="form-group">

                <label>Interested Leads</label>

                <input
                  type="number"
                  className="form-control"
                  name="interested"
                  value={form.interested}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>Site Visits</label>

                <input
                  type="number"
                  className="form-control"
                  name="siteVisits"
                  value={form.siteVisits}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>Bookings</label>

                <input
                  type="number"
                  className="form-control"
                  name="bookings"
                  value={form.bookings}
                  onChange={handleChange}
                />

              </div>

             <div className="form-group full-width">

                <label>Pending Work</label>

                <textarea
                  rows="3"
                  className="form-control"
                  name="pendingWork"
                  value={form.pendingWork}
                  onChange={handleChange}
                />

              </div>

             <div className="form-group full-width">

                <label>Tomorrow Plan</label>

                <textarea
                  rows="3"
                  className="form-control"
                  name="tomorrowPlan"
                  value={form.tomorrowPlan}
                  onChange={handleChange}
                />

              </div>

             <div className="form-group full-width">

                <label>Remarks</label>

                <textarea
                  rows="5"
                  className="form-control"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                />

              </div>

              <div className="full-width">

<button
className="save-btn"
                  onClick={saveReport}
                >
                  Save Report
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}