import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function NewLeads() {

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const fetchLeads = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/all-leads`
      );

      console.log("API Response:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      const filtered = data.filter(
        (lead) =>
          lead?.status?.toLowerCase() === "new"
      );

      setLeads(filtered);

    }

    catch (err) {

      console.error(
        "Fetch Leads Error:",
        err
      );

      setLeads([]);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchLeads();

  }, []);

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

          <h2 className="page-title">
            New Leads
          </h2>

          {loading ? (

            <h4>Loading...</h4>

          ) : (

            <div className="table-wrapper">

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

                  {leads.length > 0 ? (

                    leads.map((lead) => (

                      <tr key={lead._id}>

                        <td>{lead.name}</td>

                        <td>{lead.phone}</td>

                        <td>{lead.project}</td>

                        <td>{lead.status}</td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center"
                        }}
                      >

                        No New Leads Found

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