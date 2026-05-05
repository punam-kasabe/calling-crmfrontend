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
        `http://localhost:5000/api/followups/${user._id}`
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
        `http://localhost:5000/api/leads/${leadId}`,
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

                  <th>#</th>
                  <th>Client Name</th>
                  <th>Mobile</th>
                  <th>Project</th>
                  <th>Next Followup</th>
                  <th>Status</th>
                  <th>Update</th>

                </tr>

              </thead>

              <tbody>

                {followups.map(
                  (lead, index) => (

                    <tr key={lead._id}>

                      <td>{index + 1}</td>

                      <td>{lead.name}</td>

                      <td>{lead.mobile}</td>

                      <td>{lead.project}</td>

                      <td>

                        {lead.followupDate
                          ? new Date(
                              lead.followupDate
                            ).toLocaleDateString()
                          : "N/A"}

                      </td>

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

                        <select
                          value={lead.status}
                          onChange={(e) =>
                            updateFollowupStatus(
                              lead._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="FOLLOWUP">
                            FOLLOWUP
                          </option>

                          <option value="INTERESTED">
                            INTERESTED
                          </option>

                          <option value="VISIT_SCHEDULED">
                            VISIT SCHEDULED
                          </option>

                          <option value="BOOKED">
                            BOOKED
                          </option>

                          <option value="NOT_INTERESTED">
                            NOT INTERESTED
                          </option>

                        </select>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}