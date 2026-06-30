import { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";

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

        <div className="dashboard-container">

          <h2>
            Daily Work Report
          </h2>

          <br />

          <div className="card p-4">

            <div className="row">

              <div className="col-md-6 mb-3">

                <label>Total Calls</label>

                <input
                  type="number"
                  className="form-control"
                  name="totalCalls"
                  value={form.totalCalls}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-6 mb-3">

                <label>Followups</label>

                <input
                  type="number"
                  className="form-control"
                  name="followups"
                  value={form.followups}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-6 mb-3">

                <label>Interested Leads</label>

                <input
                  type="number"
                  className="form-control"
                  name="interested"
                  value={form.interested}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-6 mb-3">

                <label>Site Visits</label>

                <input
                  type="number"
                  className="form-control"
                  name="siteVisits"
                  value={form.siteVisits}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-6 mb-3">

                <label>Bookings</label>

                <input
                  type="number"
                  className="form-control"
                  name="bookings"
                  value={form.bookings}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-12 mb-3">

                <label>Pending Work</label>

                <textarea
                  rows="3"
                  className="form-control"
                  name="pendingWork"
                  value={form.pendingWork}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-12 mb-3">

                <label>Tomorrow Plan</label>

                <textarea
                  rows="3"
                  className="form-control"
                  name="tomorrowPlan"
                  value={form.tomorrowPlan}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-12 mb-3">

                <label>Remarks</label>

                <textarea
                  rows="5"
                  className="form-control"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-12">

                <button
                  className="btn btn-primary"
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