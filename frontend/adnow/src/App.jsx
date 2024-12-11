import { Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom"; // Removed useNavigate and useEffect
import { useUsers } from "./store/User"; // Zustand store for managing authentication state
import AppointPage from "./pages/AppointPage"; // Regular Appointment page
import Navbar from "./components/Navbar"; // Standard Navbar (Non-authenticated)
import AdminNavbar from "./components/AdminTopNavbar"; // Admin Top Navbar
import AdminSideNavbar from "./components/AdminSideNavbar"; // Admin Side Navbar
import HomePage from "./pages/HomePage"; // Regular HomePage
import AdminHomePage from "./pages/AdminHomePage"; // Admin HomePage
import AdminInboxPage from "./pages/AdminInboxPage"; // Admin Inbox Page
import Footer from "./components/Footer"; // Standard Footer
import AdminFooter from "./components/AdminFooter"; // Admin Footer
import PrivateRoute from "./store/PrivateRoute"; // Import PrivateRoute for admin route protection
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import PasswordPage from "./pages/PassPage";

function App() {
  const { authenticatedUser } = useUsers(); // Zustand store (no need to check session in useEffect anymore)

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Render different navbars based on authentication */}
      {authenticatedUser ? <AdminNavbar /> : <Navbar />}

      {/* Main layout */}
      <Box flex="1" display="flex">
        {authenticatedUser && <AdminSideNavbar />}
        <Box flex="1" p={4}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/appointments" element={<AppointPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <AdminHomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <PrivateRoute>
                  <AdminInboxPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/password"
              element={
                <PrivateRoute>
                  <PasswordPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </Box>

      {/* Footer */}
      {authenticatedUser ? <AdminFooter /> : <Footer />}
    </Box>
  );
}

export default App;
