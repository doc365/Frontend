import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import UserManagement from "./pages/UserManagement/UserManagement";
import ManageAdminRoles from "./pages/UserManagement/ManageAdminRoles/ManageAdminRoles";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import Announcements from "./pages/Announcements/Announcements";
import AppDetail from "./pages/AppDetail/AppDetail";

// Settings
import Settings from "./pages/Settings/Settings";
import SettingsLayout from "./pages/Settings/SettingsLayout";
import TwoFactor from "./pages/Settings/TwoFactor/TwoFactor";
import EmailNotification from "./pages/Settings/EmailNotification/EmailNotification";
import SingpassCorppass from "./pages/Settings/SingpassCorppass/SingpassCorppass";
import AdvancedSettings from "./pages/Settings/AdvancedSettings/AdvancedSettings";
import AccountSettings from "./pages/Settings/AccountSettings/AccountSettings";
import SmsNotification from "./pages/Settings/SmsNotification/SmsNotification";
import StorageConnection from "./pages/Settings/StorageConnection/StorageConnection";
import SmtpSettings from "./pages/Settings/SmtpSettings/SmtpSettings";

// Reports
import Reports from "./pages/Reports/Reports";
import ReportsLayout from "./pages/Reports/ReportsLayout";
import UserActivityReport from "./pages/Reports/UserActivity/UserActivityReport";
import EmailDeliveryReport from "./pages/Reports/NotificationDelivery/EmailDeliveryReport";
import SmsDeliveryReport from "./pages/Reports/NotificationDelivery/SmsDeliveryReport";

// Customize
import Customize from "./pages/Customize/Customize";
import AppRegistration from "./pages/Customize/AppRegistration/AppRegistration";
import UrlsSignIn from "./pages/Customize/UrlsSignIn/UrlsSignIn";
import EmailTemplates from "./pages/Customize/EmailTemplates/EmailTemplates";
import LogoTheme from "./pages/Customize/LogoTheme/LogoTheme";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Home />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/admin-roles" element={<ManageAdminRoles />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="app/:slug" element={<AppDetail />} />

              {/* Settings */}
              <Route path="settings" element={<SettingsLayout />}>
                <Route path="singpass-corppass" element={<SingpassCorppass />} />
                <Route path="advanced" element={<AdvancedSettings />} />
                <Route path="two-factor" element={<TwoFactor />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="email-notification" element={<EmailNotification />} />
                <Route path="sms-notification" element={<SmsNotification />} />
                <Route path="storage" element={<StorageConnection />} />
                <Route path="smtp" element={<SmtpSettings />} />
              </Route>

              {/* Reports */}
              <Route path="reports" element={<Reports />} />
              <Route path="reports" element={<ReportsLayout />}>
                <Route path="user-activity" element={<UserActivityReport />} />
                <Route path="notification-delivery/email" element={<EmailDeliveryReport />} />
                <Route path="notification-delivery/sms" element={<SmsDeliveryReport />} />
              </Route>

              {/* Customize */}
              <Route path="customize" element={<Customize />}>
                <Route index element={<Navigate to="app-registration" replace />} />
                <Route path="app-registration" element={<AppRegistration />} />
                <Route path="urls-signin" element={<UrlsSignIn />} />
                <Route path="email-templates" element={<EmailTemplates />} />
                <Route path="logo-theme" element={<LogoTheme />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
