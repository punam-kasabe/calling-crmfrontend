import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function NewLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/all-leads`
      );

      const allLeads = Array.isArray(res.data)
        ? res.data
        : [];

      const newLeads = allLeads.filter(
        (lead) =>
          String(lead.status || "")
            .toLowerCase()
            .trim() === "new"
      );

      setLeads(newLeads);
    } catch (err) {
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >
        <div className="page-container">
          <h2>New Leads</h2>

          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No New Leads Found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name || "-"}</td>
                      <td>{lead.phone || "-"}</td>
                      <td>{lead.project || "-"}</td>
                      <td>{lead.status || "-"}</td>
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