// FILE: src/pages/manager/AssignedClients.js

import {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

import Sidebar from "../../components/Sidebar";
import Select from "react-select";
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
const [showFilters, setShowFilters] =
  useState(false);

const [filters, setFilters] =
  useState({
    status: [],
    project: "",
    createdFrom: "",
    createdTo: ""
  });
const [currentPage, setCurrentPage] =
  useState(1);

const leadsPerPage = 20;
const statusOptions = [
  { value: "New", label: "New" },
  { value: "Interested", label: "Interested" },
  { value: "Followup", label: "Followup" },
  { value: "Site Visit", label: "Site Visit" },
  { value: "Booked", label: "Booked" },
  { value: "Not Interested", label: "Not Interested" }
];

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

 useEffect(() => {

  let filtered = [...clients];

  // SEARCH
  if (search) {

    const txt = search.toLowerCase();

    filtered = filtered.filter((c) =>

      c.name?.toLowerCase().includes(txt) ||

      c.phone?.toLowerCase().includes(txt) ||

      c.project?.toLowerCase().includes(txt) ||

      c.status?.toLowerCase().includes(txt)

    );

  }

  // STATUS
  if (filters.status.length) {

    filtered = filtered.filter((c) =>

      filters.status.some(

        (s) => s.value === c.status

      )

    );

  }

  // PROJECT
  if (filters.project) {

    filtered = filtered.filter(

      (c) => c.project === filters.project

    );

  }

  // CREATED FROM
  if (filters.createdFrom) {

    const from = new Date(filters.createdFrom);

    filtered = filtered.filter(

      (c) => new Date(c.createdAt) >= from

    );

  }

  // CREATED TO
  if (filters.createdTo) {

    const to = new Date(filters.createdTo);

    to.setHours(23,59,59,999);

    filtered = filtered.filter(

      (c) => new Date(c.createdAt) <= to

    );

  }

  setFilteredClients(filtered);

  setCurrentPage(1);

}, [
  clients,
  search,
  filters
]);
  /* =========================================
   PAGINATION
========================================= */

const indexOfLastLead =
  currentPage * leadsPerPage;

const indexOfFirstLead =
  indexOfLastLead - leadsPerPage;

const currentClients =
  filteredClients.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

const totalPages =
  Math.ceil(
    filteredClients.length /
    leadsPerPage
  );

  const projects = [
  ...new Set(
    clients
      .map((c) => c.project)
      .filter(Boolean)
  )
];
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

       <button
  className="btn btn-dark mb-3"
  onClick={() =>
    setShowFilters(!showFilters)
  }
>
  Advanced Search
</button>

{showFilters && (

<div className="filters-box">

  <Select
    isMulti
    placeholder="Status"
    options={statusOptions}
    value={filters.status}
    onChange={(value)=>
      setFilters({
        ...filters,
        status:value
      })
    }
  />

  <select
    value={filters.project}
    onChange={(e)=>
      setFilters({
        ...filters,
        project:e.target.value
      })
    }
  >
    <option value="">
      All Projects
    </option>

    {projects.map((p)=>(
      <option
        key={p}
        value={p}
      >
        {p}
      </option>
    ))}

  </select>

  <input
    type="date"
    value={filters.createdFrom}
    onChange={(e)=>
      setFilters({
        ...filters,
        createdFrom:e.target.value
      })
    }
  />

  <input
    type="date"
    value={filters.createdTo}
    onChange={(e)=>
      setFilters({
        ...filters,
        createdTo:e.target.value
      })
    }
  />

  <button
    className="clear-btn"
    onClick={()=>
      setFilters({
        status:[],
        project:"",
        createdFrom:"",
        createdTo:""
      })
    }
  >
    Clear Filters
  </button>

</div>

)}
          <div className="table-wrapper">

            <table className="table">

              <thead>

                <tr>
               <th>Sr No</th>
               <th>Client Name</th>
               <th>Phone</th>
               <th>Project</th>
               <th>Status</th>
<th>Remark</th>
<th>Followup Date</th>
<th>Site Visit Date</th>
<th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredClients.length > 0 ? (

                  currentClients.map((c, index) => (

                    <tr key={c._id}>
                     <td>
  {indexOfFirstLead + index + 1}
</td>
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

{/* FOLLOWUP DATE */}
<td>
  {c.followup_date
    ? new Date(c.followup_date)
        .toLocaleDateString("en-IN")
    : "-"}
</td>

{/* SITE VISIT DATE */}
<td>
  {c.visitDate
    ? new Date(c.visitDate)
        .toLocaleDateString("en-IN")
    : "-"}
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
                      colSpan="9"
                      className="no-data"
                    >

                      No clients found

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

 <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px"
  }}
>

<button
  className="pagination-btn"
  onClick={() =>
    setCurrentPage(currentPage - 1)
  }
  disabled={currentPage === 1}
>
  Previous
</button>

<span>
  Page {currentPage} of {totalPages}
</span>

<button
  className="pagination-btn"
  onClick={() =>
    setCurrentPage(currentPage + 1)
  }
  disabled={
    currentPage === totalPages
  }
>
  Next
</button>

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

    <label>Followup Date</label>

<input
  type="date"
  value={followupDate}
  onChange={(e) =>
    setFollowupDate(e.target.value)
  }
/>

<label>Site Visit Date</label>

<input
  type="date"
  value={visitDate}
  onChange={(e) =>
    setVisitDate(e.target.value)
  }
/>

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