import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  Users,
  PhoneCall,
  Heart,
  MapPin,
  Handshake,
  CheckCircle2,
  Search,
  RotateCcw,
  Download
} from "lucide-react";
import "./CampaignReports.css";

const API_URL =
  "https://calling-crm-backend-7w52.onrender.com/api";

const CampaignReports = () => {
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    campaign: "",
    project: "",
    executive: "",
    status: ""
  });

  const [report, setReport] = useState({
    summary: {
      totalLeads: 0,
      connected: 0,
      interested: 0,
      siteVisit: 0,
      negotiation: 0,
      booked: 0
    },
    campaigns: [],
    executives: [],
    daily: []
  });

  const [campaigns, setCampaigns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    loadFilterOptions();
    loadReport();
  }, []);

  // ==========================================
  // LOAD FILTER OPTIONS
  // ==========================================

  const loadFilterOptions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/campaign-reports/options`
      );

      setCampaigns(response.data?.campaigns || []);
      setProjects(response.data?.projects || []);
      setExecutives(response.data?.executives || []);
    } catch (error) {
      console.error(
        "Campaign report options error:",
        error
      );
    }
  };

  // ==========================================
  // LOAD REPORT
  // ==========================================

  const loadReport = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/campaign-reports`,
        {
          params: filters
        }
      );

      setReport({
        summary: response.data?.summary || {},
        campaigns: response.data?.campaigns || [],
        executives: response.data?.executives || [],
        daily: response.data?.daily || []
      });
    } catch (error) {
      console.error(
        "Campaign report loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==========================================
  // APPLY FILTER
  // ==========================================

  const handleApplyFilter = () => {
    loadReport();
  };

  // ==========================================
  // RESET FILTER
  // ==========================================

  const handleReset = () => {
    const emptyFilters = {
      fromDate: "",
      toDate: "",
      campaign: "",
      project: "",
      executive: "",
      status: ""
    };

    setFilters(emptyFilters);

    setTimeout(() => {
      loadReport();
    }, 0);
  };

  // ==========================================
  // EXPORT
  // ==========================================

  const handleExport = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(
      ([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      }
    );

    window.open(
      `${API_URL}/campaign-reports/export?${params.toString()}`,
      "_blank"
    );
  };

  const summary = report.summary || {};

  // ==========================================
  // CARD DATA
  // ==========================================

  const cards = [
    {
      title: "Total Leads",
      value: summary.totalLeads || 0,
      icon: <Users size={22} />,
      className: "total"
    },
    {
      title: "Connected",
      value: summary.connected || 0,
      icon: <PhoneCall size={22} />,
      className: "connected"
    },
    {
      title: "Interested",
      value: summary.interested || 0,
      icon: <Heart size={22} />,
      className: "interested"
    },
    {
      title: "Site Visit",
      value: summary.siteVisit || 0,
      icon: <MapPin size={22} />,
      className: "sitevisit"
    },
    {
      title: "Negotiation",
      value: summary.negotiation || 0,
      icon: <Handshake size={22} />,
      className: "negotiation"
    },
    {
      title: "Booked",
      value: summary.booked || 0,
      icon: <CheckCircle2 size={22} />,
      className: "booked"
    }
  ];

  return (
    <div className="campaign-reports-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="campaign-reports-header">
        <div>
          <h2>Campaign Reports</h2>

          <p>
            Campaign-wise lead performance and conversion report
          </p>
        </div>

        <button
          className="campaign-export-btn"
          onClick={handleExport}
        >
          <Download size={17} />
          Export Excel
        </button>
      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="campaign-filter-box">

        <div className="campaign-filter">

          <label>From Date</label>

          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />

        </div>

        <div className="campaign-filter">

          <label>To Date</label>

          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />

        </div>

        <div className="campaign-filter">

          <label>Campaign</label>

          <select
            name="campaign"
            value={filters.campaign}
            onChange={handleFilterChange}
          >
            <option value="">
              All Campaigns
            </option>

            {campaigns.map((item, index) => (
              <option
                key={item._id || item.campaign_id || index}
                value={
                  item.campaign_id ||
                  item.campaignName ||
                  item.campaign_name ||
                  ""
                }
              >
                {item.campaignName ||
                  item.campaign_name ||
                  item.name}
              </option>
            ))}
          </select>

        </div>

        <div className="campaign-filter">

          <label>Project</label>

          <select
            name="project"
            value={filters.project}
            onChange={handleFilterChange}
          >
            <option value="">
              All Projects
            </option>

            {projects.map((project, index) => (
              <option
                key={index}
                value={project}
              >
                {project}
              </option>
            ))}
          </select>

        </div>

        <div className="campaign-filter">

          <label>Executive</label>

          <select
            name="executive"
            value={filters.executive}
            onChange={handleFilterChange}
          >
            <option value="">
              All Executives
            </option>

            {executives.map((item, index) => (
              <option
                key={item.email || index}
                value={item.email || item}
              >
                {item.name ||
                  item.userName ||
                  item.username ||
                  item.email ||
                  item}
              </option>
            ))}
          </select>

        </div>

        <div className="campaign-filter">

          <label>Status</label>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">
              All Status
            </option>

            <option value="New">New</option>
            <option value="Ringing">Ringing</option>
            <option value="Connected">Connected</option>
            <option value="Interested">Interested</option>
            <option value="Very Interested">
              Very Interested
            </option>
            <option value="Follow Up">
              Follow Up
            </option>
            <option value="Site Visit Done">
              Site Visit Done
            </option>
            <option value="Office Visit">
              Office Visit
            </option>
            <option value="Negotiation">
              Negotiation
            </option>
            <option value="Booked">
              Booked
            </option>
            <option value="Not Interested">
              Not Interested
            </option>
          </select>

        </div>

        <div className="campaign-filter-actions">

          <button
            className="apply-report-btn"
            onClick={handleApplyFilter}
          >
            <Search size={16} />
            Apply Filter
          </button>

          <button
            className="reset-report-btn"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            Reset
          </button>

        </div>

      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="campaign-summary-grid">

        {cards.map((card) => (
          <div
            className={`campaign-summary-card ${card.className}`}
            key={card.title}
          >
            <div className="campaign-card-icon">
              {card.icon}
            </div>

            <div>
              <p>{card.title}</p>

              <h3>
                {loading
                  ? "..."
                  : Number(card.value || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        ))}

      </div>

      {/* ======================================
          CAMPAIGN PERFORMANCE
      ====================================== */}

      <div className="campaign-report-section">

        <div className="section-header">

          <div>
            <h3>Campaign Performance</h3>

            <p>
              Campaign-wise lead and conversion performance
            </p>
          </div>

          <BarChart3 size={22} />

        </div>

        <div className="report-table-wrapper">

          <table className="campaign-report-table">

            <thead>
              <tr>
                <th>Campaign</th>
                <th>Project</th>
                <th>Leads</th>
                <th>Connected</th>
                <th>Interested</th>
                <th>Follow Up</th>
                <th>Site Visit</th>
                <th>Booked</th>
                <th>Conversion %</th>
              </tr>
            </thead>

            <tbody>

              {report.campaigns.length === 0 ? (

                <tr>
                  <td
                    colSpan="9"
                    className="report-empty"
                  >
                    {loading
                      ? "Loading campaign report..."
                      : "No campaign data found."}
                  </td>
                </tr>

              ) : (

                report.campaigns.map(
                  (item, index) => (
                    <tr key={item.campaign_id || index}>

                      <td>
                        <strong>
                          {item.campaign_name ||
                            item.campaignName ||
                            "—"}
                        </strong>
                      </td>

                      <td>
                        {item.project || "—"}
                      </td>

                      <td>
                        {item.leads || 0}
                      </td>

                      <td>
                        {item.connected || 0}
                      </td>

                      <td>
                        {item.interested || 0}
                      </td>

                      <td>
                        {item.followUp || 0}
                      </td>

                      <td>
                        {item.siteVisit || 0}
                      </td>

                      <td>
                        {item.booked || 0}
                      </td>

                      <td>
                        <span className="conversion-badge">
                          {Number(
                            item.conversion || 0
                          ).toFixed(2)}
                          %
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

      {/* ======================================
          EXECUTIVE PERFORMANCE
      ====================================== */}

      <div className="campaign-report-section">

        <div className="section-header">

          <div>
            <h3>Executive Performance</h3>

            <p>
              Executive-wise campaign performance
            </p>
          </div>

          <Users size={22} />

        </div>

        <div className="report-table-wrapper">

          <table className="campaign-report-table">

            <thead>
              <tr>
                <th>Executive</th>
                <th>Leads</th>
                <th>Connected</th>
                <th>Interested</th>
                <th>Follow Up</th>
                <th>Site Visit</th>
                <th>Negotiation</th>
                <th>Booked</th>
                <th>Conversion %</th>
              </tr>
            </thead>

            <tbody>

              {report.executives.length === 0 ? (

                <tr>
                  <td
                    colSpan="9"
                    className="report-empty"
                  >
                    {loading
                      ? "Loading executive report..."
                      : "No executive data found."}
                  </td>
                </tr>

              ) : (

                report.executives.map(
                  (item, index) => (
                    <tr key={item.email || index}>

                      <td>
                        <strong>
                          {item.name ||
                            item.userName ||
                            item.username ||
                            item.email ||
                            "—"}
                        </strong>
                      </td>

                      <td>
                        {item.leads || 0}
                      </td>

                      <td>
                        {item.connected || 0}
                      </td>

                      <td>
                        {item.interested || 0}
                      </td>

                      <td>
                        {item.followUp || 0}
                      </td>

                      <td>
                        {item.siteVisit || 0}
                      </td>

                      <td>
                        {item.negotiation || 0}
                      </td>

                      <td>
                        {item.booked || 0}
                      </td>

                      <td>
                        <span className="conversion-badge">
                          {Number(
                            item.conversion || 0
                          ).toFixed(2)}
                          %
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

      {/* ======================================
          FUNNEL
      ====================================== */}

      <div className="campaign-report-section">

        <div className="section-header">

          <div>
            <h3>Campaign Funnel</h3>

            <p>
              Lead journey from enquiry to booking
            </p>
          </div>

          <BarChart3 size={22} />

        </div>

        <div className="campaign-funnel">

          {[
            ["Leads", summary.totalLeads || 0],
            ["Connected", summary.connected || 0],
            ["Interested", summary.interested || 0],
            ["Site Visit", summary.siteVisit || 0],
            ["Negotiation", summary.negotiation || 0],
            ["Booked", summary.booked || 0]
          ].map(([label, value]) => (

            <div
              className="funnel-item"
              key={label}
            >

              <div className="funnel-label">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>

              <div className="funnel-bar">
                <div
                  className="funnel-fill"
                  style={{
                    width: `${
                      summary.totalLeads
                        ? Math.min(
                            100,
                            (Number(value) /
                              Number(
                                summary.totalLeads
                              )) *
                              100
                          )
                        : 0
                    }%`
                  }}
                />
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ======================================
          DAILY REPORT
      ====================================== */}

      <div className="campaign-report-section">

        <div className="section-header">

          <div>
            <h3>Daily Campaign Performance</h3>

            <p>
              Date-wise campaign lead performance
            </p>
          </div>

          <BarChart3 size={22} />

        </div>

        <div className="report-table-wrapper">

          <table className="campaign-report-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Leads</th>
                <th>Connected</th>
                <th>Interested</th>
                <th>Site Visit</th>
                <th>Negotiation</th>
                <th>Booked</th>
              </tr>
            </thead>

            <tbody>

              {report.daily.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="report-empty"
                  >
                    {loading
                      ? "Loading daily report..."
                      : "No daily data found."}
                  </td>
                </tr>

              ) : (

                report.daily.map(
                  (item, index) => (
                    <tr key={index}>

                      <td>
                        {item.date || "—"}
                      </td>

                      <td>
                        {item.leads || 0}
                      </td>

                      <td>
                        {item.connected || 0}
                      </td>

                      <td>
                        {item.interested || 0}
                      </td>

                      <td>
                        {item.siteVisit || 0}
                      </td>

                      <td>
                        {item.negotiation || 0}
                      </td>

                      <td>
                        {item.booked || 0}
                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default CampaignReports;