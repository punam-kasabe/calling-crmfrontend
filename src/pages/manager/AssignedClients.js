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
  const [showModal, setShowModal] =
  useState(false);

const [selectedClient, setSelectedClient] =
  useState(null);

const [remark, setRemark] =
  useState("");

const [followupDate,
  setFollowupDate] =
  useState("");

const [visitDate,
  setVisitDate] =
  useState("");

const openEditModal = (client) => {

  setSelectedClient(client);

  setSelectedStatus(
    client.status || "New"
  );

  setRemark(
    client.remark || ""
  );

  setFollowupDate(
    client.followup_date
      ? client.followup_date.substring(0,10)
      : ""
  );

  setVisitDate(
    client.visitDate
      ? client.visitDate.substring(0,10)
      : ""
  );

  setShowModal(true);

};

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
     CANCEL EDIT
  ========================================= */

  const handleCancel = () => {

    setEditingId(null);

    setSelectedStatus("");

  };

  /* =========================================
     SAVE STATUS
  ========================================= */

  const handleSave = async () => {

  try {

    await axios.put(

      `https://calling-crm-backend-7w52.onrender.com/api/update-status/${selectedClient._id}`,

      {

        status: selectedStatus,

        remark,

        followup_date: followupDate,

        visitDate,

        visit_created:
          selectedStatus === "Site Visit"

      }

    );

    alert("Status Updated ✅");

    setShowModal(false);

    fetchClients();

  }

  catch (err) {

    console.log(err);

    alert("Update Failed ❌");

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
  <span className="status-badge">
    {c.status}
  </span>
</td>

{/* REMARK */}
<td>
  {c.remark || "-"}
</td>


                     <td>
  <button
    className="edit-btn"
    onClick={() =>
      openEditModal(c)
    }
  >
    Edit
  </button>
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

{showModal && (

<div className="modal-overlay">

  <div className="modal-box">

    <h2>
      Update Lead
    </h2>

    <select
      value={selectedStatus}
      onChange={(e) =>
        setSelectedStatus(
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

      <option value="Not Interested">
        Not Interested
      </option>

      <option value="Followup">
        Followup
      </option>

      <option value="Site Visit">
        Site Visit
      </option>

      <option value="Booked">
        Booked
      </option>

    </select>

    <textarea
      placeholder="Remark"
      value={remark}
      onChange={(e) =>
        setRemark(
          e.target.value
        )
      }
    />

    {selectedStatus === "Followup" && (

      <input
        type="date"
        value={followupDate}
        onChange={(e) =>
          setFollowupDate(
            e.target.value
          )
        }
      />

    )}

    {selectedStatus === "Site Visit" && (

      <input
        type="date"
        value={visitDate}
        onChange={(e) =>
          setVisitDate(
            e.target.value
          )
        }
      />

    )}

    <div
      className="modal-actions"
    >

      <button
        onClick={handleSave}
      >
        Save
      </button>

      <button
        onClick={() =>
          setShowModal(false)
        }
      >
        Cancel
      </button>

    </div>

  </div>

</div>

)}


        </div>

      </div>

    </div>

  );

}