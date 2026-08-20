import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import "../../styles/pendingLeadReport.css";
import Sidebar from "../../components/Sidebar";

/* =========================================================
   API
========================================================= */

const RAW_API_URL =
  process.env.REACT_APP_API_URL ||
  "https://calling-crm-backend-7w52.onrender.com";

const API_BASE_URL =
  RAW_API_URL
    .replace(/\/+$/, "")
    .replace(/\/api$/, "") + "/api";

/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

/* =========================================================
   INITIAL
========================================================= */

const getInitial = (name = "") => {
  const cleanName = String(name).trim();

  if (!cleanName) {
    return "?";
  }

  return cleanName.charAt(0).toUpperCase();
};

/* =========================================================
   EXECUTIVE NAME
========================================================= */

const getExecutiveName = (lead) => {
  return (
    lead?.assignedTo ||
    lead?.assigned_to_name ||
    lead?.assignedToName ||
    lead?.executiveName ||
    lead?.closingExecutive ||
    lead?.assigned_to ||
    lead?.assigned_to_email ||
    lead?.assignedToEmail ||
    "Unassigned"
  );
};

/* =========================================================
   EXECUTIVE EMAIL
========================================================= */

const getExecutiveEmail = (lead) => {
  return (
    lead?.assigned_to_email ||
    lead?.assigned_to ||
    lead?.assignedToEmail ||
    lead?.assigned_to_email_address ||
    ""
  );
};

/* =========================================================
   LEAD NAME
========================================================= */

const getLeadName = (lead) => {
  return (
    lead?.name ||
    lead?.fullName ||
    lead?.leadName ||
    lead?.Name ||
    "Unnamed Lead"
  );
};

/* =========================================================
   PHONE
========================================================= */

const getLeadPhone = (lead) => {
  return (
    lead?.phone ||
    lead?.mobile ||
    lead?.mobileNumber ||
    lead?.Phone ||
    ""
  );
};

/* =========================================================
   STATUS
========================================================= */

const getLeadStatus = (lead) => {
  return (
    lead?.status ||
    lead?.Status ||
    "Unknown"
  );
};

/* =========================================================
   PENDING DATE
========================================================= */

const getPendingDate = (lead) => {
  /*
    Priority:

    1. assignedAt
    2. assigned_at
    3. assignedDate
    4. assigned_date
    5. createdAt
    6. created_date
    7. Created at
  */

  const value =
    lead?.assignedAt ||
    lead?.assigned_at ||
    lead?.assignedDate ||
    lead?.assigned_date ||
    lead?.createdAt ||
    lead?.created_date ||
    lead?.["Created at"] ||
    null;

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

/* =========================================================
   CALCULATE PENDING DAYS
========================================================= */

const calculatePendingDays = (lead) => {
  const pendingDate = getPendingDate(lead);

  if (!pendingDate) {
    return 0;
  }

  const now = new Date();

  const start = new Date(
    pendingDate.getFullYear(),
    pendingDate.getMonth(),
    pendingDate.getDate()
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diff =
    today.getTime() -
    start.getTime();

  const days = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, days);
};

/* =========================================================
   AGE BUCKET
========================================================= */

const getAgeBucket = (days) => {
  if (days <= 1) {
    return "0–1 Day";
  }

  if (days <= 3) {
    return "2–3 Days";
  }

  if (days <= 7) {
    return "4–7 Days";
  }

  if (days <= 15) {
    return "8–15 Days";
  }

  return "15+ Days";
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================================================
   COMPONENT
========================================================= */

const PendingLeadReport = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedExecutive, setSelectedExecutive] =
    useState("all");

  const [selectedAge, setSelectedAge] =
    useState("all");

  const [selectedStatus, setSelectedStatus] =
    useState("all");

  const [selectedLead, setSelectedLead] =
    useState(null);

  const [sortDirection, setSortDirection] =
    useState("desc");

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  /* =======================================================
     FETCH PENDING LEADS
  ======================================================= */

  const fetchPendingLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser =
        localStorage.getItem("user");

      const user = storedUser
        ? JSON.parse(storedUser)
        : {};

      if (!user?.email) {
        setError(
          "Logged-in user email सापडला नाही. पुन्हा login करा."
        );

        setLeads([]);

        return;
      }

      const email = String(user.email)
        .trim()
        .toLowerCase();

      const params = new URLSearchParams();

      params.append("email", email);

      /*
        IMPORTANT:

        Previously request was:

        ${API_URL}/pending-leads-report

        which could become:

        https://calling-crm-backend-7w52.onrender.com/pending-leads-report

        Now we use API_BASE_URL:

        https://calling-crm-backend-7w52.onrender.com/api/pending-leads-report
      */

      const endpoint =
        `${API_BASE_URL}/pending-leads-report?${params.toString()}`;

      console.log(
        "Pending Lead Report API:",
        endpoint
      );

    const response = await fetch(endpoint, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
});

