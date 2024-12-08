import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import {
  FaUser,
  FaClipboardList,
  FaNewspaper,
  FaFileAlt,
} from "react-icons/fa"; // Import necessary icons
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
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
            `/api/users/${authenticatedUser.id}`
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
              <Box display="flex" alignItems="center" mb={6}>
                <Icon as={FaUser} fontSize="30px" />
                <Text color="gray.500" fontSize="sm" ml={4}>
                  Setup Profile / Settings
                </Text>
              </Box>

              {/* Step 2 */}
              <Box display="flex" alignItems="center" mb={6}>
                <Icon as={FaClipboardList} fontSize="30px" />
                <Text color="gray.500" fontSize="sm" ml={4}>
                  Add Patient Records
                </Text>
              </Box>

              {/* Step 3 */}
              <Box display="flex" alignItems="center" mb={6}>
                <Icon as={FaNewspaper} fontSize="30px" />
                <Text color="gray.500" fontSize="sm" ml={4}>
                  Create News Article
                </Text>
              </Box>

              {/* Step 4 */}
              <Box display="flex" alignItems="center" mb={6}>
                <Icon mt="10px" as={FaFileAlt} fontSize="30px" />
                <Text color="gray.500" fontSize="sm" ml={4}>
                  Manage Appointments
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

export default AdminHomePage;
