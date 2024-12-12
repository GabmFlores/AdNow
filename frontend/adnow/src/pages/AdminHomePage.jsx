import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import {
  FaUser,
  FaClipboardList,
  FaNewspaper,
  FaFileAlt,
} from "react-icons/fa"; // Import necessary icons
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for routing
import axios from "axios";
import { useUsers } from "../store/User";

function AdminHomePage() {
  const { authenticatedUser } = useUsers(); // Zustand store
  const [username, setUsername] = useState(""); // State for username
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Get the current date
  const formatDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString(undefined, options);
  };

  // Check if the user is authenticated and redirect if not
  useEffect(() => {
    if (!authenticatedUser) {
      // If not authenticated, redirect to login page
      navigate("/");
    } else {
      const fetchUserData = async () => {
        try {
          // Fetch user data if authenticated
          const response = await axios.get(
            `/api/users/${authenticatedUser._id}`
          );
          setUsername(response.data.name || "Admin"); // Update username from fetched data
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUsername("Admin"); // Fallback username
        }
      };
      fetchUserData(); // Fetch user data when authenticated
    }
  }, [authenticatedUser, navigate]); // Depend on authenticatedUser and navigate

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Main Content */}
      <Box flex="1" display="flex" flexDirection="column" overflow="hidden">
        <Box
          ml="80px" // Matches the width of the side navbar
          mt="60px" // Matches the height of the top navbar
          p={6}
          flex="1"
          overflowY="auto" // Allow scrolling only for the main content
          bg="gray.50"
        >
          {/* Greeting and Date */}
          <Box mb={6}>
            <Text fontSize="2xl" fontWeight="bold">
              Hello, {username}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {formatDate()}
            </Text>
          </Box>

          {/* Steps to get started */}
          <Box boxShadow="md" bg="white" p={8} borderRadius="md">
            <Box fontSize="xl" fontWeight="bold" mb={4}>
              Steps to get started
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              {/* Step 1 */}
              <Link to="/settings">
                <Box
                  display="flex"
                  alignItems="center"
                  mb={6}
                  p={4}
                  borderRadius="lg"
                  border="1px solid transparent" // Transparent border to add focus without affecting layout
                  background="white" // Light background
                  boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)" // Stronger, more emphasized shadow
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.08)", // Increased pop effect on hover
                    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)", // Emphasized shadow on hover
                    borderColor: "teal.500", // Border color change
                    borderWidth: "2px", // Increased border width on hover
                  }}
                  _focus={{
                    outline: "none", // Remove outline on focus
                    boxShadow: "0 0 0 3px rgba(0, 255, 255, 0.5)", // Highlight focus with teal
                  }}
                  _active={{
                    transform: "scale(1.02)", // Slightly smaller scaling effect when active
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow when clicked
                  }}
                >
                  <Icon as={FaUser} fontSize="30px" />
                  <Text color="gray.500" fontSize="sm" ml={4}>
                    Setup Profile / Settings
                  </Text>
                </Box>
              </Link>

              {/* Step 2 */}
              <Link to="/files">
                <Box
                  display="flex"
                  alignItems="center"
                  mb={6}
                  p={4}
                  borderRadius="lg"
                  border="1px solid transparent" // Transparent border to add focus without affecting layout
                  background="white" // Light background
                  boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)" // Stronger, more emphasized shadow
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.08)", // Increased pop effect on hover
                    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)", // Emphasized shadow on hover
                    borderColor: "teal.500", // Border color change
                    borderWidth: "2px", // Increased border width on hover
                  }}
                  _focus={{
                    outline: "none", // Remove outline on focus
                    boxShadow: "0 0 0 3px rgba(0, 255, 255, 0.5)", // Highlight focus with teal
                  }}
                  _active={{
                    transform: "scale(1.02)", // Slightly smaller scaling effect when active
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow when clicked
                  }}
                >
                  <Icon as={FaClipboardList} fontSize="30px" />
                  <Text color="gray.500" fontSize="sm" ml={4}>
                    Add Patient Records
                  </Text>
                </Box>
              </Link>

              {/* Step 3 */}
              <Link to="/columns">
                <Box
                  display="flex"
                  alignItems="center"
                  mb={6}
                  p={4}
                  borderRadius="lg"
                  border="1px solid transparent" // Transparent border to add focus without affecting layout
                  background="white" // Light background
                  boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)" // Stronger, more emphasized shadow
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.08)", // Increased pop effect on hover
                    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)", // Emphasized shadow on hover
                    borderColor: "teal.500", // Border color change
                    borderWidth: "2px", // Increased border width on hover
                  }}
                  _focus={{
                    outline: "none", // Remove outline on focus
                    boxShadow: "0 0 0 3px rgba(0, 255, 255, 0.5)", // Highlight focus with teal
                  }}
                  _active={{
                    transform: "scale(1.02)", // Slightly smaller scaling effect when active
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow when clicked
                  }}
                >
                  <Icon as={FaNewspaper} fontSize="30px" />
                  <Text color="gray.500" fontSize="sm" ml={4}>
                    Create News Article
                  </Text>
                </Box>
              </Link>

              {/* Step 4 */}
              <Link to="/inbox">
                <Box
                  display="flex"
                  alignItems="center"
                  mb={6}
                  p={4}
                  borderRadius="lg"
                  border="1px solid transparent" // Transparent border to add focus without affecting layout
                  background="white" // Light background
                  boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)" // Stronger, more emphasized shadow
                  cursor="pointer"
                  transition="all 0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.08)", // Increased pop effect on hover
                    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)", // Emphasized shadow on hover
                    borderColor: "teal.500", // Border color change
                    borderWidth: "2px", // Increased border width on hover
                  }}
                  _focus={{
                    outline: "none", // Remove outline on focus
                    boxShadow: "0 0 0 3px rgba(0, 255, 255, 0.5)", // Highlight focus with teal
                  }}
                  _active={{
                    transform: "scale(1.02)", // Slightly smaller scaling effect when active
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)", // Slightly stronger shadow when clicked
                  }}
                >
                  <Icon as={FaFileAlt} fontSize="30px" />
                  <Text color="gray.500" fontSize="sm" ml={4}>
                    Manage Appointments
                  </Text>
                </Box>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default AdminHomePage;
