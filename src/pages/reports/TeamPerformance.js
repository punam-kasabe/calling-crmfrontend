import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/TeamPerformance.css";

const API =
"https://calling-crm-backend-7w52.onrender.com/api";

export default function TeamPerformance() {

const [isOpen,setIsOpen]=useState(true);

const toggleSidebar=()=>setIsOpen(!isOpen);

const user=useMemo(()=>{

return JSON.parse(
localStorage.getItem("user")
)||{};

},[]);

const [loading,setLoading]=
useState(false);

const [report,setReport]=
useState([]);


const today = new Date().toISOString().split("T")[0];

const [filters, setFilters] = useState({
  date: today
});
const [showModal,setShowModal]=useState(false);

const [selectedLeads,setSelectedLeads]=useState([]);

const [modalTitle,setModalTitle]=useState("");
const fetchReport=
useCallback(async()=>{

try{

setLoading(true);

const res=
await axios.post(

`${API}/team-performance`,

{

email:user.email,

role:user.role,

filters

}

);

setReport(res.data||[]);

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

},[filters,user]);

useEffect(()=>{

fetchReport();

},[fetchReport]);


const handleSearch=()=>{

fetchReport();

};

const openLeads = async (email, title, type) => {

  try{

    const res = await axios.post(
      `${API}/team-performance-details`,
      {
        executive: email,
        type,
        filters
      }
    );

    setSelectedLeads(res.data);

    setModalTitle(title);

    setShowModal(true);

  }catch(err){

    console.log(err);

  }

};

const exportExcel=()=>{

const ws=
XLSX.utils.json_to_sheet(

report.map(r=>({

Name:r.name,

Assigned:r.assigned,
Completed: r.completed,
Total:r.total,

New:r.newLead,

Interested:r.interested,

Followup:r.followup,

Booked:r.booked,

"Not Interested":r.notInterested,

Ringing:r.ringing,

"Call Back":r.callBack,

"Call Cut":r.callCut,

Busy:r.busy,

"Switch Off":r.switchOff,

"Visit Done":r.visitDone,

Pending:r.pending

}))

);



const wb=
XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
wb,
ws,
"Team Performance"
);

XLSX.writeFile(
wb,
"TeamPerformance.xlsx"
);

};

const totals=
report.reduce(

(acc,row)=>{

acc.assigned+=row.assigned;
acc.completed += row.completed || 0;

acc.total+=row.total;

acc.newLead+=row.newLead;

acc.interested+=row.interested;

acc.followup+=row.followup;

acc.booked+=row.booked;

acc.notInterested+=row.notInterested;

acc.ringing+=row.ringing;

acc.callBack+=row.callBack;

acc.callCut+=row.callCut;

acc.busy+=row.busy;

acc.switchOff+=row.switchOff;

acc.visitDone+=row.visitDone;

acc.pending+=row.pending;

return acc;

},

{

assigned:0,
completed:0,
total:0,

newLead:0,

interested:0,

followup:0,

booked:0,

notInterested:0,

ringing:0,

callBack:0,

callCut:0,

busy:0,

switchOff:0,

visitDone:0,

pending:0

}

);

const pieData={

labels:report.map(r=>r.name),

datasets:[{

label:"Total Leads",

data:report.map(r=>r.total)

}]

};

const barData={

labels:report.map(r=>r.name),

datasets:[

{

label:"Interested",

data:report.map(r=>r.interested)

},

{

label:"Booked",

data:report.map(r=>r.booked)

}

]

};

return(

<div className="layout">

<Sidebar
isOpen={isOpen}
toggleSidebar={toggleSidebar}
/>

<div
className={`main-content ${
isOpen?"shifted":"full"
}`}
>

<h2 className="page-title">
Team Performance Report
</h2>


<div className="filters">

  <label
    style={{
      fontWeight: "bold"
    }}
  >
    Select Date :
  </label>

  <input
    type="date"
    value={filters.date}
    onChange={(e) =>
      setFilters({
        ...filters,
        date: e.target.value
      })
    }
  />

  <button
className="btn btn-primary"
onClick={handleSearch}
>
Search
</button>

  <button
    className="btn export"
    onClick={exportExcel}
  >
    Export
  </button>

</div>
{/* TABLE */}

<div className="table-container">

{loading ? (

<h3
style={{
textAlign:"center",
padding:"40px"
}}
>
Loading...
</h3>

) : (

<>

<table>

<thead>

<tr>

<th>Sr No</th>

<th>Name</th>

<th>Assigned</th>
<th>Completed Today</th>
<th>Total</th>

<th>New</th>

<th>Interested</th>

<th>Followup</th>

<th>Booked</th>

<th>Not Interested</th>

<th>Ringing</th>

<th>Call Back</th>

<th>Call Cut</th>

<th>Busy</th>

<th>Switch Off</th>

<th>Visit Done</th>

<th>Pending</th>

</tr>

</thead>

<tbody>

{

report.length>0 ? (

report.map((row,index)=>(

<tr key={index}>

<td>{index+1}</td>

<td>{row.name}</td>

<td>

<span
className="count-link"
onClick={()=>
openLeads(
row.email,
`${row.name} Assigned Leads`,
"assigned"
)
}
>

{row.assigned}

</span>

</td>

<td>

<span
className="count-link"
onClick={()=>
openLeads(
row.email,
`${row.name} Completed`,
"completed"
)
}
>

{row.completed}

</span>

</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Total Leads`,
        "total"
      )
    }
  >
    {row.total}
  </span>
</td><td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} New Leads`,
        "new"
      )
    }
  >
    {row.newLead}
  </span>
</td>
<td>

<span
className="count-link"
onClick={()=>
openLeads(
row.email,
`${row.name} Interested`,
"interested"
)
}
>

{row.interested}

</span>

</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Followup`,
        "followup"
      )
    }
  >
    {row.followup}
  </span>
</td>

<td>

<span
className="count-link"
onClick={()=>
openLeads(
row.email,
`${row.name} Booked`,
"booked"
)
}
>

{row.booked}

</span>

</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Not Interested`,
        "notInterested"
      )
    }
  >
    {row.notInterested}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Ringing`,
        "ringing"
      )
    }
  >
    {row.ringing}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Call Back`,
        "callBack"
      )
    }
  >
    {row.callBack}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Call Cut`,
        "callCut"
      )
    }
  >
    {row.callCut}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Busy`,
        "busy"
      )
    }
  >
    {row.busy}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Switch Off`,
        "switchOff"
      )
    }
  >
    {row.switchOff}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Visit Done`,
        "visitDone"
      )
    }
  >
    {row.visitDone}
  </span>
