// FILE: src/pages/reception/CreateVisit.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../components/Sidebar";

import "../../styles/createvisit.css";

export default function CreateVisit() {

  const [isOpen, setIsOpen] = useState(true);

  const [loading, setLoading] = useState(false);

  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({

    clientName: "",

    mobile: "",

    project: "",

    attendedManager: "",

    visitStatus: "IN_OFFICE",

    bookingStatus: "PENDING"

  });

  useEffect(() => {

    fetchManagers();

  }, []);

  const fetchManagers = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/managers"
      );

      setManagers(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      // 🔥 selected manager details
      const selectedManager = managers.find(
        (m) => m._id === form.attendedManager
      );

      // 🔥 create visit + auto assign lead to manager
      await axios.post(

        "http://localhost:5000/api/create-visit",

        {

          ...form,

          assigned_manager:
            selectedManager?.email || ""

        }

      );

      alert("Visit Created Successfully ✅");

      setForm({

        clientName: "",

        mobile: "",

        project: "",

        attendedManager: "",

        visitStatus: "IN_OFFICE",

        bookingStatus: "PENDING"

      });

    }

    catch (err) {

      console.log(err);

      alert("Error creating visit ❌");

    }

    finally {

      setLoading(false);

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

        <div className="create-visit-page">

          <div className="create-visit-card">

            <div className="visit-header">

              <h1>Create Visit</h1>

              <p>
                Add new client visit details
              </p>

            </div>

            <form
              className="create-visit-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Client Name
                </label>

                <input
                  type="text"
                  name="clientName"
                  placeholder="Enter client name"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Mobile Number
                </label>

                <input
                  type="text"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Project Name
                </label>

                <input
                  type="text"
                  name="project"
                  placeholder="Enter project name"
                  value={form.project}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Visit Status
                </label>

                <select
                  name="visitStatus"
                  value={form.visitStatus}
                  onChange={handleChange}
                >

                  <option value="IN_OFFICE">
                    In Office
                  </option>

                  <option value="VISIT_DONE">
                    Site Visit Done
                  </option>

                  <option value="BOOKED">
                    Booked
                  </option>

                  <option value="FOLLOWUP">
                    Followup
                  </option>

                  <option value="NOT_BOOKED">
                    Not Booked
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Booking Status
                </label>

                <select
                  name="bookingStatus"
                  value={form.bookingStatus}
                  onChange={handleChange}
                >

                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="BOOKED">
                    Booked
                  </option>

                  <option value="NOT_BOOKED">
                    Not Booked
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>
                  Assign Manager
                </label>

                <select
                  name="attendedManager"
                  value={form.attendedManager}
                  onChange={handleChange}
                  required
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

              </div>

              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >

                {loading
                  ? "Saving..."
                  : "Save Visit"}

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}