import Sidebar from "../../components/Sidebar";
import { useState } from "react";

import "../../styles/receptiondashboard.css";

export default function ReceptionDashboard() {

  const [isOpen, setIsOpen] = useState(true);

  return (

    <div className="layout">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
      />

      {/* MAIN CONTENT */}
      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="reception-page">

          {/* HEADER */}
          <div className="reception-header">

            <h1>
              Reception Dashboard
            </h1>

            <p className="reception-subtitle">
              Welcome to Reception Management Panel
            </p>

          </div>

          {/* CARDS */}
          <div className="reception-cards">

            {/* CARD 1 */}
            <div className="reception-card">

              <div className="card-top">
                <h3>Total Visits</h3>
              </div>

              <p>0</p>

            </div>

            {/* CARD 2 */}
            <div className="reception-card">

              <div className="card-top">
                <h3>Today's Visits</h3>
              </div>

              <p>0</p>

            </div>

            {/* CARD 3 */}
            <div className="reception-card">

              <div className="card-top">
                <h3>Assigned Managers</h3>
              </div>

              <p>0</p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}