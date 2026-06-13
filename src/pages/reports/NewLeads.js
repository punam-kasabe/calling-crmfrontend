import { useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function NewLeads() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="layout">
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >
        <h1>New Leads Page Working ✅</h1>
      </div>
    </div>
  );
}