import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import "../../styles/manageprojects.css";

export default function ManageProjects() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [showModal, setShowModal] = useState(false);

  const [projects, setProjects] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [projectData, setProjectData] = useState({
    name: "",
    city: "",
    address: "",
    projectId: "",
    description: "",
    active: true,
  });

  /* ================= SAVE PROJECT ================= */
  const handleSave = () => {
    if (editIndex !== null) {
      const updated = [...projects];
      updated[editIndex] = projectData;
      setProjects(updated);
      setEditIndex(null);
    } else {
      setProjects([...projects, projectData]);
    }

    setProjectData({
      name: "",
      city: "",
      address: "",
      projectId: "",
      description: "",
      active: true,
    });

    setShowModal(false);
  };

  /* ================= EDIT ================= */
  const handleEdit = (proj, index) => {
    setProjectData(proj);
    setEditIndex(index);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
  };

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        {/* ================= TOP BAR ================= */}
        <div className="top-bar">
          <h3>Projects</h3>

          <button
            className="add-btn"
            onClick={() => {
              setShowModal(true);
              setEditIndex(null);
            }}
          >
            Add New Project
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="table-container">
          <table className="project-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>City</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="4">No Projects Found</td>
                </tr>
              ) : (
                projects.map((proj, index) => (
                  <tr key={index}>
                    <td>{proj.name}</td>
                    <td>{proj.city}</td>
                    <td>{proj.active ? "Yes" : "No"}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(proj, index)}
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(index)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">

              <div className="modal-header">
                <h3>{editIndex !== null ? "Edit Project" : "New Project"}</h3>
                <span
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </span>
              </div>

              <div className="modal-body">

                <div className="row">
                  <input
                    type="text"
                    placeholder="Name"
                    value={projectData.name}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={projectData.city}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        city: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={projectData.address}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <input
                  type="text"
                  placeholder="Project ID"
                  value={projectData.projectId}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      projectId: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Description"
                  value={projectData.description}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      description: e.target.value,
                    })
                  }
                />

                <div className="checkbox-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={projectData.active}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          active: e.target.checked,
                        })
                      }
                    />
                    Active
                  </label>
                </div>

              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}