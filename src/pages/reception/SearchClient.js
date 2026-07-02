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
        `https://calling-crm-backend-7w52.onrender.com/api/search-client/${phone}`
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

<h2>{client.name}</h2>

<p>
<strong>📞 Mobile :</strong> {client.phone}
</p>

<p>
<strong>📧 Email :</strong> {client.email || "-"}
</p>

<p>
<strong>🏢 Project :</strong> {client.project || "-"}
</p>

<p>
<strong>📍 Location :</strong> {client.location || "-"}
</p>

<p>
<strong>💰 Budget :</strong> {client.budget || "-"}
</p>

<p>
<strong>📌 Source :</strong> {client.source || "-"}
</p>

<p>
<strong>👤 Status :</strong> {client.status}
</p>

<p>
<strong>👨‍💼 Assigned To :</strong> {client.assigned_to}
</p>

<p>
<strong>📝 Remark :</strong> {client.remark || "-"}
</p>

<p>
<strong>📅 Created :</strong>{" "}
{client.createdAt
  ? new Date(client.createdAt).toLocaleString()
  : "-"}
</p>

</div>
          )}

        </div>

      </div>

    </div>
  );
}