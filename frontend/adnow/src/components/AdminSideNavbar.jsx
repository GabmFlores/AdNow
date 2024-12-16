import { Box, VStack, IconButton, Tooltip, Badge } from "@chakra-ui/react";
import { FaHome, FaInbox, FaNewspaper, FaFileAlt, FaCog } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation for routing and current location
import { useState, useEffect } from "react"; // Add useState and useEffect
import { useAppointment } from "../store/Appointment"; // Assuming useAppointment is where appointments are fetched

function AdminSideNavbar() {
  const { appointments, fetchAppointments } = useAppointment(); // Assuming fetchAppointments triggers fetching
  const [unscheduledCount, setUnscheduledCount] = useState(0);
  const location = useLocation(); // Get the current location to highlight active route

  // Fetch appointments on mount (if not already fetched)
  useEffect(() => {
    if (appointments.length === 0) {
      fetchAppointments(); // This function should fetch the appointments if not already fetched
    }
  }, [appointments, fetchAppointments]);

  useEffect(() => {
    // Recalculate the unscheduled count whenever appointments change
    const count = appointments.filter(
      (appt) => appt.status === "Unscheduled"
    ).length;
    setUnscheduledCount(count);
  }, [appointments]); // Dependency array ensures this runs when `appointments` updates

  // Function to check if the current route matches the link
  const isActive = (path) =>
    location.pathname.startsWith(path) ? { bg: "blue.200" } : {}; // Lighter active state to blend better

  return (
    <Box
      bg="white"
      w={{ base: "60px", sm: "80px" }} // Set dynamic width for responsiveness
      position="fixed"
      top="20%"
      left="0"
      height="auto" // Adjust height based on content
      boxShadow="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      border="2px solid #e2e8f0"
      zIndex="9"
      borderRadius="0px 50px 50px 0px" // Rounded left corners
      padding={{ base: "1rem", sm: "1.5rem" }} // Adjust padding for smaller screens
    >
      <VStack spacing={6}>
        {/* Home Button */}
        <Tooltip label="Home" placement="right" hasArrow>
          <Link to="/" style={{ display: "flex", width: "100%" }}>
            <Box
              display="flex"
              alignItems="center"
              w="100%"
              cursor="pointer"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }} // Hover effect
            >
              <IconButton
                aria-label="Home"
                icon={<FaHome />}
                variant="ghost"
                size="lg" // Adjust the icon size to ensure it's not too large
                width="60px"
                height="60px"
                fontSize="lg" // Adjust font size to be responsive
                {...isActive("/home")}
              />
            </Box>
          </Link>
        </Tooltip>

        {/* Inbox Button with Unscheduled Appointment Indicator */}
        <Tooltip label="Inbox" placement="right" hasArrow>
          <Link to="/inbox" style={{ display: "flex", width: "100%" }}>
            <Box
              position="relative"
              display="flex"
              alignItems="center"
              w="100%"
              cursor="pointer"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <IconButton
                aria-label="Inbox"
                icon={<FaInbox />}
                variant="ghost"
                size="lg"
                width="60px"
                height="60px"
                fontSize="lg"
                {...isActive("/inbox")}
              />
              {/* Conditionally render the red circle indicator */}
              {unscheduledCount > 0 && (
                <Badge
                  colorScheme="red"
                  position="absolute"
                  top="-5px"
                  right="-5px"
                  borderRadius="full"
                  padding="2px 5px"
                  fontSize="md"
                >
                  {unscheduledCount}
                </Badge>
              )}
            </Box>
          </Link>
        </Tooltip>

        {/* News Column Button */}
        <Tooltip label="News Column" placement="right" hasArrow>
          <Link to="/columns" style={{ display: "flex", width: "100%" }}>
            <Box
              display="flex"
              alignItems="center"
              w="100%"
              cursor="pointer"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <IconButton
                aria-label="News Column"
                icon={<FaNewspaper />}
                variant="ghost"
                size="lg"
                width="60px"
                height="60px"
                fontSize="lg"
                {...isActive("/columns")}
              />
            </Box>
          </Link>
        </Tooltip>

        {/* File Button */}
        <Tooltip label="File" placement="right" hasArrow>
          <Link to="/files" style={{ display: "flex", width: "100%" }}>
            <Box
              display="flex"
              alignItems="center"
              w="100%"
              cursor="pointer"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <IconButton
                aria-label="File"
                icon={<FaFileAlt />}
                variant="ghost"
                size="lg"
                width="60px"
                height="60px"
                fontSize="lg"
                {...isActive("/files")}
              />
            </Box>
          </Link>
        </Tooltip>

        {/* Settings Button */}
        <Tooltip label="Settings" placement="right" hasArrow>
          <Link to="/settings" style={{ display: "flex", width: "100%" }}>
            <Box
              display="flex"
              alignItems="center"
              w="100%"
              cursor="pointer"
              p={2}
              borderRadius="md"
              _hover={{ bg: "gray.100" }}
            >
              <IconButton
                aria-label="Settings"
                icon={<FaCog />}
                variant="ghost"
                size="lg"
                width="60px"
                height="60px"
                fontSize="lg"
                {...isActive("/settings")}
              />
            </Box>
          </Link>
        </Tooltip>
      </VStack>
    </Box>
  );
}

export default AdminSideNavbar;
