// FILE: src/pages/PrivacyPolicy.js

import React from "react";
import "../styles/privacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="privacy-container">

        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>Zaminwale Pvt Ltd</p>
          <span>Last Updated: September 15, 2026</span>
        </div>

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
            <li>To provide information about available properties.</li>
            <li>To manage customer and lead records.</li>
            <li>To improve our services and customer experience.</li>
            <li>To maintain communication related to your enquiry.</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Sharing</h2>
          <p>
            We do not sell or rent your personal information.
          </p>

          <p>
            We may share information with authorized employees, service
            providers, technology providers, or business partners when
            reasonably necessary to provide our services or respond to
            your enquiry.
          </p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>
            We take reasonable technical and organizational measures to
            protect personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain personal information for as long as reasonably
            necessary to provide our services, manage enquiries, maintain
            business records, and comply with applicable legal or
            regulatory requirements.
          </p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>
            You may contact us to request access to, correction of, or
            deletion of personal information that we hold about you,
            subject to applicable legal requirements.
          </p>
        </section>

        <section>
          <h2>9. Third-Party Services</h2>
          <p>
            Our services may use third-party platforms and technologies,
            including Meta services, hosting providers, analytics
            services, and communication tools. These services may process
            information according to their own privacy policies.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any
            changes will be reflected on this page with an updated
            "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>

          <p>
            If you have questions about this Privacy Policy or want to
            request information about your personal data, please contact
            Zaminwale Pvt Ltd.
          </p>

          <div className="privacy-contact">
            <p>
              <strong>Company:</strong> Zaminwale Pvt Ltd
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@zaminwale.com">
                info@zaminwale.com
              </a>
            </p>
          </div>
        </section>

        <div className="privacy-footer">
          © {new Date().getFullYear()} Zaminwale Pvt Ltd. All rights reserved.
        </div>

      </div>
    </div>
  );
}