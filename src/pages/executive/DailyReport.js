import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dailyreport.css";
import { Eye } from "lucide-react";

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

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchReports = useCallback(async () => {

  try {

    const res = await axios.get(
      `${API}/daily-report/${user.email}`
    );

    setReports(res.data);

  } catch (err) {
    console.log(err);
  }

}, [user.email]);

  useEffect(() => {
  fetchReports();
}, [fetchReports]);

  const saveReport = async () => {

    try {

      await axios.post(`${API}/daily-report`, {

        executive_name: user.name,
        executive_email: user.email,
        ...form

      });

      alert("Daily Report Saved Successfully ✅");

      fetchReports();

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

    } catch (err) {

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

          <h3 className="mt-5">
            My Reports
          </h3>
         <div className="report-card mt-4">

         
          <div className="table-responsive">

           <table className="table table-bordered table-striped">

<thead>
  <tr>
    <th>Date</th>
    <th>Total Calls</th>
    <th>Interested</th>
    <th>View</th>
  </tr>
</thead>

             <tbody>

{reports.length === 0 ? (

<tr>
<td colSpan="4" className="text-center">
No Reports Found
</td>
</tr>

) : (

reports.map((item) => (

<tr key={item._id}>

<td>
{new Date(item.createdAt).toLocaleDateString("en-GB")}
</td>

<td>{item.totalCalls}</td>

<td>{item.interested}</td>

<td>

<button
className="view-btn"
onClick={()=>{
setSelectedReport(item);
setShowModal(true);
}}
>

<Eye size={18}/>

</button>

</td>

</tr>

))

)}

</tbody>

            </table>

          </div>

        </div>
</div>
      </div>

      {

        showModal && (

          <div
            className="modal fade show d-block"
            style={{
              background: "rgba(0,0,0,.5)"
            }}
          >

            <div className="modal-dialog modal-lg">

              <div className="modal-content">

                <div className="modal-header">

                  <h5 className="modal-title">
                    Daily Report Details
                  </h5>

                  <button
                    className="btn-close"
                    onClick={() =>
                      setShowModal(false)
                    }
                  >
                  </button>

                </div>

              <div className="modal-body">

<div className="report-details">

<div className="detail-row">
<span>Date</span>
<strong>
{new Date(selectedReport?.createdAt).toLocaleDateString("en-GB")}
</strong>
</div>

<div className="detail-row">
<span>Time</span>
<strong>
{new Date(selectedReport?.createdAt).toLocaleTimeString()}
</strong>
</div>

<div className="detail-row">
<span>Total Calls</span>
<strong>{selectedReport?.totalCalls}</strong>
</div>

<div className="detail-row">
<span>Followups</span>
<strong>{selectedReport?.followups}</strong>
</div>

<div className="detail-row">
<span>Interested</span>
<strong>{selectedReport?.interested}</strong>
</div>

<div className="detail-row">
<span>Site Visits</span>
<strong>{selectedReport?.siteVisits}</strong>
</div>

<div className="detail-row">
<span>Bookings</span>
<strong>{selectedReport?.bookings}</strong>
</div>

<div className="detail-row">
<span>Pending Work</span>
<p>{selectedReport?.pendingWork}</p>
</div>

<div className="detail-row">
<span>Tomorrow Plan</span>
<p>{selectedReport?.tomorrowPlan}</p>
</div>

<div className="detail-row">
<span>Remarks</span>
<p>{selectedReport?.remarks}</p>
</div>

</div>

</div>
              </div>

            </div>

          </div>

        )

      }

    </>

  );

}