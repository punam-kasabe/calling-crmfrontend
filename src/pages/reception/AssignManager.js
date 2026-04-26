import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/reception.css";

export default function AssignManager() {

  const [isOpen, setIsOpen] = useState(true);

  const [visits, setVisits] = useState([]);

  const [managers, setManagers] = useState([]);

  const [selectedManager, setSelectedManager] = useState({});

  useEffect(() => {

    fetchVisits();

    fetchManagers();

  }, []);

  const fetchVisits = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/visit-entries"
      );

      setVisits(res.data);

    } catch {

      console.log("Visit fetch error");

    }

  };

  const fetchManagers = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/managers"
      );

      setManagers(res.data);

    } catch {

      console.log("Manager fetch error");

    }

  };

  const assignManager = async (visitId) => {

    try {

      await axios.put(

        `http://localhost:5000/api/assign-manager/${visitId}`,

        {
          managerId: selectedManager[visitId]
        }

      );

      alert("Manager Assigned ✅");

      fetchVisits();

    } catch {

      alert("Assign failed ❌");

    }

  };

  return (

    <div className="layout">

      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <div
        className={`main-content ${
          isOpen ? "shifted" : "full"
        }`}
      >

        <div className="reception-page">

          <h1>Assign Manager</h1>

          <table className="visit-table">

            <thead>

              <tr>

                <th>Client</th>

                <th>Phone</th>

                <th>Project</th>

                <th>Manager</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {visits.map((v) => (

                <tr key={v._id}>

                  <td>{v.clientName}</td>

                  <td>{v.mobile}</td>

                  <td>{v.project}</td>

                  <td>

                    <select

                      value={
                        selectedManager[v._id] || ""
                      }

                      onChange={(e) =>

                        setSelectedManager({

                          ...selectedManager,

                          [v._id]:
                            e.target.value

                        })

                      }

                      className="manager-select"
                    >

                      <option value="">
                        Select Manager
                      </option>

                      {managers.map((m) => (

                        <option
                          key={m._id}
                          value={m._id}
                        >

                          {m.name}

                        </option>

                      ))}

                    </select>

                  </td>

                  <td>

                    <button

                      className="assign-btn"

                      onClick={() =>
                        assignManager(v._id)
                      }
                    >

                      Assign

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}