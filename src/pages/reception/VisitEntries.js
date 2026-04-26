import { useEffect, useState } from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/reception.css";

export default function VisitEntries() {

  const [isOpen, setIsOpen] = useState(true);

  const [visits, setVisits] = useState([]);

  useEffect(() => {

    fetchVisits();

  }, []);

  const fetchVisits = async () => {

    try {

      const res = await axios.get(
        "https://calling-crm-backend-1.onrender.com/api/visits"
      );

      setVisits(res.data);

    }

    catch (err) {

      console.log(err);

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

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <div className="reception-page">

          <h1>Visit Entries</h1>

          <table className="visit-table">

            <thead>

              <tr>

                <th>Client</th>

                <th>Mobile</th>

                <th>Project</th>

                <th>Visit Status</th>

                <th>Booking</th>

                <th>Manager</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              {visits.length > 0 ? (

                visits.map((v) => (

                  <tr key={v._id}>

                    <td>
                      {v.clientName}
                    </td>

                    <td>
                      {v.mobile}
                    </td>

                    <td>
                      {v.project}
                    </td>

                    <td>
                      {v.visitStatus}
                    </td>

                    <td>
                      {v.bookingStatus}
                    </td>

                    <td>

                      {v.attendedManager?.name || "-"}

                    </td>

                    <td>

                      {new Date(
                        v.createdAt
                      ).toLocaleDateString()}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center"
                    }}
                  >

                    No Entries Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}