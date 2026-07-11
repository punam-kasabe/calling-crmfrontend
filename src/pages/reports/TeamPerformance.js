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

const [showAdvanced,
setShowAdvanced]=
useState(false);

const [filters,setFilters]=
useState({

period:"today",

from:"",

to:""

});

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

const changePeriod=(period)=>{

setFilters(prev=>({

...prev,

period

}));

};

const handleSearch=()=>{

fetchReport();

};

const exportExcel=()=>{

const ws=
XLSX.utils.json_to_sheet(

report.map(r=>({

Name:r.name,

Assigned:r.assigned,

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

<button
className="btn export"
onClick={exportExcel}
>
Export
</button>

<button
className="btn dark"
onClick={()=>changePeriod("today")}
>
Today
</button>

<button
className="btn blue"
onClick={()=>changePeriod("last7")}
>
Last 7 Days
</button>

<button
className="btn green"
onClick={()=>changePeriod("last30")}
>
Last 30 Days
</button>

<button
className="btn teal"
onClick={()=>changePeriod("thisMonth")}
>
This Month
</button>

<button
className="btn yellow"
onClick={()=>changePeriod("lastMonth")}
>
Last Month
</button>

<button
className="btn light"
onClick={()=>changePeriod("all")}
>
Till Date
</button>

<button
className="btn advanced"
onClick={()=>setShowAdvanced(
!showAdvanced
)}
>
Advanced Search
</button>

</div>

{
showAdvanced&&(

<div className="advanced-box">

<input

type="date"

value={filters.from}

onChange={(e)=>

setFilters({

...filters,

from:e.target.value

})

}

/>

<input

type="date"

value={filters.to}

onChange={(e)=>

setFilters({

...filters,

to:e.target.value

})

}

/>

<button

className="btn btn-primary"

onClick={handleSearch}

>

Search

</button>

</div>

)
}
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

<td>{row.assigned}</td>
<td>{row.completedToday}</td>

<td>{row.total}</td>

<td>{row.newLead}</td>

<td>{row.interested}</td>

<td>{row.followup}</td>

<td>{row.booked}</td>

<td>{row.notInterested}</td>

<td>{row.ringing}</td>

<td>{row.callBack}</td>

<td>{row.callCut}</td>

<td>{row.busy}</td>

<td>{row.switchOff}</td>

<td>{row.visitDone}</td>

<td>{row.pending}</td>

</tr>

))

):(

<tr>

<td
colSpan="16"
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