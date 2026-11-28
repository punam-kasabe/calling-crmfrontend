import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";

import "../../styles/visitentries.css";

export default function VisitEntries() {

  const [isOpen, setIsOpen] = useState(true);
  const [visits, setVisits] = useState([]);
  const [searchMobile, setSearchMobile] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const entriesPerPage = 30;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =========================================================
     SITE VISIT EXECUTIVES
  ========================================================= */

  const siteVisitExecutiveNames = [
    "Harsh",
    "Siddhesh",
    "Chaitanya",
    "Yash",
    "Sushant",
    "Omi"
  ];

  /* =========================================================
     EDIT VISIT STATE
  ========================================================= */

  const [editVisit, setEditVisit] = useState({
    _id: "",
    clientName: "",
    mobile: "",
    project: "",
    visitDate: "",
    clientType: "New",
    department: "",
    source: "",
    status: "New",
    assigned_to: "",

    attendedManager: null,

    calling_by: [],
    attended_by: [],

    site_visit_by: "",
    closing_by: "",

    visitStatus: "IN_OFFICE",
    bookingStatus: "PENDING",

    remark: ""
  });

 /* =========================================================
   EDIT VISIT
========================================================= */

const handleEdit = (visit) => {

  setEditVisit({

    _id: visit._id || "",

    clientName:
      visit.clientName ||
      visit.name ||
      "",

    mobile:
      visit.mobile ||
      visit.phone ||
      "",

    project:
      visit.project ||
      "",

    visitDate:
      visit.visitDate
        ? new Date(visit.visitDate)
            .toISOString()
            .split("T")[0]
        : "",

    clientType:
      visit.clientType ||
      "New",

    department:
      visit.department ||
      "",

    source:
      visit.source ||
      "",

    status:
      visit.status ||
      "New",

    assigned_to:
      visit.assigned_to ||
      visit.assigned_to_email ||
      "",

    attendedManager:
      visit.attendedManager?._id ||
      visit.attendedManager ||
      "",

    calling_by:
      Array.isArray(visit.calling_by)
        ? visit.calling_by
        : [],

    attended_by:
      Array.isArray(visit.attended_by)
        ? visit.attended_by
        : [],

    site_visit_by:
      visit.site_visit_by ||
      visit.siteVisitBy?.email ||
      visit.siteVisitBy?.name ||
      "",

    closing_by:
      visit.closing_by ||
      visit.closingExecutive ||
      "",

    visitStatus:
      visit.visitStatus ||
      "IN_OFFICE",

    bookingStatus:
      visit.bookingStatus ||
      "PENDING",

    remark:
      visit.remark ||
      ""

  });

  setShowEditModal(true);
};


  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {

    fetchVisits();
    fetchUsers();

  }, []);

  /* =========================================================
     FETCH VISITS
  ========================================================= */

  const fetchVisits = async () => {

    try {

      const res = await axios.get(
        "https://calling-crm-backend-7w52.onrender.com/api/visits"
      );

      setVisits(res.data || []);
      setCurrentPage(1);

    } catch (err) {

      console.log(err);

    }

  };

  /* =========================================================
     FETCH USERS
  ========================================================= */

  const fetchUsers = async () => {

    try {

      const res = await axios.get(
        "https://calling-crm-backend-7w52.onrender.com/api/all-users",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setUsers(res.data || []);

    } catch (err) {

      console.log(err);

    }

  };

  /* =========================================================
   HANDLE CHANGE
========================================================= */

const handleChange = (e) => {

  setEditVisit(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));

};

/* =========================================================
   CALLING BY CHANGE
========================================================= */

const handleCallingByChange = (e) => {

  const values = Array.from(
    e.target.selectedOptions,
    option => option.value
  );

  setEditVisit(prev => ({
    ...prev,
    calling_by: values
  }));

};


/* =========================================================
   ATTENDED BY CHANGE
========================================================= */

