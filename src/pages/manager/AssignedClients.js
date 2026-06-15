// FILE: src/pages/manager/AssignedClients.js

import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/assignedClients.css";
export default function AssignedClients() {

  const [isOpen, setIsOpen] = useState(true);

  const [clients, setClients] = useState([]);

  const [filteredClients,
    setFilteredClients] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [editingId,
    setEditingId] =
    useState(null);

  const [selectedStatus,
    setSelectedStatus] =
    useState("");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  /* =========================================
     FETCH CLIENTS
  ========================================= */

  const fetchClients = useCallback(async () => {

    try {

      const res = await axios.get(

        `https://calling-crm-backend-7w52.onrender.com/api/manager-clients?email=${user.email}`

      );

      setClients(res.data);

      setFilteredClients(res.data);

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
     SEARCH FILTER
  ========================================= */

  useEffect(() => {

    const filtered =
      clients.filter((client) => {

        const searchText =
          search.toLowerCase();

        return (

          client.name
            ?.toLowerCase()
            .includes(searchText)

          ||

          client.phone
            ?.toLowerCase()
            .includes(searchText)

          ||

          client.project
            ?.toLowerCase()
            .includes(searchText)

          ||

          client.status
            ?.toLowerCase()
            .includes(searchText)

        );

      });

    setFilteredClients(filtered);

  }, [search, clients]);

  /* =========================================
     START EDIT
  ========================================= */

  const handleEdit = (
    id,
    currentStatus
  ) => {

    setEditingId(id);

    setSelectedStatus(
      currentStatus
    );

  };

  /* =========================================
     CANCEL EDIT
  ========================================= */

  const handleCancel = () => {

    setEditingId(null);

    setSelectedStatus("");

  };

  /* =========================================
     SAVE STATUS
  ========================================= */

  const handleSave = async (id) => {

    try {

     const currentClient =
  clients.find((c) => c._id === id);

await axios.put(
  `https://calling-crm-backend-7w52.onrender.com/api/update-status/${id}`,
  {
    status: selectedStatus,
    remark: currentClient?.remark || ""
  }
);
      alert(
        "Status Updated ✅"
      );

     setClients(prev =>
  prev.map(client =>
    client._id === id
      ? {
          ...client,
          status: selectedStatus,
          remark:
            currentClient?.remark || ""
        }
      : client
  )
);

      setEditingId(null);

    }

    catch (err) {

      console.log(err);

      alert(
        "Update Failed ❌"
      );

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
            Assigned Clients
          </h1>

          {/* SEARCH BAR */}

          <div className="search-box">

            <input
              type="text"
              placeholder="Search by name, phone, project or status..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="search-input"
            />

          </div>

          <div className="table-wrapper">

            <table className="table">

              <thead>

                <tr>

               <th>Client Name</th>
               <th>Phone</th>
               <th>Project</th>
               <th>Status</th>
               <th>Remark</th>
               <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredClients.length > 0 ? (

                  filteredClients.map((c) => (

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
                     
                     
{/* STATUS */}
<td>
  {editingId === c._id ? (
    <select
      value={selectedStatus}
      onChange={(e) =>
        setSelectedStatus(e.target.value)
      }
      className="status-select"
    >
      <option value="New">New</option>
      <option value="Interested">Interested</option>
      <option value="Not Interested">Not Interested</option>
      <option value="Followup">Followup</option>
      <option value="Booked">Booked</option>
    </select>
  ) : (
    <span className="status-badge">
      {c.status}
    </span>
  )}
</td>

{/* REMARK */}
<td>
  {editingId === c._id ? (
    <input
      type="text"
      value={c.remark || ""}
      onChange={(e) => {
        setClients((prev) =>
          prev.map((item) =>
            item._id === c._id
              ? {
                  ...item,
                  remark: e.target.value
                }
              : item
          )
        );
      }}
      className="remark-input"
      placeholder="Enter remark"
    />
  ) : (
    c.remark || "-"
  )}
</td>
                      <td>

                        {editingId === c._id ? (

                          <div className="action-buttons">

                            <button
                              className="save-btn"
                              onClick={() =>
                                handleSave(c._id)
                              }
                            >

                              Save

                            </button>

                            <button
                              className="cancel-btn"
                              onClick={
                                handleCancel
                              }
                            >

                              Cancel

                            </button>

                          </div>

                        ) : (

                          <button
                            className="edit-btn"
                            onClick={() =>
                              handleEdit(
                                c._id,
                                c.status
                              )
                            }
                          >

                            Edit

                          </button>

                        )}

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
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