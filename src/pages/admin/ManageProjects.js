import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/manageprojects.css";

const API = "http://localhost:5000/api/projects";

export default function ManageProjects() {

  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [showModal, setShowModal] = useState(false);

  const [projects, setProjects] = useState([]);

  const [editId, setEditId] = useState(null);

  const [projectData, setProjectData] = useState({
    name: "",
    city: "",
    address: "",
    projectId: "",
    description: "",
    active: true,
  });

  /* =========================================
     FETCH PROJECTS
  ========================================= */

  const fetchProjects = async () => {

    try {

      const res = await axios.get(API);

      setProjects(res.data.data || []);

    } catch (err) {

      console.log("Fetch Error", err);

    }

  };

  useEffect(() => {

    fetchProjects();

  }, []);

  /* =========================================
     SAVE PROJECT
  ========================================= */

  const handleSave = async () => {

    try {

      if (!projectData.name || !projectData.projectId) {

        alert("Name & Project ID required ❌");

        return;

      }

      /* ================= EDIT ================= */

      if (editId) {

        await axios.put(

          `${API}/${editId}`,
          projectData

        );

        alert("Project Updated ✅");

      }

      /* ================= CREATE ================= */

      else {

        await axios.post(
          API,
          projectData
        );

        alert("Project Added ✅");

      }

      /* RESET */

      setProjectData({

        name: "",
        city: "",
        address: "",
        projectId: "",
        description: "",
        active: true,

      });

      setEditId(null);

      setShowModal(false);

      fetchProjects();

    }

    catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Save failed ❌"
      );

    }

  };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (proj) => {

    setProjectData({

      name: proj.name || "",
      city: proj.city || "",
      address: proj.address || "",
      projectId: proj.projectId || "",
      description: proj.description || "",
      active: proj.active,

    });

    setEditId(proj._id);

    setShowModal(true);

  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm("Delete this project?");

    if (!confirmDelete) return;

    try {

      await axios.delete(`${API}/${id}`);

      alert("Project Deleted ✅");

      fetchProjects();

    }

    catch (err) {

      console.log(err);

      alert("Delete failed ❌");

    }

  };

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`main-content ${isOpen ? "shifted" : "full"}`}>

        {/* ================= TOP BAR ================= */}

        <div className="top-bar">

          <h3>Projects</h3>

          <button
            className="add-btn"
            onClick={() => {

              setShowModal(true);

              setEditId(null);

              setProjectData({

                name: "",
                city: "",
                address: "",
                projectId: "",
                description: "",
                active: true,

              });

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
                  <td colSpan="4">
                    No Projects Found
                  </td>
                </tr>

              ) : (

                projects.map((proj) => (

                  <tr key={proj._id}>

                    <td>{proj.name}</td>

                    <td>{proj.city}</td>

                    <td>
                      {proj.active ? "Yes" : "No"}
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(proj)}
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(proj._id)
                        }
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

                <h3>
                  {editId
                    ? "Edit Project"
                    : "New Project"}
                </h3>

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