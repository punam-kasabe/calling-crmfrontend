import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function StatusLeads() {

  const { status } = useParams();

  const [isOpen, setIsOpen] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [leads, setLeads] =
    useState([]);

  useEffect(() => {
    fetchLeads();
  }, [status]);

  const fetchLeads = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          `${API}/all-leads`
        );

      const filtered =
        res.data.filter(
          (lead) =>
            lead.status
              ?.toLowerCase()
              .trim() ===
            status
              ?.toLowerCase()
              .trim()
        );

      setLeads(filtered);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="dashboard-page">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div
        className="dashboard-container"
        style={{
          marginLeft:
            isOpen
              ? "240px"
              : "70px"
        }}
      >

        <h2 className="dashboard-title">
          {status.toUpperCase()} Leads
        </h2>

        <div className="chart-card">

          <h5>
            Total Leads ({leads.length})
          </h5>

          {loading ? (

            <p>Loading...</p>

          ) : (

            <div className="table-responsive">

              <table className="table table-bordered">

                <thead>

                  <tr>

                    <th>#</th>

                    <th>Name</th>

                    <th>Phone</th>

                    <th>Project</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {leads.length > 0 ? (

                    leads.map(
                      (
                        lead,
                        index
                      ) => (

                        <tr
                          key={
                            lead._id
                          }
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {lead.name}
                          </td>

                          <td>
                            {lead.phone}
                          </td>

                          <td>
                            {lead.project}
                          </td>

                          <td>
                            {lead.status}
                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        align="center"
                      >
                        No Leads Found
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}