import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/myleads.css";

export default function MyLeads() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

 // eslint-disable-next-line
useEffect(() => {
  fetchMyLeads();
}, [fetchMyLeads]);

  const fetchMyLeads = async () => {
    try {

      const res = await axios.get(
        `https://calling-crm-backend-1.onrender.com/api/leads/executive/${user._id}`
      );

      setLeads(res.data);

    } catch (err) {
      console.error("Error fetching leads", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (leadId, status) => {
    try {

      await axios.put(
        `https://calling-crm-backend-1.onrender.com/api/leads/${leadId}`,
        { status }
      );

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? { ...lead, status }
            : lead
        )
      );

    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN CONTENT */}
      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <div className="page-header">

          <h2>My Leads</h2>

          <p>
            Total Leads:
            <strong> {leads.length}</strong>
          </p>

        </div>

        {loading ? (

          <div className="loader">
            Loading leads...
          </div>

        ) : leads.length === 0 ? (

          <div className="empty-state">
            No leads assigned yet.
          </div>

        ) : (

          <div className="table-wrapper">

            <table className="leads-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Client Name</th>
                  <th>Mobile</th>
                  <th>Project</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {leads.map((lead, index) => (

                  <tr key={lead._id}>

                    <td>{index + 1}</td>

                    <td>{lead.name}</td>

                    <td>{lead.mobile}</td>

                    <td>{lead.project}</td>

                    <td>{lead.source}</td>

                    <td>
                      <span
                        className={`status-badge ${lead.status?.toLowerCase()}`}
                      >
                        {lead.status || "NEW"}
                      </span>
                    </td>

                    <td>

                      <select
                        value={lead.status || "NEW"}
                        onChange={(e) =>
                          updateStatus(
                            lead._id,
                            e.target.value
                          )
                        }
                      >

                        <option value="NEW">
                          NEW
                        </option>

                        <option value="INTERESTED">
                          INTERESTED
                        </option>

                        <option value="FOLLOWUP">
                          FOLLOWUP
                        </option>

                        <option value="VISIT_SCHEDULED">
                          VISIT SCHEDULED
                        </option>

                        <option value="NOT_INTERESTED">
                          NOT INTERESTED
                        </option>

                      </select>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}