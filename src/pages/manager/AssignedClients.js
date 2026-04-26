// FILE: src/pages/manager/AssignedClients.js

import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/manager.css";

export default function AssignedClients() {

  const [isOpen, setIsOpen] = useState(true);

  const [clients, setClients] = useState([]);

  const user =
    JSON.parse(localStorage.getItem("user"));

  /* =========================================
     FETCH CLIENTS
  ========================================= */

  const fetchClients = useCallback(async () => {

    try {

      const res = await axios.get(

        `http://localhost:5000/api/manager-clients?email=${user.email}`

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
            Assigned Clients
          </h1>

          <div className="table-wrapper">

            <table className="table">

              <thead>

                <tr>

                  <th>
                    Client Name
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Status
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
                        {c.phone}
                      </td>

                      <td>
                        {c.project}
                      </td>

                      <td>
                        <span className="status-badge">

                          {c.status}

                        </span>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="4"
                      className="no-data"
                    >

                      No assigned clients found

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