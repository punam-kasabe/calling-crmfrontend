import Sidebar from "../../components/Sidebar";
import { useState } from "react";

export default function ManageProjects() {
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
        <h4>Manage Projects</h4>

        <div className="card p-3 mt-3">
          <p>No Projects Added Yet 🚀</p>
          <button className="btn btn-primary">➕ Add Project</button>
        </div>
      </div>
    </div>
  );
}