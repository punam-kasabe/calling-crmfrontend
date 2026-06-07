import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";
const API = "https://calling-crm-backend-7w52.onrender.com/api";

export default function TotalLeads() {
    const [isOpen, setIsOpen] = useState(true);

const toggleSidebar = () => {
  setIsOpen(!isOpen);
};
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API}/leads`);
      setLeads(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="dashboard-page">

    <Sidebar
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
    />

    <div
      className="dashboard-container"
      style={{
        marginLeft: isOpen ? "240px" : "70px"
      }}
    >

      <h2 className="dashboard-title">
        Total Leads Report
      </h2>

      <div className="chart-card">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px"
          }}
        >

          <h5>
            All Leads ({leads.length})
          </h5>

        </div>

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead>

              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {leads.length > 0 ? (

                leads.map((lead, index) => (

                  <tr key={lead._id}>

                    <td>{index + 1}</td>

                    <td>{lead.name}</td>

                    <td>{lead.phone}</td>

                    <td>{lead.project}</td>

                    <td>{lead.assigned_to}</td>

                    <td>{lead.status}</td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    align="center"
                  >
                    No Leads Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  </div>
);
}