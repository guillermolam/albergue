import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { I18nProvider } from "./contexts/I18nContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageSelector } from "./components/LanguageSelector";
import { UserProfileMenu } from "./components/UserProfileMenu";
import { HomePage } from "./components/HomePage";
import { NewBookingFlow } from "./components/NewBookingFlow";
import { GuestDashboard } from "./components/GuestDashboard";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { BookingsTable } from "./components/admin/BookingsTable";
import { BedManagement } from "./components/admin/BedManagement";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsAndConditions } from "./components/TermsAndConditions";
import { CookiePolicy } from "./components/CookiePolicy";
import { LegalNotice } from "./components/LegalNotice";

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Global fixed elements - Visible on all pages */}
            <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3">
              <LanguageSelector />
              <UserProfileMenu />
            </div>

            <Routes>
              {/* Home Page with 3D Map */}
              <Route path="/" element={<HomePage />} />

              {/* Booking Flow */}
              <Route path="/book" element={<NewBookingFlow />} />

              {/* Guest Dashboard - Shows after booking complete */}
              <Route path="/dashboard" element={<GuestDashboard />} />

              {/* Legal Pages - Spanish Routes */}
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/terminos" element={<TermsAndConditions />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/aviso-legal" element={<LegalNotice />} />

              {/* Legal Pages - English Routes */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/legal-notice" element={<LegalNotice />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="bookings" element={<BookingsTable />} />
                <Route path="beds" element={<BedManagement />} />
                <Route path="guests" element={<GuestsPlaceholder />} />
                <Route path="analytics" element={<AnalyticsPlaceholder />} />
                <Route path="settings" element={<SettingsPlaceholder />} />
              </Route>
            </Routes>

            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}

// Placeholder components for remaining admin pages
function GuestsPlaceholder() {
  return (
    <div className="text-center py-12">
      <h2 className="mb-4">Guests Management</h2>
      <p className="text-gray-600">Guest management interface coming soon</p>
    </div>
  );
}

function AnalyticsPlaceholder() {
  return (
    <div className="text-center py-12">
      <h2 className="mb-4">Analytics & Reports</h2>
      <p className="text-gray-600">Analytics dashboard coming soon</p>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="text-center py-12">
      <h2 className="mb-4">Settings</h2>
      <p className="text-gray-600">Settings panel coming soon</p>
    </div>
  );
}

export default App;
