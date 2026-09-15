import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/privacyPolicy.css";

export default function PrivacyPolicy() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="privacy-layout">

      {/* SIDEBAR */}
      {user && (
        <Sidebar
          user={user}
          handleLogout={handleLogout}
        />
      )}

      {/* PRIVACY POLICY CONTENT */}
      <main className="privacy-main">

        <div className="privacy-card">

          <div className="privacy-header">
            <h1>Privacy Policy</h1>
            <p className="company-name">Zaminwale Pvt Ltd</p>
            <p className="updated-date">
              Last Updated: September 15, 2026
            </p>
          </div>

          <hr />

          <section>
            <h2>1. Introduction</h2>

            <p>
              Zaminwale Pvt Ltd ("we", "our", or "us") respects your privacy
              and is committed to protecting the personal information that
              you provide to us.
            </p>

            <p>
              This Privacy Policy explains how we collect, use, store, and
              protect information received through our website, CRM system,
              advertising platforms, and lead generation services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>

            <p>
              Depending on how you interact with us, we may collect the
              following information:
            </p>

            <ul>
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Location or city</li>
              <li>Property or project preferences</li>
              <li>Information submitted through lead forms</li>
              <li>Communication and enquiry details</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Received Through Meta</h2>

            <p>
              If you submit your information through a Meta/Facebook or
              Instagram lead form, we may receive the information that you
              voluntarily provide through that form.
            </p>

            <p>
              This information may include your name, phone number, email
              address, location, and other information requested by the
              applicable lead form.
            </p>

            <p>
              We use this information to contact you regarding your enquiry,
              property requirements, projects, site visits, and related
              services.
            </p>
          </section>

          <section>
            <h2>4. How We Use Your Information</h2>

            <ul>
              <li>To respond to enquiries and requests.</li>
              <li>To contact you regarding our real-estate projects.</li>
              <li>To arrange site visits and meetings.</li>
              <li>To provide information about properties and projects.</li>
              <li>To manage customer enquiries through our CRM.</li>
              <li>To improve our services and communication.</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Sharing</h2>

            <p>
              We do not sell your personal information. Information may be
              shared with authorized employees, service providers, or
              technology platforms only when necessary to provide our
              services or manage your enquiry.
            </p>
          </section>

          <section>
            <h2>6. Data Security</h2>

            <p>
              We take reasonable technical and organizational measures to
              protect your personal information against unauthorized access,
              misuse, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2>7. Data Retention</h2>

            <p>
              We retain personal information only for as long as reasonably
              necessary for business, customer-service, legal, or regulatory
              purposes.
            </p>
          </section>

          <section>
            <h2>8. Your Rights</h2>

            <p>
              You may contact us to request information about the personal
              data we hold about you or to request correction or deletion
              where applicable.
            </p>
          </section>

          <section>
            <h2>9. Third-Party Services</h2>

            <p>
              Our services may use third-party platforms such as Meta,
              hosting providers, analytics services, communication services,
              and other technology providers. Their use of information is
              governed by their respective privacy policies.
            </p>
          </section>

          <section>
            <h2>10. Changes to This Privacy Policy</h2>

            <p>
              We may update this Privacy Policy from time to time. Any
              changes will be reflected on this page with an updated date.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>

            <p>
              If you have any questions regarding this Privacy Policy or how
              your information is handled, please contact Zaminwale Pvt Ltd.
            </p>
          </section>

        </div>

      </main>
    </div>
  );
}