import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import "../../styles/dashboard.css";
import "../../styles/apikeys.css";

export default function ApiKeys() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    source: "",
    user: "",
    project: "",
  });

  /* ================= FETCH DATA ================= */
  const fetchKeys = async () => {
    try {
      const res = await axios.get("https://calling-crm-backend-1.onrender.com/api/apikeys");
      setApiKeys(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  /* ================= ADD KEY ================= */
  const handleAdd = async () => {
    try {
      await axios.post("https://calling-crm-backend-1.onrender.com/api/apikeys", form);
      setShowModal(false);
      setForm({ source: "", user: "", project: "" });
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this API key?")) return;

    try {
      await axios.delete(`https://calling-crm-backend-1.onrender.com/api/apikeys/${id}`);
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= COPY ================= */
  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    alert("Copied!");
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main ${isOpen ? "" : "collapsed"}`}>
        <h2>API Keys</h2>

        <div className="card">
          <div className="card-header">
            <h3>API Keys</h3>
            <button onClick={() => setShowModal(true)} className="btn-add">
              Add API Keys
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Source</th>
                <th>User</th>
                <th>Project</th>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {apiKeys.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.source}</td>
                  <td>{item.user}</td>
                  <td>{item.project}</td>

                  <td>
                    {item.key}
                    <button
                      className="copy-btn"
                      onClick={() => copyKey(item.key)}
                    >
                      📋
                    </button>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>Api Keys Count - {apiKeys.length}</p>
        </div>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Add API Key</h3>

              <input
                placeholder="Source"
                value={form.source}
                onChange={(e) =>
                  setForm({ ...form, source: e.target.value })
                }
              />

              <input
                placeholder="User"
                value={form.user}
                onChange={(e) =>
                  setForm({ ...form, user: e.target.value })
                }
              />

              <input
                placeholder="Project"
                value={form.project}
                onChange={(e) =>
                  setForm({ ...form, project: e.target.value })
                }
              />

              <div className="modal-actions">
                <button onClick={handleAdd}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}