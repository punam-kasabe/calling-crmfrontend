import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/marketingROI.css";

export default function MarketingROI() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  /* 🔥 SAMPLE DATA (API नंतर connect कर) */
  const data = [
    {
      source: "Facebook Ads",
      spend: 50000,
      leads: 180,
      bookings: 12,
      revenue: 1200000,
    },
    {
      source: "Google Ads",
      spend: 30000,
      leads: 90,
      bookings: 6,
      revenue: 600000,
    },
    {
      source: "Website",
      spend: 10000,
      leads: 40,
      bookings: 4,
      revenue: 300000,
    },
  ];

  /* 🔥 CALCULATIONS */
  const calculateROI = (revenue, spend) => {
    if (spend === 0) return 0;
    return (((revenue - spend) / spend) * 100).toFixed(1);
  };

  const calculateCPL = (spend, leads) => {
    if (leads === 0) return 0;
    return (spend / leads).toFixed(0);
  };

  const calculateConversion = (bookings, leads) => {
    if (leads === 0) return 0;
    return ((bookings / leads) * 100).toFixed(1);
  };

  /* 🔥 TOTALS */
  const totals = data.reduce((acc, cur) => {
    acc.spend += cur.spend;
    acc.leads += cur.leads;
    acc.bookings += cur.bookings;
    acc.revenue += cur.revenue;
    return acc;
  }, { spend: 0, leads: 0, bookings: 0, revenue: 0 });

  return (
    <div className="layout">

      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <h2 className="page-title">Marketing ROI Report</h2>

        {/* 🔥 FILTERS */}
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
                <th>Source</th>
                <th>Spend (₹)</th>
                <th>Leads</th>
                <th>Bookings</th>
                <th>Revenue (₹)</th>
                <th>CPL (₹)</th>
                <th>Conversion %</th>
                <th>ROI %</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.source}</td>
                  <td>₹{row.spend.toLocaleString()}</td>
                  <td>{row.leads}</td>
                  <td>{row.bookings}</td>
                  <td>₹{row.revenue.toLocaleString()}</td>

                  <td>₹{calculateCPL(row.spend, row.leads)}</td>

                  <td>{calculateConversion(row.bookings, row.leads)}%</td>

                  <td
                    style={{
                      color:
                        calculateROI(row.revenue, row.spend) > 0
                          ? "green"
                          : "red"
                    }}
                  >
                    {calculateROI(row.revenue, row.spend)}%
                  </td>
                </tr>
              ))}

              {/* 🔥 TOTAL */}
              <tr className="total-row">
                <td><b>Total</b></td>
                <td>₹{totals.spend.toLocaleString()}</td>
                <td>{totals.leads}</td>
                <td>{totals.bookings}</td>
                <td>₹{totals.revenue.toLocaleString()}</td>

                <td>₹{calculateCPL(totals.spend, totals.leads)}</td>
                <td>{calculateConversion(totals.bookings, totals.leads)}%</td>
                <td>{calculateROI(totals.revenue, totals.spend)}%</td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}