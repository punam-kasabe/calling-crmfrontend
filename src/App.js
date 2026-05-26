import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
/* 🔐 AUTH */
import Login from "./pages/auth/Login";

/* 🛠 ADMIN */
import Dashboard from "./pages/admin/Dashboard";
import Reports from "./pages/admin/Reports";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageCampaigns from "./pages/admin/ManageCampaigns";
import ApiKeys from "./pages/admin/ApiKeys";
import BulkUpload from "./pages/admin/BulkUpload";
import ProtectedRoute from "./components/ProtectedRoute";

/* 👨‍💼 EXECUTIVE */
import CallLogs from "./pages/executive/CallLogs";
import ExecutiveDashboard from "./pages/executive/ExecutiveDashboard";
import MyLeads from "./pages/executive/MyLeads";
import Followups from "./pages/executive/Followups";

/* 👨‍💻 MANAGER */
import AssignedClients from "./pages/manager/AssignedClients";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import UpdateBookingStatus from "./pages/manager/UpdateBookingStatus";

/* 🏢 RECEPTION */
import ReceptionDashboard from "./pages/reception/ReceptionDashboard";
import SearchClient from "./pages/reception/SearchClient";
import CreateVisit from "./pages/reception/CreateVisit";
import VisitEntries from "./pages/reception/VisitEntries";
import AssignManager from "./pages/reception/AssignManager";

/* 📊 REPORTS */
import ProjectsReport from "./pages/reports/ProjectsReport";
import ROIReport from "./pages/reports/ROIReport";
import SourcesReport from "./pages/reports/SourcesReport";
import TeamPerformance from "./pages/reports/TeamPerformance";

/* 📄 NORMAL PAGES */
import BulkUpdate from "./pages/BulkUpdate";
import ChannelPartner from "./pages/ChannelPartner";
import Leads from "./pages/Leads";
import LeadVolume from "./pages/LeadVolume";
import MarketingROI from "./pages/MarketingROI";
import OutgoingCalls from "./pages/OutgoingCalls";
import PersonalisedReport from "./pages/PersonalisedReport";
import Pipeline from "./pages/Pipeline";
import Requests from "./pages/Requests";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload";
import SVPDashboard from "./pages/SVPDashboard";
import Users from "./pages/Users";

import "bootstrap-icons/font/bootstrap-icons.css";
import MobileBlock from "./components/MobileBlock";
/* =========================================
   🔓 PUBLIC ROUTE
========================================= */
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    children
  );
};

/* =========================================
   🚀 APP
========================================= */
export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
  const checkDevice = () => {
    const mobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        navigator.userAgent
      ) || window.innerWidth < 1024;

    setIsMobile(mobile);
  };

  checkDevice();

  window.addEventListener("resize", checkDevice);

  return () => window.removeEventListener("resize", checkDevice);
}, []);


  if (isMobile) {
  return <MobileBlock />;
}

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <ProtectedRoute>
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-projects"
          element={
            <ProtectedRoute>
              <ManageProjects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-campaigns"
          element={
            <ProtectedRoute>
              <ManageCampaigns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apikeys"
          element={
            <ProtectedRoute>
              <ApiKeys />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bulk-upload"
          element={
            <ProtectedRoute>
              <BulkUpload />
            </ProtectedRoute>
          }
        />

        {/* EXECUTIVE */}
        <Route
          path="/executive-dashboard"
          element={
            <ProtectedRoute>
              <ExecutiveDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/call-logs"
          element={
            <ProtectedRoute>
              <CallLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/followups"
          element={
            <ProtectedRoute>
              <Followups />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leads"
          element={
            <ProtectedRoute>
              <MyLeads />
            </ProtectedRoute>
          }
        />

        {/* MANAGER */}
        <Route
          path="/assigned-clients"
          element={
            <ProtectedRoute>
              <AssignedClients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-booking-status"
          element={
            <ProtectedRoute>
              <UpdateBookingStatus />
            </ProtectedRoute>
          }
        />

        {/* RECEPTION */}
        <Route
  path="/reception-dashboard"
  element={
    <ProtectedRoute>
      <ReceptionDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/search-client"
  element={
    <ProtectedRoute>
      <SearchClient />
    </ProtectedRoute>
  }
/>

<Route
  path="/create-visit"
  element={
    <ProtectedRoute>
      <CreateVisit />
    </ProtectedRoute>
  }
/>

<Route
  path="/visit-entries"
  element={
    <ProtectedRoute>
      <VisitEntries />
    </ProtectedRoute>
  }
/>

<Route
  path="/assign-manager"
  element={
    <ProtectedRoute>
      <AssignManager />
    </ProtectedRoute>
  }
/>
        {/* REPORTS */}
        <Route
          path="/projects-report"
          element={
            <ProtectedRoute>
              <ProjectsReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roi-report"
          element={
            <ProtectedRoute>
              <ROIReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sources-report"
          element={
            <ProtectedRoute>
              <SourcesReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team-performance"
          element={
            <ProtectedRoute>
              <TeamPerformance />
            </ProtectedRoute>
          }
        />

        {/* GENERAL */}
        <Route path="/bulk-update" element={<ProtectedRoute><BulkUpdate /></ProtectedRoute>} />
        <Route path="/channel-partner" element={<ProtectedRoute><ChannelPartner /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/lead-volume" element={<ProtectedRoute><LeadVolume /></ProtectedRoute>} />
        <Route path="/marketing-roi" element={<ProtectedRoute><MarketingROI /></ProtectedRoute>} />
        <Route path="/outgoing-calls" element={<ProtectedRoute><OutgoingCalls /></ProtectedRoute>} />
        <Route path="/personalised-report" element={<ProtectedRoute><PersonalisedReport /></ProtectedRoute>} />
        <Route path="/pipeline" element={<ProtectedRoute><Pipeline /></ProtectedRoute>} />
       <Route path="/request" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
       <Route path="/setting" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/svp-dashboard" element={<ProtectedRoute><SVPDashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}