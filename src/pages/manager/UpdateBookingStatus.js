// FILE: src/pages/manager/UpdateBookingStatus.js

import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/manager.css";

export default function UpdateBookingStatus() {

  const [isOpen, setIsOpen] = useState(true);

  const [clients, setClients] = useState([]);

  const [loadingId, setLoadingId] =
    useState(null);

  const user =
    JSON.parse(localStorage.getItem("user"));

  /* =========================================
     FETCH CLIENTS
  ========================================= */

  const fetchClients = useCallback(async () => {

    try {

      const res = await axios.get(

        `https://calling-crm-backend-1.onrender.com/api/manager-clients?email=${user.email}`

      );

      setClients(res.data);

    }

    catch (err) {

      console.log(err);

    }

  }, [user.email]);

  /* =========================================
     LOAD CLIENTS
  ========================================= */

  useEffect(() => {

    fetchClients();

  }, [fetchClients]);

  /* =========================================
     UPDATE STATUS
  ========================================= */

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      setLoadingId(id);

      await axios.put(

        `https://calling-crm-backend-1.onrender.com/api/update-status/${id}`,

        {
          status
        }

      );

      await fetchClients();

    }

    catch (err) {

      console.log(err);

      alert("Status update failed ❌");

    }

    finally {

      setLoadingId(null);

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

          <h1 className="page-title">

            Update Booking Status

          </h1>

          <div className="table-wrapper">

            <table className="table">

              <thead>

                <tr>

                  <th>
                    Client Name
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Current Status
                  </th>

                  <th>
                    Update Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {clients.length > 0 ? (

                  clients.map((c) => (

                    <tr key={c._id}>

                      <td>
                        {c.name}
                      </td>

                      <td>
                        {c.project}
                      </td>

                      <td>

                        <span className="status-badge">

                          {c.status}

                        </span>

                      </td>

                      <td>

                        <select

                          className="status-select"

                          value={c.status}

                          disabled={
                            loadingId === c._id
                          }

                          onChange={(e) =>
                            updateStatus(
                              c._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="New">
                            New
                          </option>

                          <option value="Interested">
                            Interested
                          </option>

                          <option value="Followup">
                            Followup
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

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="no-data"
                    >

                      No clients found

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