const handleAttendedByChange = (e) => {

  const values = Array.from(
    e.target.selectedOptions,
    option => option.value
  );

  setEditVisit(prev => ({
    ...prev,
    attended_by: values
  }));

};

/* =========================================================
   UPDATE VISIT
========================================================= */

const updateVisit = async () => {

  try {

    const payload = {

      clientName:
        editVisit.clientName,

      mobile:
        editVisit.mobile,

      project:
        editVisit.project,

      visitDate:
        editVisit.visitDate,

      clientType:
        editVisit.clientType,

      department:
        editVisit.department,

      source:
        editVisit.source,

      status:
        editVisit.status,

      assigned_to:
        editVisit.assigned_to,

      /* =========================
         CALLING BY
      ========================= */

      calling_by:
        Array.isArray(editVisit.calling_by)
          ? editVisit.calling_by
          : [],

      /* =========================
         ATTENDED BY
      ========================= */

      attended_by:
        Array.isArray(editVisit.attended_by)
          ? editVisit.attended_by
          : [],

      /* =========================
         SITE VISIT BY
      ========================= */

      site_visit_by:
        editVisit.site_visit_by || "",

      /* =========================
         CLOSING BY
      ========================= */

      closing_by:
        editVisit.closing_by || "",

      /* =========================
         VISIT STATUS
      ========================= */

      visitStatus:
        editVisit.visitStatus,

      /* =========================
         BOOKING STATUS
      ========================= */

      bookingStatus:
        editVisit.bookingStatus,

      /* =========================
         REMARK
      ========================= */

      remark:
        editVisit.remark,

      /* =========================
         ASSIGNED MANAGER
      ========================= */

      attendedManager:
        editVisit.attendedManager?._id ||
        editVisit.attendedManager ||
        ""

    };

    console.log(
      "UPDATE VISIT PAYLOAD:",
      payload
    );

    await axios.put(
      `https://calling-crm-backend-7w52.onrender.com/api/update-visit/${editVisit._id}`,
      payload
    );

    alert("Visit Updated Successfully");

    setShowEditModal(false);

    fetchVisits();

  }

  catch (err) {

    console.log(
      "UPDATE VISIT ERROR:",
      err
    );

    alert(
      err.response?.data?.message ||
      "Visit Update Failed"
    );

  }

};

/* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = async (e) => {

    const value = e.target.value;

    setSearchMobile(value);

    if (value.trim().length < 2) {

      setSuggestions([]);

      return;

    }

    try {

      const res = await axios.get(
        `https://calling-crm-backend-7w52.onrender.com/api/search-suggestions/${value}`
      );

      setSuggestions(res.data || []);

    } catch (err) {

      console.log(err);

    }

  };

  /* =========================================================
     SEARCH VISIT
  ========================================================= */

  const searchVisit = async (value = "") => {

    const search =
      (value || searchMobile).trim();

    if (!search) {

      fetchVisits();

      return;

    }

    try {

      const res = await axios.get(
        `https://calling-crm-backend-7w52.onrender.com/api/search-client-details/${encodeURIComponent(search)}`
      );

      setVisits([res.data]);

      setCurrentPage(1);

      setSuggestions([]);

    } catch (err) {

      alert("Client Not Found");

    }

  };

  /* =========================================================
     DATE FILTER
  ========================================================= */

  const filteredVisits = visits.filter((v) => {

    if (!startDate && !endDate) {

      return true;

    }

    const visitDate =
      v.visitDate ||
      v.createdAt ||
      v.created_date;

    if (!visitDate) {

      return false;

    }

    const date =
      new Date(visitDate);

    if (startDate) {

      const start =
        new Date(startDate);

      start.setHours(
        0,
        0,
        0,
        0
      );

      if (date < start) {

        return false;

      }

    }

    if (endDate) {

      const end =
        new Date(endDate);

      end.setHours(
        23,
        59,
        59,
        999
      );

      if (date > end) {

        return false;

      }

    }

    return true;

  });

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages =
    Math.ceil(
      filteredVisits.length /
      entriesPerPage
    );

  const startIndex =
    (currentPage - 1) *
    entriesPerPage;

  const endIndex =
    startIndex +
    entriesPerPage;

  const currentVisits =
    filteredVisits.slice(
      startIndex,
      endIndex
    );

  /* =========================================================
     EXPORT EXCEL
  ========================================================= */

  const exportToExcel = () => {

    if (!visits || visits.length === 0) {

      alert(
        "No visit entries available to export."
      );

      return;

    }

    const excelData =
      filteredVisits.map(
        (v, index) => ({

          "Sr No":
            index + 1,

          "Client Name":
            v.clientName ||
            v.name ||
            "-",

          "Mobile":
            v.mobile ||
            v.phone ||
            "-",

          "Project":
            v.project ||
            "-",

          "Client Type":
            v.clientType ||
            "New",

          "Calling By":
            Array.isArray(
              v.calling_by
            )
              ? v.calling_by.join(", ")
              : v.assignedTo ||
                v.calling_by ||
                "-",

          "Attending":
            v.attended_by
              ? Array.isArray(v.attended_by)
                ? v.attended_by
                    .map(email => {

                      const user =
                        users.find(
                          u =>
                            u.email ===
                            email
                        );

                      return (
                        user?.name ||
                        email
                      );

                    })
                    .join(", ")
                : v.attended_by
              : "-",

          "Site Visit By":
            v.site_visit_by ||
            v.siteVisitBy?.name ||
            v.siteVisitBy?.email ||
            "-",

          "Closing By":
            v.closing_by ||
            v.closingExecutive ||
            "-",

          "Remark":
            v.remark ||
            "-",

          "Visit Date":
            v.visitDate
              ? new Date(
                  v.visitDate
                ).toLocaleDateString(
                  "en-GB"
                )
              : "-",

          "Created Date":
            v.createdAt ||
            v.created_date
              ? new Date(
                  v.createdAt ||
                  v.created_date
                ).toLocaleDateString(
                  "en-GB"
                )
              : "-"

        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Visit Entries"
    );

    worksheet["!cols"] = [

      { wch: 8 },
      { wch: 28 },
      { wch: 15 },
      { wch: 18 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 }

    ];

    XLSX.writeFile(
      workbook,
      `Visit_Entries_${new Date()
        .toISOString()
        .split("T")[0]
      }.xlsx`
    );

  };

  /* =========================================================
     RETURN
  ========================================================= */

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
          isOpen
            ? "shifted"
            : "full"
        }`}
      >

        <div className="reception-page">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="visit-header">

            <h1>
              Visit Entries
            </h1>

            <button
              className="export-excel-btn"
              onClick={
                exportToExcel
              }
            >
              📊 Export Excel
            </button>

          </div>

          {/* =================================================
              DATE FILTER
          ================================================= */}

          <div className="date-filter-area">

            <div className="date-filter-group">

              <label>
                Start Date
              </label>

              <input
                type="date"
                value={
                  startDate
                }
                onChange={(e) => {

                  setStartDate(
                    e.target.value
                  );

                  setCurrentPage(
                    1
                  );

                }}
              />

            </div>

            <div className="date-filter-group">

              <label>
                End Date
              </label>

              <input
                type="date"
                value={
                  endDate
                }
                min={
                  startDate ||
                  undefined
                }
                onChange={(e) => {

                  setEndDate(
                    e.target.value
                  );

                  setCurrentPage(
                    1
                  );

                }}
              />

            </div>

            <button
              className="date-reset-btn"
              onClick={() => {

                setStartDate("");
                setEndDate("");
                setCurrentPage(1);

              }}
            >
              Clear Date
            </button>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="search-area">

            <div className="search-box">

              <input
                type="text"
                placeholder="Search by Mobile or Client Name"
                value={
                  searchMobile
                }
                onChange={
                  handleSearchChange
                }
                onKeyDown={(e) => {

                  if (
                    e.key ===
                    "Enter"
                  ) {

                    searchVisit();

                  }

                }}
              />

              {suggestions.length >
                0 && (

                <div className="search-suggestions">

                  {suggestions.map(
                    (item) => (

                      <div
                        key={
                          item._id
                        }
                        className="suggestion-item"
                        onClick={() => {

                          setSearchMobile(
                            item.name
                          );

                          setSuggestions(
                            []
                          );

                          searchVisit(
                            item.phone ||
                            item.name
                          );

                        }}
                      >

                        <div className="s-name">

                          {
                            item.name
                          }

                        </div>

                        <div className="s-phone">

                          {
                            item.phone
                          }

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            <button
              className="search-btn"
              onClick={
                searchVisit
              }
            >
              Search
            </button>

            <button
              className="reset-btn"
              onClick={() => {

                setSearchMobile("");
                setSuggestions([]);
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);

                fetchVisits();

              }}
            >
              Reset
            </button>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <table className="visit-table">

            <thead>

              <tr>

                <th>
                  Client
                </th>

                <th>
                  Mobile
                </th>

                <th>
                  Project
                </th>

                <th>
                  Client Type
                </th>

                <th>
                  Calling By
                </th>

                <th>
                  Attending
                </th>

                <th>
                  Site Visit By
                </th>

                <th>
                  Closing By
                </th>

                <th>
                  Remark
                </th>

                <th>
                  Visit Date
                </th>

                <th>
                  Created Date
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {currentVisits.length >
              0 ? (

                currentVisits.map(
                  (v) => (

                    <tr
                      key={
                        v._id
                      }
                    >

                      {/* CLIENT */}

                      <td>
                        {
                          v.clientName ||
                          v.name ||
                          "-"
                        }
                      </td>

                      {/* MOBILE */}

                      <td>
                        {
                          v.mobile ||
                          v.phone ||
                          "-"
                        }
                      </td>

                      {/* PROJECT */}

                      <td>
                        {
                          v.project ||
                          "-"
                        }
                      </td>

                      {/* CLIENT TYPE */}

                      <td>

                        {
                          (
                            v.clientType ||
                            ""
                          ) ===
                          "Old"

                            ? "🟠 Old Client"

                            : "🟢 New Client"

                        }

                      </td>

                      {/* CALLING BY */}

                      <td>

                        {Array.isArray(
                          v.calling_by
                        )
                          ? v.calling_by.join(
                              ", "
                            )
                          : v.assignedTo ||
                            v.calling_by ||
                            "-"}

                      </td>

                      {/* ATTENDING */}

                      <td>

                        {Array.isArray(
                          v.attended_by
                        )

                          ? v.attended_by
                              .map(
                                email => {

                                  const user =
                                    users.find(
                                      u =>
                                        u.email ===
                                        email
                                    );

                                  return (
                                    user?.name ||
                                    email
                                  );

                                }
                              )
                              .join(
                                ", "
                              )

                          : (
                              v.attendedManager?.name ||
                              v.attendedManager?.email ||
                              v.assigned_manager ||
                              v.attended_by ||
                              "-"
                            )}

                      </td>

                      {/* SITE VISIT BY */}

                      <td>

                        {(() => {

                          const siteVisitValue =
                            v.site_visit_by ||
                            v.siteVisitBy?.email ||
                            v.siteVisitBy?.name ||
                            "";

                          const user =
                            users.find(
                              u =>
                                u.email ===
                                siteVisitValue
                            );

                          return (
                            user?.name ||
                            siteVisitValue ||
                            "-"
                          );

                        })()}

                      </td>

                      {/* CLOSING BY */}

                      <td>

                        {(() => {

                          const closingValue =
                            v.closing_by ||
                            v.closingExecutive ||
                            "";

                          const user =
                            users.find(
                              u =>
                                u.email ===
                                closingValue
                            );

                          return (
                            user?.name ||
                            closingValue ||
                            "-"
                          );

                        })()}

                      </td>

                      {/* REMARK */}

                      <td
                        className="remark-cell"
                      >
                        {
                          v.remark ||
                          "-"
                        }
                      </td>

                      {/* VISIT DATE */}

                      <td>

                        {v.visitDate

                          ? new Date(
                              v.visitDate
                            ).toLocaleDateString(
                              "en-GB"
                            )

                          : "-"}

                      </td>

                      {/* CREATED DATE */}

                      <td>

                        {v.createdAt ||
                        v.created_date

                          ? new Date(
                              v.createdAt ||
                              v.created_date
                            ).toLocaleDateString(
                              "en-GB"
                            )

                          : "-"}

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(
                              v
                            )
                          }
                        >
                          Edit
                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="12"
                    style={{
                      textAlign:
                        "center"
                    }}
                  >
                    No Entries Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages >
            1 && (

            <div className="pagination">

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage(
                    prev =>
                      prev - 1
                  )
                }
                disabled={
                  currentPage ===
                  1
                }
              >
                Previous
              </button>

              <span className="pagination-info">

                Page{" "}
                {
                  currentPage
                }{" "}
                of{" "}
                {
                  totalPages
                }

              </span>

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage(
                    prev =>
                      prev + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
              >
                Next
              </button>

            </div>

          )}

          {/* =================================================
              EDIT MODAL
          ================================================= */}

          {showEditModal && (

            <div className="modal-overlay">

              <div className="edit-modal">

                <h2>
                  Edit Visit
                </h2>

                <div className="modal-form">

                  {/* CLIENT NAME */}

                  <div className="form-group">

                    <label>
                      Client Name
                    </label>

                    <input
                      name="clientName"
                      value={
                        editVisit.clientName ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                  {/* MOBILE */}

                  <div className="form-group">

                    <label>
                      Mobile
                    </label>

                    <input
                      name="mobile"
                      value={
                        editVisit.mobile ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                  {/* PROJECT */}

                  <div className="form-group">

                    <label>
                      Project
                    </label>

                    <select
                      name="project"
                      value={
                        editVisit.project ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Project
                      </option>

                      <option value="99villa">
                        99villa
                      </option>

                      <option value="Karjat">
                        Karjat
                      </option>

                      <option value="Alibaug Plot">
                        Alibaug
                      </option>

                      <option value="Pen">
                        Pen
                      </option>

                      <option value="MahaMumbai">
                        MahaMumbai
                      </option>

                    </select>

                  </div>

                  {/* CLIENT TYPE */}

                  <div className="form-group">

                    <label>
                      Client Type
                    </label>

                    <select
                      name="clientType"
                      value={
                        editVisit.clientType ||
                        "New"
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="New">
                        New Client
                      </option>

                      <option value="Old">
                        Old Client
                      </option>

                    </select>

                  </div>

                  {/* VISIT DATE */}

                  <div className="form-group">

                    <label>
                      Visit Date
                    </label>

                    <input
                      type="date"
                      name="visitDate"
                      value={
                        editVisit.visitDate ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* DEPARTMENT */}

                  <div className="form-group">

                    <label>
                      Department
                    </label>

                    <select
                      name="department"
                      value={
                        editVisit.department ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Department
                      </option>

                      <option value="Sales & Marketing">
                        Sales & Marketing
                      </option>

                      <option value="HR/Admin">
                        HR/Admin
                      </option>

                      <option value="TeleCaller">
                        TeleCaller
                      </option>

                      <option value="Aasma Ma'am">
                        Aasma Ma'am
                      </option>

                      <option value="Nilesh Sir">
                        Nilesh Sir
                      </option>

                    </select>

                  </div>

                  {/* SOURCE */}

                  <div className="form-group">

                    <label>
                      Source
                    </label>

                    <select
                      name="source"
                      value={
                        editVisit.source ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Source
                      </option>

                      <option value="Facebook">
                        Facebook
                      </option>

                      <option value="Instagram">
                        Instagram
                      </option>

                      <option value="Google Ads">
                        Google Ads
                      </option>

                      <option value="99acres">
                        99acres
                      </option>

                      <option value="MagicBricks">
                        MagicBricks
                      </option>

                      <option value="Housing">
                        Housing
                      </option>

                      <option value="Website">
                        Website
                      </option>

                      <option value="WhatsApp">
                        WhatsApp
                      </option>

                      <option value="JustDial">
                        JustDial
                      </option>

                      <option value="Reference">
                        Reference
                      </option>

                      <option value="Hoarding">
                        Hoarding
                      </option>

                      <option value="Newspaper">
                        Newspaper
                      </option>

                      <option value="Walk-In">
                        Walk-In
                      </option>

                      <option value="Call Center">
                        Call Center
                      </option>

                      <option value="Property Expo">
                        Property Expo
                      </option>

                      <option value="YouTube">
                        YouTube
                      </option>

                    </select>

                  </div>

                  {/* ASSIGN TO */}

                  <div className="form-group">

                    <label>
                      Assign To
                    </label>

                    <select
                      name="assigned_to"
                      value={
                        editVisit.assigned_to ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Executive
                      </option>

                      {users
                        .filter(
                          u =>
                            u.role ===
                            "executive"
                        )
                        .map(
                          u => (

                            <option
                              key={
                                u._id
                              }
                              value={
                                u.email
                              }
                            >
                              {
                                u.name
                              }
                            </option>

                          )
                        )}

                    </select>

                  </div>

                  {/* CALLING BY */}

                  <div className="form-group">

                    <label>
                      Calling By
                    </label>

                    <select
                      multiple
                      value={
                        Array.isArray(
                          editVisit.calling_by
                        )
                          ? editVisit.calling_by
                          : []
                      }
                      onChange={
                        handleCallingByChange
                      }
                      style={{
                        minHeight:
                          "100px"
                      }}
                    >

                      {users
                        .filter(
                          u =>
                            u.role ===
                            "executive"
                        )
                        .map(
                          u => (

                            <option
                              key={
                                u._id
                              }
                              value={
                                u.name
                              }
                            >
                              {
                                u.name
                              }
                            </option>

                          )
                        )}

                    </select>

                  </div>

                  {/* ATTENDING BY */}

                  <div className="form-group">

                    <label>
                      Attended By
                    </label>

                    <select
                      multiple
                      value={
                        Array.isArray(
                          editVisit.attended_by
                        )
                          ? editVisit.attended_by
                          : []
                      }
                      onChange={
                        handleAttendedByChange
                      }
                      style={{
                        minHeight:
                          "100px"
                      }}
                    >

                      {users
                        .filter(
                          u =>
                            u.role ===
                              "executive" ||
                            u.role ===
                              "manager"
                        )
                        .map(
                          u => (

                            <option
                              key={
                                u._id
                              }
                              value={
                                u.email
                              }
                            >
                              {
                                u.name
                              }
                            </option>

                          )
                        )}

                    </select>

                  </div>

                  {/* SITE VISIT BY */}

                  <div className="form-group">

                    <label>
                      Site Visit By
                    </label>

                    <select
                      name="site_visit_by"
                      value={
                        editVisit.site_visit_by ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Site Visit Executive
                      </option>

                      {users
                        .filter(
                          u =>
                            u.role ===
                              "executive" &&
                            siteVisitExecutiveNames.includes(
                              u.name
                            )
                        )
                        .map(
                          u => (

                            <option
                              key={
                                u._id
                              }
                              value={
                                u.email
                              }
                            >
                              {
                                u.name
                              }
                            </option>

                          )
                        )}

                    </select>

                  </div>

                  {/* CLOSING BY */}

                  <div className="form-group">

                    <label>
                      Closing By
                    </label>

                    <select
                      name="closing_by"
                      value={
                        editVisit.closing_by ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Closing Executive
                      </option>

                      {users
                        .filter(
                          u =>
                            u.role ===
                            "executive"
                        )
                        .map(
                          u => (

                            <option
                              key={
                                u._id
                              }
                              value={
                                u.email
                              }
                            >
                              {
                                u.name
                              }
                            </option>

                          )
                        )}

                    </select>

                  </div>

                  {/* ASSIGNED MANAGER */}

                  <div className="form-group">

                    <label>
                      Assigned Manager
                    </label>

                    <select
                      name="attendedManager"
                      value={
                        editVisit
                          .attendedManager?._id ||
                        editVisit
                          .attendedManager ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="">
                        Select Manager
                      </option>

                      {users
                        .filter(
                          u =>
                            u.role ===
                              "manager" ||
                            u.role ===
                              "executive"
                        )
                        .map(
                          u => (

                            <option
                              key={
                                u._id
                              }
                              value={
                                u._id
                              }
                            >
                              {
                                u.name
                              }
                            </option>

                          )
                        )}

                    </select>

                  </div>

                  {/* LEAD STATUS */}

                  <div className="form-group">

                    <label>
                      Lead Status
                    </label>

                    <select
                      name="status"
                      value={
                        editVisit.status ||
                        "New"
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="New">
                        New
                      </option>

                      <option value="Fresh">
                        Fresh
                      </option>

                      <option value="Interested">
                        Interested
                      </option>

                      <option value="Followup">
                        Followup
                      </option>

                      <option value="Not Interested">
                        Not Interested
                      </option>

                      <option value="Visit Done">
                        Visit Done
                      </option>

                      <option value="Booked">
                        Booked
                      </option>

                    </select>

                  </div>

                  {/* VISIT STATUS */}

                  <div className="form-group full-width">

                    <label>
                      Visit Status
                    </label>

                    <select
                      name="visitStatus"
                      value={
                        editVisit.visitStatus ||
                        "IN_OFFICE"
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="IN_OFFICE">
                        In Office
                      </option>

                      <option value="VISIT_PENDING">
                        Site Visit Pending
                      </option>

                      <option value="VISIT_DONE">
                        Site Visit Done
                      </option>

                      <option value="DECISION_PENDING">
                        Decision Pending
                      </option>

                      <option value="FOLLOWUP">
                        Follow Up
                      </option>

                      <option value="BOOKED">
                        Booked
                      </option>

                      <option value="NOT_BOOKED">
                        Not Booked
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>

                    </select>

                  </div>

                  {/* BOOKING STATUS */}

                  <div className="form-group full-width">

                    <label>
                      Booking Status
                    </label>

                    <select
                      name="bookingStatus"
                      value={
                        editVisit.bookingStatus ||
                        "PENDING"
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="DECISION_PENDING">
                        Decision Pending
                      </option>

                      <option value="NEGOTIATION">
                        Negotiation
                      </option>

                      <option value="BOOKED">
                        Booked
                      </option>

                      <option value="TOKEN_RECEIVED">
                        Token Received
                      </option>

                      <option value="LOAN_PROCESS">
                        Loan Process
                      </option>

                      <option value="REGISTRATION_PENDING">
                        Registration Pending
                      </option>

                      <option value="REGISTERED">
                        Registered
                      </option>

                      <option value="NOT_BOOKED">
                        Not Booked
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>

                    </select>

                  </div>

                  {/* REMARK */}

                  <div className="form-group full-width">

                    <label>
                      Remark
                    </label>

                    <textarea
                      name="remark"
                      value={
                        editVisit.remark ||
                        ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

                {/* MODAL BUTTONS */}

                <div className="modal-buttons">

                  <button
                    className="save-btn"
                    onClick={
                      updateVisit
                    }
                  >
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() =>
                      setShowEditModal(
                        false
                      )
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