</td>

<td>
  <span
    className="count-link"
    onClick={() =>
      openLeads(
        row.email,
        `${row.name} Pending`,
        "pending"
      )
    }
  >
    {row.pending}
  </span>
</td>

</tr>

))

):(

<tr>

<td
colSpan="17"
style={{
textAlign:"center"
}}
>

No Data Found

</td>

</tr>

)

}

<tr className="total-row">

<td colSpan="2">
<b>Total</b>
</td>

<td>{totals.assigned}</td>

<td>{totals.completed}</td>

<td>{totals.total}</td>

<td>{totals.newLead}</td>

<td>{totals.interested}</td>

<td>{totals.followup}</td>

<td>{totals.booked}</td>

<td>{totals.notInterested}</td>

<td>{totals.ringing}</td>

<td>{totals.callBack}</td>

<td>{totals.callCut}</td>

<td>{totals.busy}</td>

<td>{totals.switchOff}</td>

<td>{totals.visitDone}</td>

<td>{totals.pending}</td>

</tr>

</tbody>

</table>

<div className="chart-wrapper">

<div className="chart-box">

<h3>Total Leads</h3>

<Pie data={pieData}/>

</div>

<div className="chart-box">

<h3>Interested vs Booked</h3>

<Bar data={barData}/>

</div>

</div>

</>

)}

</div>

</div>

</div>

);

}