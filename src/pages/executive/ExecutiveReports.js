import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "../../styles/executiveReports.css";

const API =
  "https://calling-crm-backend-7w52.onrender.com/api";

export default function ExecutiveReports() {
  const [isOpen, setIsOpen] = useState(true);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [reportType, setReportType] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState(""); 
  const [currentPage, setCurrentPage] =
  useState(1);
  const [selectedStatus, setSelectedStatus] =
  useState("");

const leadsPerPage = 20;
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const toggleSidebar = () =>
    setIsOpen(!isOpen);


 useEffect(() => {
  const fetchReportData = async () => {
    try {
      const res = await axios.get(
        `${API}/my-leads`,
        {
          params: {
            email: user.email
          }
        }
      );

      setLeads(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchReportData();
}, [user.email]);

const filteredLeads = useMemo(() => {

  if (reportType === "overall")
    return leads;

  if (reportType === "daily") {

    if (!selectedDate)
      return leads;

    return leads.filter(
      lead =>
        lead.createdAt?.split("T")[0] === selectedDate
    );

  }

  if (reportType === "weekly") {

    const today = new Date();

    const start = new Date();

    start.setDate(today.getDate() - 6);

    return leads.filter(lead => {

      const d = new Date(lead.createdAt);

      return d >= start && d <= today;

    });

  }

  if (reportType === "monthly") {

    if (!selectedMonth)
      return leads;

    return leads.filter(lead => {

      const d = new Date(lead.createdAt);

      return `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}` === selectedMonth;

    });

  }

  return leads;

}, [
  leads,
  reportType,
  selectedDate,
  selectedMonth
]);

/* PAGINATION */

const indexOfLastLead =
  currentPage * leadsPerPage;

const indexOfFirstLead =
  indexOfLastLead - leadsPerPage;

const displayLeads =
  filteredLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

const totalPages =
  Math.ceil(
    filteredLeads.length /
    leadsPerPage
  );

  const stats = useMemo(() => {

  const today =
    new Date().toISOString().split("T")[0];

  const weekStart = new Date();
  weekStart.setDate(
    weekStart.getDate() - 6
  );

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  return {

    total: filteredLeads.length,

    today: leads.filter(
      (lead) =>
        lead.createdAt?.split("T")[0] === today
    ).length,

    week: leads.filter((lead) => {

      const d =
        new Date(lead.createdAt);

      return d >= weekStart;

    }).length,

    month: leads.filter((lead) => {

      const d =
        new Date(lead.createdAt);

      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );

    }).length,

    new: filteredLeads.filter(
      (l) => l.status === "New"
    ).length,

    interested: filteredLeads.filter(
      (l) =>
        l.status === "Interested" ||
        l.status === "Very Interested"
    ).length,

    followup: filteredLeads.filter(
      (l) => l.status === "Followup"
    ).length,

    booked: filteredLeads.filter(
      (l) => l.status === "Booked"
    ).length,

    siteVisit: filteredLeads.filter(
      (l) => l.status === "Site Visit"
    ).length,

    notInterested: filteredLeads.filter(
      (l) =>
        l.status === "Not Interested"
    ).length,

    callback: filteredLeads.filter(
      (l) => l.status === "Call Back"
    ).length,

    meeting: filteredLeads.filter(
      (l) =>
        l.status === "Meeting Scheduled"
    ).length

  };

}, [filteredLeads, leads]);

  const todayFollowups = useMemo(() => {
  const filterDate =
    selectedDate ||
    new Date().toISOString().split("T")[0];

  return leads.filter((lead) =>

    lead.next_call_date &&
    lead.next_call_date.split("T")[0] === filterDate &&
    lead.status === "Followup"

  );

}, [leads, selectedDate]);

   const todayStatusData = useMemo(() => {
  const filterDate =
    selectedDate ||
    new Date().toISOString().split("T")[0];

  const dateLeads = leads.filter(
  (lead) =>
    lead.createdAt?.split("T")[0] === filterDate
);

  const statusCount = {};

  dateLeads.forEach((lead) => {

    const status =
      lead.status || "No Status";

    statusCount[status] =
      (statusCount[status] || 0) + 1;

  });

  return Object.entries(statusCount).map(
    ([name, value]) => ({
      name,
      value
    })
  );

}, [leads, selectedDate]);
     
const statusWiseLeads = useMemo(() => {

  if (!selectedStatus) return [];

  return filteredLeads.filter(
    (lead) =>
      (lead.status || "No Status") === selectedStatus
  );

}, [
  filteredLeads,
  selectedStatus
]);

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#FF4560",
  "#775DD0",
  "#3F51B5",
  "#26A69A",
  "#D10CE8",
  "#546E7A"
];
   
  const reportTitle = () => {

  if (reportType === "daily")
    return "Daily Report";

  if (reportType === "weekly")
    return "Weekly Report";

  if (reportType === "monthly")
    return "Monthly Report";

  return "Overall Report";

};
  

  

  return (
    <div className="layout">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >
       <div className="page-header">
        <h2>{reportTitle()}</h2>


        <p>
            Welcome,
           <strong>
           {" "}
            {user.name}
                  </strong>
            </p>


  <div
className="report-filter"
style={{
display:"flex",
gap:"15px",
alignItems:"center",
marginBottom:"20px",
flexWrap:"wrap"
}}
>

<select

value={reportType}

onChange={(e)=>{

setReportType(e.target.value);

setCurrentPage(1);

}}

>

<option value="overall">
Overall Report
</option>

<option value="daily">
Daily Report
</option>

<option value="weekly">
Weekly Report
</option>

<option value="monthly">
Monthly Report
</option>

</select>
{reportType === "daily" && (
  <>
    <input
      type="date"
      value={selectedDate}
     onChange={(e) => {
  setSelectedDate(e.target.value);
  setSelectedStatus("");
  setCurrentPage(1);
}}

    />

    <button
      className="clear-btn"
      onClick={() => {
  setSelectedDate("");
  setSelectedStatus("");
  setCurrentPage(1);
}}
    >
      Clear
    </button>
  </>
)}

{reportType === "monthly" && (
  <>
    <input
      type="month"
      value={selectedMonth}
      onChange={(e) => {
        setSelectedMonth(e.target.value);
        setCurrentPage(1);
      }}
    />

    <button
      className="clear-btn"
      onClick={() => {
        setSelectedMonth("");
        setCurrentPage(1);
      }}
    >
      Clear
    </button>
  </>
)}

</div>
</div>



        {loading ? (
          <div className="loader">
            Loading Reports...
          </div>
        ) : (
          <>

            {/* STATS */}

            <div className="stats-grid">

              <div className="stats-card">
                <h5>Total Leads</h5>
                <p>{stats.total}</p>
              </div>

              <div className="stats-card new">
                <h5>New Leads</h5>
                <p>{stats.new}</p>
              </div>

              <div className="stats-card interested">
                <h5>Interested</h5>
                <p>{stats.interested}</p>
              </div>

              <div className="stats-card followup">
                <h5>Follow Up</h5>
                <p>{stats.followup}</p>
              </div>

              <div className="stats-card booked">
                <h5>Booked</h5>
                <p>{stats.booked}</p>
              </div>

              <div className="stats-card sitevisit">
                <h5>Site Visit Done</h5>
                <p>{stats.siteVisit}</p>
              </div>

              <div className="stats-card not">
                <h5>Not Interested</h5>
                <p>{stats.notInterested}</p>
              </div>

              <div className="stats-card">
                <h5>Call Back</h5>
                <p>{stats.callback}</p>
              </div>

              <div className="stats-card">
                <h5>Meeting Scheduled</h5>
                <p>{stats.meeting}</p>
              </div>

              
            </div>
        <div className="chart-card">
  <h3>
  {selectedDate
    ? `${selectedDate} Status Distribution`
    : "Status Distribution"}
</h3>

  <ResponsiveContainer
    width="100%"
    height={400}
  >
    <PieChart>

      <Pie
        data={todayStatusData}
        cx="50%"
        cy="50%"
        outerRadius={130}
        dataKey="value"
        label
      >
        {todayStatusData.map(
          (entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[
                  index %
                  COLORS.length
                ]
              }
            />
          )
        )}
      </Pie>

      <Tooltip />

      <Legend />

    </PieChart>
  </ResponsiveContainer>
</div>

{/* STATUS + FOLLOWUPS */}

<div className="reports-row">

  {/* STATUS COUNT */}
  <div className="report-card">

    <h3>
  {selectedDate
    ? `${selectedDate} Status Count`
    : "Status Count"}
</h3>

    <div className="table-wrapper">
      <table className="leads-table">

        <thead>
          <tr>
            <th>Sr No</th>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>

        <tbody>

          {todayStatusData.length > 0 ? (

            todayStatusData.map((item, index) => (

      <tr
  key={index}
  onClick={() =>
    setSelectedStatus(
      selectedStatus === item.name
        ? ""
        : item.name
    )
  }
  style={{
    cursor: "pointer",
    background:
      selectedStatus === item.name
        ? "#dbeafe"
        : ""
  }}
>

  <td>{index + 1}</td>

  <td>{item.name}</td>

  <td>{item.value}</td>

</tr>
            ))

          ) : (

            <tr>
              <td
                colSpan="3"
                style={{ textAlign: "center" }}
              >
                No Data Available
              </td>
            </tr>

          )}

        </tbody>

      </table>
    </div>

  </div>

{selectedStatus && (

<div
  className="report-card"
  style={{ marginTop: "20px" }}
>

<h3>
  {selectedStatus} Leads
  ({statusWiseLeads.length})
</h3>

<div className="table-wrapper">

<table className="leads-table">

<thead>

<tr>

<th>Sr No</th>

<th>Name</th>

<th>Phone</th>

<th>Project</th>

</tr>

</thead>

<tbody>

{statusWiseLeads.length > 0 ? (

statusWiseLeads.map((lead, index) => (

<tr key={lead._id}>

<td>{index + 1}</td>

<td>{lead.name}</td>

<td>{lead.phone}</td>

<td>{lead.project}</td>

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

No Leads

</td>

</tr>

)}

</tbody>

</table>

</div>

</div>

)}
  {/* FOLLOWUPS */}

  <div className="report-card">

    <h3>
  {selectedDate
    ? `${selectedDate} Followups (${todayFollowups.length})`
    : `Today's Followups (${todayFollowups.length})`}
</h3>

    <div className="table-wrapper">

      <table className="leads-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Project</th>
            <th>Status</th>
            <th>Next Call</th>
          </tr>
        </thead>

        <tbody>

          {todayFollowups.length > 0 ? (

            todayFollowups.map((lead) => (

              <tr key={lead._id}>

                <td>{lead.name}</td>

                <td>{lead.phone}</td>

                <td>{lead.project}</td>

                <td>{lead.status}</td>

                <td>
                  {lead.next_call_date?.split("T")[0]}
                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center"
                }}
              >
                No Followups Today
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>
             {/* LEADS DETAILS */}

<div className="report-card">
  <h3>
   Lead Details ({displayLeads.length})
  </h3>

  <div className="table-wrapper">
    <table className="leads-table">

     <thead>
<tr>
  <th>Sr No</th>
  <th>Client Name</th>
  <th>Project</th>
  <th>Status</th>
</tr>
</thead>

     <tbody>
{displayLeads.map((lead,index)=>(
    <tr key={lead._id}>
 <td>
  {indexOfFirstLead +
    index +
    1}
</td>
  <td>{lead.name}</td>
  <td>{lead.project}</td>

  <td>
    {lead.status || "-"}
  </td>

</tr>
))}
</tbody>

    </table>
  </div>
</div>

{/* PAGINATION */}

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
    setCurrentPage(
      currentPage - 1
    )
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
    setCurrentPage(
      currentPage + 1
    )
  }
  disabled={
    currentPage === totalPages
  }
>
  Next
</button>
</div>

            {/* PROJECT SUMMARY */}

            <div className="report-card">
           <h3>
            Project Wise Leads
              </h3>

              <div className="table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Leads</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                    Object.entries(
                   filteredLeads.reduce(
                        (acc, lead) => {
                          const project =
                            lead.project ||
                            "Unknown";

                          acc[project] =
                            (acc[
                              project
                            ] || 0) + 1;

                          return acc;
                        },
                        {}
                      )
                    ).map(
                      (
                        [project,
                          count],
                        index
                      ) => (
                        <tr
                          key={index}
                        >
                          <td>
                            {project}
                          </td>

                          <td>
                            {count}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}