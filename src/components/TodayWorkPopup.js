import "./todaywork.css";

export default function TodayWorkPopup({

  data,
  onClose

}) {

  return (

    <div className="today-popup-overlay">

      <div className="today-popup">

        <div className="popup-header">

          <h3>
            🔥 Today's Work
          </h3>

          <button
            onClick={onClose}
          >
            ✖
          </button>

        </div>

        {/* FOLLOWUPS */}

        <div className="popup-section">

          <h4>
            📞 Today's Followups
          </h4>

          {

            data.followups?.length > 0

            ? data.followups.map(
              (f, i) => (

              <div
                className="popup-item"
                key={i}
              >

                <strong>
                  {f.name}
                </strong>

                <span>
                  {f.phone}
                </span>

                <small>
                  {f.project}
                </small>

              </div>

            ))

            : <p>No Followups</p>

          }

        </div>

        {/* VISITS */}

        <div className="popup-section">

          <h4>
            🏢 Today's Site Visits
          </h4>

          {

            data.visits?.length > 0

            ? data.visits.map(
              (v, i) => (

              <div
                className="popup-item"
                key={i}
              >

                <strong>
                  {v.clientName}
                </strong>

                <span>
                  {v.mobile}
                </span>

                <small>
                  {v.project}
                </small>

              </div>

            ))

            : <p>No Visits</p>

          }

        </div>

        {/* HOT LEADS */}

        <div className="popup-section">

          <h4>
            🔥 Hot Leads
          </h4>

          {

            data.hotLeads?.length > 0

            ? data.hotLeads.map(
              (h, i) => (

              <div
                className="popup-item"
                key={i}
              >

                <strong>
                  {h.name}
                </strong>

                <span>
                  {h.phone}
                </span>

              </div>

            ))

            : <p>No Hot Leads</p>

          }

        </div>

      </div>

    </div>

  );

}