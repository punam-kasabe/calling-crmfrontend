import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/channelPartner.css";

export default function ChannelPartner() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  /* 🔥 SAMPLE DATA (API नंतर replace कर) */
  const data = [
    {
      partner: "ABC Realty",
      leads: 120,
      interested: 60,
      siteVisits: 30,
      bookings: 10,
      revenue: 1000000,
    },
    {
      partner: "XYZ Associates",
      leads: 80,
      interested: 40,
      siteVisits: 20,
      bookings: 5,
      revenue: 500000,
    },
    {
      partner: "Prime Deals",
      leads: 40,
      interested: 15,
      siteVisits: 10,
      bookings: 2,
      revenue: 200000,
    },
  ];

  /* 🔥 CALCULATIONS */
  const conversionRate = (bookings, leads) => {
    if (leads === 0) return 0;
    return ((bookings / leads) * 100).toFixed(1);
  };

  const avgDealValue = (revenue, bookings) => {
    if (bookings === 0) return 0;
    return Math.round(revenue / bookings);
  };

  /* 🔥 TOTALS */
  const totals = data.reduce((acc, cur) => {
    acc.leads += cur.leads;
    acc.interested += cur.interested;
    acc.siteVisits += cur.siteVisits;
    acc.bookings += cur.bookings;
    acc.revenue += cur.revenue;
    return acc;
  }, { leads: 0, interested: 0, siteVisits: 0, bookings: 0, revenue: 0 });

  return (
    <div className="layout">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <h2 className="page-title">Channel Partner Report</h2>

        {/* 🔥 FILTER BUTTONS */}
        <div className="filters">
          <button className="btn export">Export</button>
          <button className="btn dark">Today</button>
          <button className="btn blue">Last 7 Days</button>
          <button className="btn green">Last 30 Days</button>
          <button className="btn teal">This Month</button>
          <button className="btn yellow">Last Month</button>
          <button className="btn light">Till Date</button>

          <button className="btn advanced">Advanced Search</button>
        </div>

        {/* 📊 TABLE */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Partner</th>
                <th>Leads</th>
                <th>Interested</th>
                <th>Site Visits</th>
                <th>Bookings</th>
                <th>Revenue (₹)</th>
                <th>Conversion %</th>
                <th>Avg Deal Value (₹)</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.partner}</td>
                  <td>{row.leads}</td>
                  <td>{row.interested}</td>
                  <td>{row.siteVisits}</td>
                  <td>{row.bookings}</td>

                  <td>₹{row.revenue.toLocaleString()}</td>

                  <td>{conversionRate(row.bookings, row.leads)}%</td>

                  <td>₹{avgDealValue(row.revenue, row.bookings)}</td>
                </tr>
              ))}

              {/* 🔥 TOTAL ROW */}
              <tr className="total-row">
                <td><b>Total</b></td>
                <td>{totals.leads}</td>
                <td>{totals.interested}</td>
                <td>{totals.siteVisits}</td>
                <td>{totals.bookings}</td>

                <td>₹{totals.revenue.toLocaleString()}</td>

                <td>{conversionRate(totals.bookings, totals.leads)}%</td>

                <td>₹{avgDealValue(totals.revenue, totals.bookings)}</td>
              </tr>
            </tbody>
          </table>

          <p className="entries-text">
            Showing 1 to {data.length} of {data.length} entries
          </p>

        </div>
      </div>
    </div>
  );
}