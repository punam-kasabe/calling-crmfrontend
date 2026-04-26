import { useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";
import "../../styles/searchclient.css";

export default function SearchClient() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [phone, setPhone] = useState("");
  const [client, setClient] = useState(null);

  const searchClient = async () => {
    try {

      const res = await axios.get(
        `https://calling-crm-backend-1.onrender.com/api/search-client/${phone}`
      );

      setClient(res.data);

    } catch {
      alert("Client not found ❌");
    }
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* PAGE */}
      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        <div className="search-client-page">

          <h1>Search Client</h1>

          <div className="search-box">

            <input
              type="text"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            <button onClick={searchClient}>
              Search
            </button>

          </div>

          {client && (

            <div className="client-card">

              <h3>{client.name}</h3>

              <p>
                <strong>Phone:</strong>
                {" "}
                {client.phone}
              </p>

              <p>
                <strong>Status:</strong>
                {" "}
                {client.status}
              </p>

              <p>
                <strong>Assigned To:</strong>
                {" "}
                {client.assigned_to}
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}