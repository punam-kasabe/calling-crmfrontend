import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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



/* =========================================
   🔐 PRIVATE ROUTE
========================================= */
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? children : <Navigate to="/" replace />;
};

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
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <PrivateRoute>
              <ManageUsers />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-projects"
          element={
            <PrivateRoute>
              <ManageProjects />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-campaigns"
          element={
            <PrivateRoute>
              <ManageCampaigns />
            </PrivateRoute>
          }
        />

        <Route
          path="/apikeys"
          element={
            <PrivateRoute>
              <ApiKeys />
            </PrivateRoute>
          }
        />

        <Route
          path="/bulk-upload"
          element={
            <PrivateRoute>
              <BulkUpload />
            </PrivateRoute>
          }
        />

        {/* EXECUTIVE */}
        <Route
          path="/executive-dashboard"
          element={
            <PrivateRoute>
              <ExecutiveDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/call-logs"
          element={
            <PrivateRoute>
              <CallLogs />
            </PrivateRoute>
          }
        />

        <Route
          path="/followups"
          element={
            <PrivateRoute>
              <Followups />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-leads"
          element={
            <PrivateRoute>
              <MyLeads />
            </PrivateRoute>
          }
        />

        {/* MANAGER */}
        <Route
          path="/assigned-clients"
          element={
            <PrivateRoute>
              <AssignedClients />
            </PrivateRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoute>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/update-booking-status"
          element={
            <PrivateRoute>
              <UpdateBookingStatus />
            </PrivateRoute>
          }
        />

        {/* RECEPTION */}
        <Route
  path="/reception-dashboard"
  element={
    <PrivateRoute>
      <ReceptionDashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/search-client"
  element={
    <PrivateRoute>
      <SearchClient />
    </PrivateRoute>
  }
/>

<Route
  path="/create-visit"
  element={
    <PrivateRoute>
      <CreateVisit />
    </PrivateRoute>
  }
/>

<Route
  path="/visit-entries"
  element={
    <PrivateRoute>
      <VisitEntries />
    </PrivateRoute>
  }
/>

<Route
  path="/assign-manager"
  element={
    <PrivateRoute>
      <AssignManager />
    </PrivateRoute>
  }
/>
        {/* REPORTS */}
        <Route
          path="/projects-report"
          element={
            <PrivateRoute>
              <ProjectsReport />
            </PrivateRoute>
          }
        />

        <Route
          path="/roi-report"
          element={
            <PrivateRoute>
              <ROIReport />
            </PrivateRoute>
          }
        />

        <Route
          path="/sources-report"
          element={
            <PrivateRoute>
              <SourcesReport />
            </PrivateRoute>
          }
        />

        <Route
          path="/team-performance"
          element={
            <PrivateRoute>
              <TeamPerformance />
            </PrivateRoute>
          }
        />

        {/* GENERAL */}
        <Route path="/bulk-update" element={<PrivateRoute><BulkUpdate /></PrivateRoute>} />
        <Route path="/channel-partner" element={<PrivateRoute><ChannelPartner /></PrivateRoute>} />
        <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
        <Route path="/lead-volume" element={<PrivateRoute><LeadVolume /></PrivateRoute>} />
        <Route path="/marketing-roi" element={<PrivateRoute><MarketingROI /></PrivateRoute>} />
        <Route path="/outgoing-calls" element={<PrivateRoute><OutgoingCalls /></PrivateRoute>} />
        <Route path="/personalised-report" element={<PrivateRoute><PersonalisedReport /></PrivateRoute>} />
        <Route path="/pipeline" element={<PrivateRoute><Pipeline /></PrivateRoute>} />
       <Route path="/request" element={<PrivateRoute><Requests /></PrivateRoute>} />
       <Route path="/setting" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/svp-dashboard" element={<PrivateRoute><SVPDashboard /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}