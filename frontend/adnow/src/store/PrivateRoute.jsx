import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useUsers } from "../store/User";

const PrivateRoute = ({ children, redirectTo = "/" }) => {
  const { setAuthenticatedUser } = useUsers();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/users/auth", {
          credentials: "include", // Important for cookies
        });
        const data = await response.json();

        if (data.success) {
          setAuthenticated(true);
          setAuthenticatedUser(data.user);
        } else {
          console.error(
            "Authentication failed:",
            data.error || data.message || data
          );
          setAuthenticated(false);
          setAuthenticatedUser(null);
        }
      } catch (error) {
        console.error(
          "Error during authentication check:",
          error.message || error
        );
        setAuthenticated(false);
        setAuthenticatedUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [setAuthenticatedUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? children : <Navigate to={redirectTo} replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};

export default PrivateRoute;
