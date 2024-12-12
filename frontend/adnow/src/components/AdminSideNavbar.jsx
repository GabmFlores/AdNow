import { Box, VStack, IconButton, Tooltip, Badge } from "@chakra-ui/react";
import { FaHome, FaInbox, FaNewspaper, FaFileAlt, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for routing
import { useState, useEffect } from "react"; // Add useState and useEffect
import { useAppointment } from "../store/Appointment"; // Assuming useAppointment is where appointments are fetched

function AdminSideNavbar() {
  const { appointments, fetchAppointments } = useAppointment(); // Assuming fetchAppointments triggers fetching
  const [unscheduledCount, setUnscheduledCount] = useState(0);

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

  return (
    <Box
      bg="white"
      w="80px"
      position="fixed"
      top="20%"
      height="60%"
      left="0"
      boxShadow="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      border="2px solid #e2e8f0"
      zIndex="9"
      borderRadius="0px 50px 50px 0px" // Rounded left corners
    >
      <VStack spacing={6}>
        {/* Home Button */}
        <Tooltip label="Home" placement="right" hasArrow>
          <Link to="/">
            <IconButton
              aria-label="Home"
              icon={<FaHome />}
              variant="ghost"
              size="2xl"
              width="60px"
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* Inbox Button with Unscheduled Appointment Indicator */}
        <Tooltip label="Inbox" placement="right" hasArrow>
          <Link to="/inbox">
            <Box position="relative">
              <IconButton
                aria-label="Inbox"
                icon={<FaInbox />}
                variant="ghost"
                size="2xl"
                width="60px"
                height="60px"
                fontSize="25px"
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
          <Link to="/columns">
            <IconButton
              aria-label="News Column"
              icon={<FaNewspaper />}
              variant="ghost"
              size="2xl"
              width="60px"
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* File Button */}
        <Tooltip label="File" placement="right" hasArrow>
          <Link to="/files">
            <IconButton
              aria-label="File"
              icon={<FaFileAlt />}
              variant="ghost"
              size="2xl"
              width="60px"
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* Settings Button */}
        <Tooltip label="Settings" placement="right" hasArrow>
          <Link to="/settings">
            <IconButton
              aria-label="Settings"
              icon={<FaCog />}
              variant="ghost"
              size="2xl"
              width="60px"
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>
      </VStack>
    </Box>
  );
}

export default AdminSideNavbar;
