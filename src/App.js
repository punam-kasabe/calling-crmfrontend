import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Requests from "./pages/Requests";
import Settings from "./pages/Settings";
import Upload from "./pages/Upload"; // 🔥 ADD

/* 🔥 LEADS SUB PAGES */
import Pipeline from "./pages/Pipeline";
import BulkUpdate from "./pages/BulkUpdate";
import SVPDashboard from "./pages/SVPDashboard";
import PersonalisedReport from "./pages/PersonalisedReport";
import OutgoingCalls from "./pages/OutgoingCalls";

/* ⚙️ SETTINGS SUB PAGES */
import ManageUsers from "./pages/ManageUsers";
import ManageProjects from "./pages/ManageProjects";
import ManageCampaigns from "./pages/ManageCampaigns";

import "bootstrap-icons/font/bootstrap-icons.css";

/* 🔐 PROTECTED ROUTE */
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" replace />;
};

/* 🔓 PUBLIC ROUTE */
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 LOGIN */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔐 DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 📁 LEADS */}
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <Leads />
            </PrivateRoute>
          }
        />

        {/* 🔥 LEADS SUBMENU */}
        <Route
          path="/leads/pipeline"
          element={
            <PrivateRoute>
              <Pipeline />
            </PrivateRoute>
          }
        />

        <Route
          path="/leads/bulk-update"
          element={
            <PrivateRoute>
              <BulkUpdate />
            </PrivateRoute>
          }
        />

        <Route
          path="/leads/svp-dashboard"
          element={
            <PrivateRoute>
              <SVPDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/leads/personalised-report"
          element={
            <PrivateRoute>
              <PersonalisedReport />
            </PrivateRoute>
          }
        />

        <Route
          path="/leads/outgoing-calls"
          element={
            <PrivateRoute>
              <OutgoingCalls />
            </PrivateRoute>
          }
        />

        {/* 👤 USERS */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />

        {/* 📈 REPORTS */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />

        {/* 📨 REQUESTS */}
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <Requests />
            </PrivateRoute>
          }
        />

        {/* ⚙️ SETTINGS MAIN */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* 🔥 SETTINGS SUBMENU ROUTES */}
        <Route
          path="/settings/manage-users"
          element={
            <PrivateRoute>
              <ManageUsers />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings/manage-projects"
          element={
            <PrivateRoute>
              <ManageProjects />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings/manage-campaigns"
          element={
            <PrivateRoute>
              <ManageCampaigns />
            </PrivateRoute>
          }
        />

        {/* 🔥 CSV UPLOAD (ADMIN ONLY UI HANDLED INSIDE PAGE) */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}