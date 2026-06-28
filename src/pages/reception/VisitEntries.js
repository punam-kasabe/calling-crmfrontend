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
        "https://calling-crm-backend-7w52.onrender.com/api/visits"
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
                <th>Calling By</th>
                <th>Remark</th>
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
  <span
    className={`status ${
      v.visitStatus === "IN_OFFICE"
        ? "inoffice"
        : v.visitStatus === "VISIT_DONE"
        ? "done"
        : v.visitStatus === "FOLLOWUP"
        ? "follow"
        : "booked"
    }`}
  >
    {v.visitStatus}
  </span>
</td>

                  <td>
  <span
    className={`booking ${
      v.bookingStatus === "PENDING"
        ? "pending"
        : v.bookingStatus === "BOOKED"
        ? "booked"
        : "notbooked"
    }`}
  >
    {v.bookingStatus}
  </span>
</td>

                    <td>

                      {v.attendedManager?.name || "-"}

                    </td>

                    <td>
  {Array.isArray(v.calling_by)
    ? v.calling_by.join(", ")
    : v.calling_by || "-"}
</td>

<td className="remark-cell">
  {v.remark || "-"}
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
                    colSpan="9"
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