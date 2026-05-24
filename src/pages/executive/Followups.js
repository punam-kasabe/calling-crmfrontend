import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import "../../styles/followups.css";

export default function Followups() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED ESLINT WARNING
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  }, []);

  /* ================= FETCH FOLLOWUPS ================= */

  const fetchFollowups = useCallback(async () => {

    try {

      if (!user?._id) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://calling-crm-backend-7w52.onrender.com/api/followups/${user._id}`
      );

      setFollowups(res.data);

    } catch (err) {

      console.error(
        "Error fetching followups",
        err
      );

    } finally {

      setLoading(false);

    }

  }, [user]);

  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  /* ================= UPDATE STATUS ================= */

  const updateFollowupStatus = async (
    leadId,
    status
  ) => {

    try {

      await axios.put(
        `https://calling-crm-backend-7w52.onrender.com/api/leads/${leadId}`,
        { status }
      );

      setFollowups((prev) =>
        prev.map((item) =>
          item._id === leadId
            ? { ...item, status }
            : item
        )
      );

    } catch (err) {

      console.error(
        "Error updating followup status",
        err
      );

    }

  };

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="page-header">

          <h2>Followups</h2>

          <p>
            Pending Followups:
            <strong>
              {" "}
              {followups.length}
            </strong>
          </p>

        </div>

        {loading ? (

          <div className="loader">
            Loading followups...
          </div>

        ) : followups.length === 0 ? (

          <div className="empty-state">
            No followups available.
          </div>

        ) : (

          <div className="table-wrapper">

            <table className="followup-table">

            <thead>
  <tr>
    <th>Sr No</th>
    <th>Name</th>
    <th>Mobile</th>
    <th>Status</th>
    <th>Followup Date</th>
    <th>Project</th>
    <th>Update</th>
  </tr>
</thead>

<tbody>
  {followups.map((lead, index) => (
    <tr key={lead._id}>

      <td>{index + 1}</td>

      <td>{lead.name}</td>

      <td>{lead.phone}</td>

      <td>
        <span
          className={`status-badge ${
            lead.status?.toLowerCase()
          }`}
        >
          {lead.status}
        </span>
      </td>

      <td>
        {lead.followup_date
          ? new Date(
              lead.followup_date
            ).toLocaleDateString()
          : "N/A"}
      </td>

      <td>{lead.project}</td>

      <td>

        <select
          value={lead.status}
          onChange={(e) =>
            updateFollowupStatus(
              lead._id,
              e.target.value
            )
          }
        >

          <option value="Followup">
            Followup
          </option>

          <option value="Interested">
            Interested
          </option>

          <option value="Booked">
            Booked
          </option>

          <option value="Not Interested">
            Not Interested
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