// src/components/AppointSide.js
import { Box, Button, Stack } from "@chakra-ui/react";
import { FaInbox, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function InboxSide() {
  return (
    <Box
      ml="100"
      position="sticky" // Stick the sidebar to the top when scrolling
      top="250px" // Offset from the top of the viewport
      width="250" // Sidebar width
      maxHeight="calc(100vh - 100px)" // Sidebar will not extend beyond the screen height minus the top offset
      bg="teal.800" // Background color
      color="white" // Text color
      boxShadow="lg" // Shadow for 3D effect
      p={4} // Adjusted padding for compact look
      borderRadius="lg" // Rounded corners
      display="flex" // Flexbox layout
      flexDirection="column" // Arrange items vertically
      justifyContent="flex-start" // Start aligning items from the top
      alignItems="center" // Horizontally center items
    >
      <Stack spacing={6} width="100%" align="center">
        <Link to="/inbox">
          <Button
            variant="ghost"
            width="100%"
            leftIcon={<FaInbox />}
            fontSize="20px"
            color="white"
            _hover={{ backgroundColor: "teal.700" }}
          >
            Inbox
          </Button>
        </Link>
        <Link to="/calendar">
          <Button
            variant="ghost"
            width="100%"
            leftIcon={<FaCalendarAlt />}
            fontSize="20px"
            color="white"
            _hover={{ backgroundColor: "teal.700" }}
          >
            Calendar
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}

export default InboxSide;
