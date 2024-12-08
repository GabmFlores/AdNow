import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useUsers } from "../store/User"; // Zustand store to manage user state
import axios from "axios"; // To verify session via API

const PrivateRoute = ({ children, redirectTo = "/" }) => {
  const { setAuthenticatedUser } = useUsers(); // Zustand store to manage user state
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if the session is valid via API
        const response = await axios.get("/api/users/auth");

        if (response.data.success) {
          setAuthenticated(true);
          setAuthenticatedUser(response.data.user); // Set the authenticated user
        } else {
          setAuthenticated(false);
          setAuthenticatedUser(null); // Log out if no session is valid
        }
      } catch (error) {
        setAuthenticated(false);
        setAuthenticatedUser(null); // In case of error, clear the session
        console.error("Error during authentication check:", error);
      } finally {
        setLoading(false); // Stop loading once the check is done
      }
    };

    checkAuthentication(); // Perform the authentication check
  }, [setAuthenticatedUser]);

  if (loading) {
    // Optionally show a loading state while checking auth status
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the children; otherwise, redirect
  return authenticated ? children : <Navigate to={redirectTo} replace />;
};

// Prop validation
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};

export default PrivateRoute;