console.log("Pending Lead API URL:", endpoint);
console.log("Pending Lead API Status:", response.status);
console.log(
  "Pending Lead API Content-Type:",
  response.headers.get("content-type")
);

const contentType =
  response.headers.get("content-type") || "";

const responseText = await response.text();

console.log(
  "Pending Lead API Raw Response:",
  responseText.substring(0, 500)
);

if (!contentType.includes("application/json")) {
  throw new Error(
    `Backend JSON ऐवजी ${contentType || "unknown response"} देत आहे. Status: ${response.status}`
  );
}

let data;

try {
  data = JSON.parse(responseText);
} catch (parseError) {
  console.error(
    "JSON Parse Error:",
    parseError
  );

  console.error(
    "Raw Backend Response:",
    responseText
  );

  throw new Error(
    "Backend ने valid JSON response दिला नाही."
  );
}

if (!response.ok) {
  throw new Error(
    data?.message ||
      `Server returned ${response.status}`
  );
}

if (data?.success === false) {
  throw new Error(
    data?.message ||
      "Pending leads load failed"
  );
}

const apiLeads =
  Array.isArray(data)
    ? data
    : Array.isArray(data?.leads)
    ? data.leads
    : Array.isArray(data?.data)
    ? data.data
    : [];

setLeads(apiLeads);

