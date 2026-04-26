import Sidebar from "../../components/Sidebar";
import { useState } from "react";

export default function ManageCampaigns() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        className="main-content"
        style={{
          marginLeft: isOpen ? "240px" : "70px",
          marginTop: "60px",
          padding: "20px",
          width: "100%",
        }}
      >
        <h4>Manage Campaigns</h4>

        <div className="card p-3 mt-3">
          <p>No Campaigns Available 📢</p>
          <button className="btn btn-success">➕ Create Campaign</button>
        </div>
      </div>
    </div>
  );
}