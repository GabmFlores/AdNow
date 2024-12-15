import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { useUsers } from "./store/User"; // Zustand store for managing authentication state
import api from "./store/api";
import AppointPage from "./pages/AppointPage";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminTopNavbar";
import AdminSideNavbar from "./components/AdminSideNavbar";
import HomePage from "./pages/HomePage";
import FilesPage from "./pages/FilesPage";
import AdminHomePage from "./pages/AdminHomePage";
import AdminInboxPage from "./pages/AdminInboxPage";
import Footer from "./components/Footer";
import AdminFooter from "./components/AdminFooter";
import PrivateRoute from "./store/PrivateRoute";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import PasswordPage from "./pages/PassPage";
import ColumnsPage from "./pages/ColumnsPage";
import NewsPage from "./pages/NewsPage";
import FullNewsPage from "./pages/FullNewsPage"; // Import the full news page
import ContactPage from "./pages/ContactPage";

function App() {
  const { authenticatedUser, setAuthenticatedUser } = useUsers();

  // Check session authentication on app load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await api.get("/users/auth", {});
        if (response.data.success) {
          setAuthenticatedUser(response.data.user);
        } else {
          setAuthenticatedUser(null);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setAuthenticatedUser(null);
      }
    };

    checkAuthentication();
  }, [setAuthenticatedUser]);

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
            <Route path="/news" element={<NewsPage />} />
            <Route path="/appointments" element={<AppointPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/columns/:id" element={<FullNewsPage />} />{" "}
            {/* New route for full news details */}
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
              path="/settings/password"
              element={
                <PrivateRoute>
                  <PasswordPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/files"
              element={
                <PrivateRoute>
                  <FilesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/columns"
              element={
                <PrivateRoute>
                  <ColumnsPage />
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