console.log(
  "Pending Lead Report Loaded:",
  apiLeads.length
);




      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Server returned ${response.status}`
        );
      }

      /*
        Supported backend responses:

        {
          success: true,
          count: 10,
          leads: [...]
        }

        OR

        [...]

        OR

        {
          data: [...]
        }
      */

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "Pending leads load failed"
        );
      }

      const apiLeads =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.leads)
          ? data.leads
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setLeads(apiLeads);

      console.log(
        "Pending Lead Report Loaded:",
        apiLeads.length
      );
    } catch (err) {
      console.error(
        "Pending Lead Report Error:",
        err
      );

      setError(
        err?.message ||
          "Pending lead data load झाला नाही."
      );

      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    fetchPendingLeads();
  }, [fetchPendingLeads]);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPendingLeads();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchPendingLeads]);

  /* =======================================================
     ENRICH LEADS
  ======================================================= */

  const processedLeads = useMemo(() => {
    return leads.map((lead) => {
      const pendingDays =
        calculatePendingDays(lead);

      return {
        ...lead,

        _executiveName:
          getExecutiveName(lead),

        _executiveEmail:
          getExecutiveEmail(lead),

        _leadName:
          getLeadName(lead),

        _phone:
          getLeadPhone(lead),

        _status:
          getLeadStatus(lead),

        _pendingDate:
          getPendingDate(lead),

        _pendingDays:
          pendingDays,

        _ageBucket:
          getAgeBucket(pendingDays),
      };
    });
  }, [leads]);

  /* =======================================================
     EXECUTIVE LIST
  ======================================================= */

  const executives = useMemo(() => {
    const map = new Map();

    processedLeads.forEach((lead) => {
      const name =
        lead._executiveName ||
        "Unassigned";

      const email =
        lead._executiveEmail ||
        "";

      const key =
        `${name}|||${email}`;

      if (!map.has(key)) {
        map.set(key, {
          name,
          email,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );
  }, [processedLeads]);

  /* =======================================================
     STATUS LIST
  ======================================================= */

  const statuses = useMemo(() => {
    const statusSet = new Set();

    processedLeads.forEach((lead) => {
      if (lead._status) {
        statusSet.add(lead._status);
      }
    });

    return Array.from(statusSet).sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, [processedLeads]);

  /* =======================================================
     FILTERED LEADS
  ======================================================= */

  const filteredLeads = useMemo(() => {
    const searchValue =
      normalizeText(search);

    let result =
      processedLeads.filter((lead) => {
        /* =========================
           SEARCH
        ========================= */

        if (searchValue) {
          const searchableText = [
            lead._leadName,
            lead._phone,
            lead._status,
            lead._executiveName,
            lead._executiveEmail,
            lead?.project,
            lead?.source,
            lead?.city,
            lead?.email,
          ]
            .map(normalizeText)
            .join(" ");

          if (
            !searchableText.includes(
              searchValue
            )
          ) {
            return false;
          }
        }

        /* =========================
           EXECUTIVE FILTER
        ========================= */

        if (
          selectedExecutive !== "all"
        ) {
          const executiveKey =
            `${lead._executiveName}|||${lead._executiveEmail}`;

          if (
            executiveKey !==
            selectedExecutive
          ) {
            return false;
          }
        }

        /* =========================
           AGE FILTER
        ========================= */

        if (
          selectedAge !== "all"
        ) {
          const days =
            lead._pendingDays;

          if (
            selectedAge === "1+" &&
            days <= 1
          ) {
            return false;
          }

          if (
            selectedAge === "3+" &&
            days <= 3
          ) {
            return false;
          }

          if (
            selectedAge === "7+" &&
            days <= 7
          ) {
            return false;
          }

          if (
            selectedAge === "15+" &&
            days <= 15
          ) {
            return false;
          }
        }

        /* =========================
           STATUS FILTER
        ========================= */

        if (
          selectedStatus !== "all" &&
          normalizeText(
            lead._status
          ) !==
            normalizeText(
              selectedStatus
            )
        ) {
          return false;
        }

        return true;
      });

    /* =========================
       SORT
    ========================= */

    result.sort((a, b) => {
      if (
        sortDirection === "asc"
      ) {
        return (
          a._pendingDays -
          b._pendingDays
        );
      }

      return (
        b._pendingDays -
        a._pendingDays
      );
    });

    return result;
  }, [
    processedLeads,
    search,
    selectedExecutive,
    selectedAge,
    selectedStatus,
    sortDirection,
  ]);

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const total =
      processedLeads.length;

    const over3 =
      processedLeads.filter(
        (lead) =>
          lead._pendingDays > 3
      ).length;

    const over7 =
      processedLeads.filter(
        (lead) =>
          lead._pendingDays > 7
      ).length;

    const over15 =
      processedLeads.filter(
        (lead) =>
          lead._pendingDays > 15
      ).length;

    const today =
      processedLeads.filter(
        (lead) =>
          lead._pendingDays <= 1
      ).length;

    return {
      total,
      today,
      over3,
      over7,
      over15,
    };
  }, [processedLeads]);

  /* =======================================================
     EXECUTIVE SUMMARY
  ======================================================= */

  const executiveSummary =
    useMemo(() => {
      const map = new Map();

      processedLeads.forEach(
        (lead) => {
          const name =
            lead._executiveName ||
            "Unassigned";

          const email =
            lead._executiveEmail ||
            "";

          const key =
            `${name}|||${email}`;

          if (!map.has(key)) {
            map.set(key, {
              name,
              email,
              total: 0,
              zeroOne: 0,
              twoThree: 0,
              fourSeven: 0,
              eightFifteen: 0,
              fifteenPlus: 0,
            });
          }

          const item =
            map.get(key);

          item.total += 1;

          if (
            lead._pendingDays <= 1
          ) {
            item.zeroOne += 1;
          } else if (
            lead._pendingDays <= 3
          ) {
            item.twoThree += 1;
          } else if (
            lead._pendingDays <= 7
          ) {
            item.fourSeven += 1;
          } else if (
            lead._pendingDays <= 15
          ) {
            item.eightFifteen += 1;
          } else {
            item.fifteenPlus += 1;
          }
        }
      );

      return Array.from(
        map.values()
      ).sort(
        (a, b) =>
          b.total - a.total
      );
    }, [processedLeads]);

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const exportCSV = () => {
    if (
      !filteredLeads.length
    ) {
      return;
    }

    const headers = [
      "Executive",
      "Executive Email",
      "Lead Name",
      "Phone",
      "Email",
      "Status",
      "Project",
      "Source",
      "City",
      "Pending Since",
      "Pending Days",
      "Age Bucket",
    ];

    const rows =
      filteredLeads.map(
        (lead) => [
          lead._executiveName,
          lead._executiveEmail,
          lead._leadName,
          lead._phone,
          lead?.email || "",
          lead._status,
          lead?.project || "",
          lead?.source || "",
          lead?.city || "",
          formatDate(
            lead._pendingDate
          ),
          lead._pendingDays,
          lead._ageBucket,
        ]
      );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const safeValue =
              value === null ||
              value === undefined
                ? ""
                : String(value);

            return `"${safeValue.replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `pending-leads-report-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setSelectedExecutive(
      "all"
    );
    setSelectedAge("all");
    setSelectedStatus("all");
    setSortDirection("desc");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className={`main-content ${
          isOpen
            ? "expanded"
            : "collapsed"
        }`}
      >

        <div className="pending-report-page">

          {/* =============================================
              HEADER
          ============================================= */}

          <div className="pending-report-header">

            <div className="pending-report-title">

              <div className="pending-title-icon">
                ⏳
              </div>

              <div>
                <h1>
                  Pending Lead Report
                </h1>

                <p>
                  Executive-wise pending
                  lead aging & performance
                </p>
              </div>

            </div>

            <div className="pending-header-actions">

              <button
                type="button"
                className="pending-refresh-btn"
                onClick={
                  fetchPendingLeads
                }
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : "↻ Refresh"}
              </button>

              <button
                type="button"
                className="pending-export-btn"
                onClick={exportCSV}
                disabled={
                  !filteredLeads.length
                }
              >
                ↓ Export CSV
              </button>

            </div>

          </div>

          {/* =============================================
              ERROR
          ============================================= */}

          {error && (
            <div className="pending-error">

              <span>⚠</span>

              <div>
                <strong>
                  Unable to load report
                </strong>

                <p>
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fetchPendingLeads
                }
              >
                Retry
              </button>

            </div>
          )}

          {/* =============================================
              SUMMARY CARDS
          ============================================= */}

          <div className="pending-summary-grid">

            <div className="pending-summary-card total-card">

              <div className="pending-summary-icon">
                📋
              </div>

              <div>
                <span>
                  Total Pending
                </span>

                <strong>
                  {summary.total}
                </strong>
              </div>

            </div>

            <div className="pending-summary-card today-card">

              <div className="pending-summary-icon">
                🟢
              </div>

              <div>
                <span>
                  Pending ≤ 1 Day
                </span>

                <strong>
                  {summary.today}
                </strong>
              </div>

            </div>

            <div className="pending-summary-card warning-card">

              <div className="pending-summary-icon">
                🟡
              </div>

              <div>
                <span>
                  Pending &gt; 3 Days
                </span>

                <strong>
                  {summary.over3}
                </strong>
              </div>

            </div>

            <div className="pending-summary-card danger-card">

              <div className="pending-summary-icon">
                🟠
              </div>

              <div>
                <span>
                  Pending &gt; 7 Days
                </span>

                <strong>
                  {summary.over7}
                </strong>
              </div>

            </div>

            <div className="pending-summary-card critical-card">

              <div className="pending-summary-icon">
                🔴
              </div>

              <div>
                <span>
                  Pending &gt; 15 Days
                </span>

                <strong>
                  {summary.over15}
                </strong>
              </div>

            </div>

          </div>

          {/* =============================================
              FILTER PANEL
          ============================================= */}

          <div className="pending-filter-card">

            <div className="pending-filter-heading">

              <div>
                <h2>
                  Search & Filters
                </h2>

                <p>
                  Find leads that are pending
                  with executives
                </p>
              </div>

              <button
                type="button"
                className="pending-reset-btn"
                onClick={
                  resetFilters
                }
              >
                Reset Filters
              </button>

            </div>

            <div className="pending-filter-grid">

              {/* SEARCH */}

              <div className="pending-filter-group pending-search-group">

                <label>
                  Search Lead
                </label>

                <div className="pending-search-box">

                  <span>
                    🔍
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Name, phone, project..."
                  />

                </div>

              </div>

              {/* EXECUTIVE */}

              <div className="pending-filter-group">

                <label>
                  Executive
                </label>

                <select
                  value={
                    selectedExecutive
                  }
                  onChange={(e) =>
                    setSelectedExecutive(
                      e.target.value
                    )
                  }
                >

                  <option value="all">
                    All Executives
                  </option>

                  {executives.map(
                    (executive) => {
                      const key =
                        `${executive.name}|||${executive.email}`;

                      return (
                        <option
                          key={key}
                          value={key}
                        >
                          {executive.name}
                        </option>
                      );
                    }
                  )}

                </select>

              </div>

              {/* AGE */}

              <div className="pending-filter-group">

                <label>
                  Pending Age
                </label>

                <select
                  value={selectedAge}
                  onChange={(e) =>
                    setSelectedAge(
                      e.target.value
                    )
                  }
                >

                  <option value="all">
                    All Pending
                  </option>

                  <option value="1+">
                    More than 1 Day
                  </option>

                  <option value="3+">
                    More than 3 Days
                  </option>

                  <option value="7+">
                    More than 7 Days
                  </option>

                  <option value="15+">
                    More than 15 Days
                  </option>

                </select>

              </div>

              {/* STATUS */}

              <div className="pending-filter-group">

                <label>
                  Status
                </label>

                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(
                      e.target.value
                    )
                  }
                >

                  <option value="all">
                    All Statuses
                  </option>

                  {statuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          </div>

          {/* =============================================
              EXECUTIVE SUMMARY
          ============================================= */}

          <div className="pending-table-card">

            <div className="pending-table-header">

              <div>
                <h2>
                  Executive-wise Pending
                  Leads
                </h2>

                <p>
                  Pending leads grouped by
                  current executive
                </p>
              </div>

              <div className="pending-result-count">
                {executiveSummary.length}{" "}
                Executives
              </div>

            </div>

            <div className="pending-table-wrapper">

              <table className="pending-executive-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th className="left">
                      Executive
                    </th>

                    <th>
                      Total Pending
                    </th>

                    <th>
                      0–1 Day
                    </th>

                    <th>
                      2–3 Days
                    </th>

                    <th>
                      4–7 Days
                    </th>

                    <th>
                      8–15 Days
                    </th>

                    <th>
                      15+ Days
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="pending-loading"
                      >

                        <div className="pending-loader">
                          <span />
                          <span />
                          <span />
                        </div>

                        Loading pending
                        leads...

                      </td>

                    </tr>

                  ) : executiveSummary.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="pending-empty"
                      >

                        <div>

                          <div className="empty-icon">
                            📭
                          </div>

                          <strong>
                            No pending leads found
                          </strong>

                          <p>
                            No data matches the
                            current filters.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    executiveSummary.map(
                      (
                        executive,
                        index
                      ) => {

                        const executiveKey =
                          `${executive.name}|||${executive.email}`;

                        return (
                          <tr
                            key={executiveKey}
                            className="pending-executive-row"
                            onClick={() => {

                              setSelectedExecutive(
                                executiveKey
                              );

                              setSearch("");

                              setSelectedAge(
                                "all"
                              );

                              setSelectedStatus(
                                "all"
                              );

                            }}
                          >

                            <td>

                              <span className="pending-rank">
                                {index + 1}
                              </span>

                            </td>

                            <td className="left">

                              <div className="pending-executive-name">

                                <div className="pending-avatar">

                                  {getInitial(
                                    executive.name
                                  )}

                                </div>

                                <div>

                                  <strong>
                                    {
                                      executive.name
                                    }
                                  </strong>

                                  {executive.email && (
                                    <small>
                                      {
                                        executive.email
                                      }
                                    </small>
                                  )}

                                </div>

                              </div>

                            </td>

                            <td>

                              <span className="pending-count-badge total">
                                {
                                  executive.total
                                }
                              </span>

                            </td>

                            <td>

                              <span className="pending-count-badge green">
                                {
                                  executive.zeroOne
                                }
                              </span>

                            </td>

                            <td>

                              <span className="pending-count-badge blue">
                                {
                                  executive.twoThree
                                }
                              </span>

                            </td>

                            <td>

                              <span className="pending-count-badge yellow">
                                {
                                  executive.fourSeven
                                }
                              </span>

                            </td>

                            <td>

                              <span className="pending-count-badge orange">
                                {
                                  executive.eightFifteen
                                }
                              </span>

                            </td>

                            <td>

                              <span className="pending-count-badge red">
                                {
                                  executive.fifteenPlus
                                }
                              </span>

                            </td>

                          </tr>
                        );
                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =============================================
              ACTUAL PENDING LEADS
          ============================================= */}

          <div className="pending-table-card pending-leads-card">

            <div className="pending-table-header">

              <div>

                <h2>
                  Pending Lead Details
                </h2>

                <p>
                  {filteredLeads.length}{" "}
                  leads matching current
                  filters
                </p>

              </div>

              <button
                type="button"
                className="pending-sort-btn"
                onClick={() =>
                  setSortDirection(
                    (prev) =>
                      prev === "desc"
                        ? "asc"
                        : "desc"
                  )
                }
              >

                Pending Days{" "}

                {sortDirection ===
                "desc"
                  ? "↓"
                  : "↑"}

              </button>

            </div>

            <div className="pending-table-wrapper">

              <table className="pending-leads-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th className="left">
                      Lead
                    </th>

                    <th>
                      Phone
                    </th>

                    <th className="left">
                      Executive
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Project
                    </th>

                    <th>
                      Pending Since
                    </th>

                    <th>
                      Pending Days
                    </th>

                    <th>
                      Age
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="9"
                        className="pending-loading"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : filteredLeads.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan="9"
                        className="pending-empty"
                      >

                        <div>

                          <div className="empty-icon">
                            🔎
                          </div>

                          <strong>
                            No leads found
                          </strong>

                          <p>
                            Try changing your
                            filters.
                          </p>

                        </div>

                      </td>

                    </tr>

                  ) : (

                    filteredLeads.map(
                      (
                        lead,
                        index
                      ) => (

                        <tr
                          key={
                            lead._id ||
                            lead.id ||
                            `${lead._leadName}-${index}`
                          }
                          onClick={() =>
                            setSelectedLead(
                              lead
                            )
                          }
                        >

                          <td>
                            {index + 1}
                          </td>

                          <td className="left">

                            <div className="pending-lead-name">

                              <strong>
                                {
                                  lead._leadName
                                }
                              </strong>

                              {lead?.email && (
                                <small>
                                  {
                                    lead.email
                                  }
                                </small>
                              )}

                            </div>

                          </td>

                          <td>
                            {
                              lead._phone ||
                              "-"
                            }
                          </td>

                          <td className="left">

                            <div className="small-executive">

                              <span>
                                {getInitial(
                                  lead._executiveName
                                )}
                              </span>

                              {
                                lead._executiveName
                              }

                            </div>

                          </td>

                          <td>

                            <span
                              className={`pending-status ${normalizeText(
                                lead._status
                              ).replace(
                                /\s+/g,
                                "-"
                              )}`}
                            >
                              {
                                lead._status
                              }
                            </span>

                          </td>

                          <td>
                            {
                              lead?.project ||
                              "-"
                            }
                          </td>

                          <td>
                            {formatDate(
                              lead._pendingDate
                            )}
                          </td>

                          <td>

                            <strong
                              className={
                                lead._pendingDays >
                                15
                                  ? "days-critical"
                                  : lead._pendingDays >
                                    7
                                  ? "days-danger"
                                  : lead._pendingDays >
                                    3
                                  ? "days-warning"
                                  : "days-normal"
                              }
                            >

                              {
                                lead._pendingDays
                              }

                              <small>
                                {" "}
                                day
                                {lead._pendingDays !==
                                1
                                  ? "s"
                                  : ""}
                              </small>

                            </strong>

                          </td>

                          <td>

                            <span
                              className={`pending-age-badge ${normalizeText(
                                lead._ageBucket
                              ).replace(
                                /[^a-z0-9]+/g,
                                "-"
                              )}`}
                            >
                              {
                                lead._ageBucket
                              }
                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =============================================
              LEAD DETAIL MODAL
          ============================================= */}

          {selectedLead && (

            <div
              className="pending-modal-overlay"
              onClick={() =>
                setSelectedLead(
                  null
                )
              }
            >

              <div
                className="pending-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <div className="pending-modal-header">

                  <div>

                    <h2>
                      {
                        selectedLead._leadName
                      }
                    </h2>

                    <p>
                      Pending Lead Details
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedLead(
                        null
                      )
                    }
                  >
                    ×
                  </button>

                </div>

                <div className="pending-modal-body">

                  <div className="pending-detail-grid">

                    <div className="pending-detail-item">

                      <span>
                        Name
                      </span>

                      <strong>
                        {
                          selectedLead._leadName
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Phone
                      </span>

                      <strong>
                        {
                          selectedLead._phone ||
                          "-"
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Executive
                      </span>

                      <strong>
                        {
                          selectedLead._executiveName
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Executive Email
                      </span>

                      <strong>
                        {
                          selectedLead._executiveEmail ||
                          "-"
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Status
                      </span>

                      <strong>
                        {
                          selectedLead._status
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Project
                      </span>

                      <strong>
                        {
                          selectedLead?.project ||
                          "-"
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Pending Since
                      </span>

                      <strong>
                        {formatDate(
                          selectedLead._pendingDate
                        )}
                      </strong>

                    </div>

                    <div className="pending-detail-item highlight">

                      <span>
                        Pending Days
                      </span>

                      <strong>
                        {
                          selectedLead._pendingDays
                        }{" "}
                        Days
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Source
                      </span>

                      <strong>
                        {
                          selectedLead?.source ||
                          "-"
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        City
                      </span>

                      <strong>
                        {
                          selectedLead?.city ||
                          "-"
                        }
                      </strong>

                    </div>

                    <div className="pending-detail-item">

                      <span>
                        Email
                      </span>

                      <strong>
                        {
                          selectedLead?.email ||
                          "-"
                        }
                      </strong>

                    </div>

                  </div>

                  {selectedLead?.remark && (

                    <div className="pending-remark">

                      <span>
                        Remark
                      </span>

                      <p>
                        {
                          selectedLead.remark
                        }
                      </p>

                    </div>

                  )}

                  {selectedLead?.description && (

                    <div className="pending-remark">

                      <span>
                        Description
                      </span>

                      <p>
                        {
                          selectedLead.description
                        }
                      </p>

                    </div>

                  )}

                </div>

                <div className="pending-modal-footer">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedLead(
                        null
                      )
                    }
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default PendingLeadReport;