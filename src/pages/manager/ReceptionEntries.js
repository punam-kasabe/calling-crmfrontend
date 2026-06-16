import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/receptionEntries.css";

const API = process.env.REACT_APP_API_URL;

export default function ReceptionEntries() {
  const [isOpen, setIsOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () =>
    setIsOpen(!isOpen);

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const fetchLeads = useCallback(async () => {
    try {
      const res = await axios.get(
  `${API}/api/manager/reception-entries`,
  {
    params: {
      email: user?.email
    }
  }
);

      setLeads(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="layout">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`main-content ${
          isOpen ? "" : "expanded"
        }`}
      >
        <div className="page-header">
          <h2>Reception Entries</h2>
        </div>

        <div className="table-card">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="crm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Project</th>
                  <th>Assigned Executive</th>
                  <th>Status</th>
                  <th>Next Followup</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      No Reception Entries Found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, index) => (
                    <tr key={lead._id}>
                      <td>{index + 1}</td>

                      <td>{lead.name}</td>

                      <td>{lead.phone}</td>

                      <td>{lead.project}</td>

                      <td>
                        {lead.assignedTo || "-"}
                      </td>

                      <td>
                        {lead.status || "New"}
                      </td>

                      <td>
                        {lead.next_call_date
                          ? new Date(
                              lead.next_call_date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        {lead.createdAt
                          ? new Date(
                              lead.createdAt
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}