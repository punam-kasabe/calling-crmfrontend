import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ManageCampaigns() {
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [campaigns, setCampaigns] = useState([]);
 const [, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: "",
    project: "",
    source: "Meta",
    autoCampaign: true,
    status: "Active",
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  // =========================================
  // LOAD CAMPAIGNS
  // =========================================
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://calling-crm-backend-7w52.onrender.com/api/campaigns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCampaigns(res.data || []);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // =========================================
  // INPUT CHANGE
  // =========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // =========================================
  // CREATE CAMPAIGN
  // =========================================
  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    if (!formData.campaignName.trim()) {
      alert("Campaign name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://calling-crm-backend-7w52.onrender.com/api/campaigns",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Campaign created successfully");

      setFormData({
        campaignName: "",
        project: "",
        source: "Meta",
        autoCampaign: true,
        status: "Active",
      });

      setShowForm(false);

      fetchCampaigns();
    } catch (error) {
      console.error("Create campaign error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create campaign"
      );
    }
  };

  return (
    <div className="d-flex">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className="main-content"
        style={{
          marginLeft: isOpen ? "240px" : "70px",
          marginTop: "60px",
          padding: "20px",
          width: "100%",
        }}
      >

        {/* =========================================
            PAGE TITLE
        ========================================= */}

        <h4>Manage Campaigns</h4>


        {/* =========================================
            CREATE BUTTON
        ========================================= */}

        <div className="card p-3 mt-3">

          {!showForm && (
            <>
              {campaigns.length === 0 ? (
                <p className="text-center mb-2">
                  No Campaigns Available 📢
                </p>
              ) : (
                <div className="table-responsive">

                  <table className="table table-bordered">

                    <thead>
                      <tr>
                        <th>Campaign Name</th>
                        <th>Project</th>
                        <th>Source</th>
                        <th>Auto Campaign</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {campaigns.map((campaign) => (
                        <tr key={campaign._id}>

                          <td>
                            {campaign.campaignName}
                          </td>

                          <td>
                            {campaign.project || "-"}
                          </td>

                          <td>
                            {campaign.source}
                          </td>

                          <td>
                            {campaign.autoCampaign
                              ? "ON"
                              : "OFF"}
                          </td>

                          <td>
                            {campaign.status}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

              <button
                className="btn btn-success w-100"
                onClick={() => setShowForm(true)}
              >
                ➕ Create Campaign
              </button>
            </>
          )}


          {/* =========================================
              CREATE CAMPAIGN FORM
          ========================================= */}

          {showForm && (

            <form onSubmit={handleCreateCampaign}>

              <h5 className="mb-3">
                Create Campaign
              </h5>


              {/* CAMPAIGN NAME */}

              <div className="mb-3">

                <label className="form-label">
                  Campaign Name
                </label>

                <input
                  type="text"
                  name="campaignName"
                  className="form-control"
                  placeholder="Enter campaign name"
                  value={formData.campaignName}
                  onChange={handleChange}
                />

              </div>


              {/* PROJECT */}

              <div className="mb-3">

                <label className="form-label">
                  Project
                </label>

                <input
                  type="text"
                  name="project"
                  className="form-control"
                  placeholder="Enter project name"
                  value={formData.project}
                  onChange={handleChange}
                />

              </div>


              {/* SOURCE */}

              <div className="mb-3">

                <label className="form-label">
                  Lead Source
                </label>

                <select
                  name="source"
                  className="form-control"
                  value={formData.source}
                  onChange={handleChange}
                >

                  <option value="Meta">
                    Meta
                  </option>

                  <option value="99acres">
                    99acres
                  </option>

                  <option value="Website">
                    Website
                  </option>

                  <option value="Chatbot">
                    Chatbot
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              {/* AUTO CAMPAIGN */}

              <div className="form-check mb-3">

                <input
                  type="checkbox"
                  name="autoCampaign"
                  className="form-check-input"
                  checked={formData.autoCampaign}
                  onChange={handleChange}
                  id="autoCampaign"
                />

                <label
                  className="form-check-label"
                  htmlFor="autoCampaign"
                >
                  Enable Auto Campaign
                </label>

              </div>


              {/* STATUS */}

              <div className="mb-3">

                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  Save Campaign
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}

        </div>

      </div>
    </div>
  );
}