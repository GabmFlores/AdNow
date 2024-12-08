import { Box, VStack, IconButton, Tooltip } from "@chakra-ui/react";
import { FaHome, FaInbox, FaNewspaper, FaFileAlt, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for routing

function AdminSideNavbar() {
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
            {" "}
            {/* Wrap with Link to navigate to /home */}
            <IconButton
              aria-label="Home"
              icon={<FaHome />}
              variant="ghost"
              size="2xl" // Larger buttons
              width="60px" // Adjust width for a bigger button
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* Inbox Button */}
        <Tooltip label="Inbox" placement="right" hasArrow>
          <Link to="/inbox">
            {" "}
            {/* Wrap with Link to navigate to /inbox */}
            <IconButton
              aria-label="Inbox"
              icon={<FaInbox />}
              variant="ghost"
              size="2xl" // Larger buttons
              width="60px" // Adjust width for a bigger button
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* News Column Button */}
        <Tooltip label="News Column" placement="right" hasArrow>
          <Link to="/news">
            {" "}
            {/* Wrap with Link to navigate to /news */}
            <IconButton
              aria-label="News Column"
              icon={<FaNewspaper />}
              variant="ghost"
              size="2xl" // Larger buttons
              width="60px" // Adjust width for a bigger button
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* File Button */}
        <Tooltip label="File" placement="right" hasArrow>
          <Link to="/files">
            {" "}
            {/* Wrap with Link to navigate to /files */}
            <IconButton
              aria-label="File"
              icon={<FaFileAlt />}
              variant="ghost"
              size="2xl" // Larger buttons
              width="60px" // Adjust width for a bigger button
              height="60px"
              fontSize="25px"
            />
          </Link>
        </Tooltip>

        {/* Settings Button */}
        <Tooltip label="Settings" placement="right" hasArrow>
          <Link to="/settings">
            {" "}
            {/* Wrap with Link to navigate to /settings */}
            <IconButton
              aria-label="Settings"
              icon={<FaCog />}
              variant="ghost"
              size="2xl" // Larger buttons
              width="60px" // Adjust width for a bigger button
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
