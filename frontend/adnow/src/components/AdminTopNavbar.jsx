import {
  Box,
  Flex,
  Text,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaInbox,
  FaNewspaper,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { useUsers } from "../store/User"; // Update the import path for your zustand store

function AdminTopNavbar() {
  const [isOpen, setIsOpen] = useState(false); // State to control drawer visibility
  const { logoutUser, authenticatedUser } = useUsers(); // Get the store methods and the authenticated user
  const navigate = useNavigate(); // Initialize the navigate function
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleLogout = async () => {
    const data = await logoutUser();
    if (data.success) {
      // After successful logout, navigate to the homepage
      navigate("/"); // Redirect to the homepage
    }
  };

  return (
    <Box
      bg="white"
      position="fixed"
      top="0"
      left="0"
      right="0"
      h="60px"
      boxShadow="md"
      borderRadius="0 0 30px 30px" // Rounded bottom corners
      zIndex="10"
      px={10}
      py={10}
    >
      <Flex alignItems="center" justifyContent="space-between" h="100%" px={1}>
        {/* Hamburger Menu */}
        <IconButton
          aria-label="Menu"
          icon={<FaBars />}
          variant="ghost"
          size="lg"
          width="60px"
          height="60px"
          fontSize="25px"
          onClick={onOpen} // Opens the drawer when clicked
        />

        {/* User Info */}
        <Flex align="center" gap={4}>
          <Text fontWeight="bold">
            {authenticatedUser ? authenticatedUser.username : "Guest"}
          </Text>
          <Menu>
            <MenuButton>
              <Avatar
                name={authenticatedUser?.username || "Guest"}
                src="https://bit.ly/dan-abramov"
              />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Drawer for Side Navbar */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton fontSize="20px" p={4} m={2} />
          <DrawerBody>
            <VStack align="flex-start" spacing={6} mt="50%">
              {/* Home Navigation */}
              <Link to="/home" style={{ display: "flex", width: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  p={2}
                >
                  <IconButton
                    aria-label="Home"
                    icon={<FaHome />}
                    variant="ghost"
                    size="lg"
                    width="60px"
                    height="60px"
                    fontSize="25px"
                  />
                  <Text ml={3} fontSize="lg" fontWeight="bold">
                    Home
                  </Text>
                </Box>
              </Link>

              {/* Inbox Navigation */}
              <Link to="/inbox" style={{ display: "flex", width: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  p={2}
                >
                  <IconButton
                    aria-label="Inbox"
                    icon={<FaInbox />}
                    variant="ghost"
                    size="lg"
                    width="60px"
                    height="60px"
                    fontSize="25px"
                  />
                  <Text ml={3} fontSize="lg" fontWeight="bold">
                    Inbox
                  </Text>
                </Box>
              </Link>

              {/* News Column Navigation */}
              <Link to="/news" style={{ display: "flex", width: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  p={2}
                >
                  <IconButton
                    aria-label="News"
                    icon={<FaNewspaper />}
                    variant="ghost"
                    size="lg"
                    width="60px"
                    height="60px"
                    fontSize="25px"
                  />
                  <Text ml={3} fontSize="lg" fontWeight="bold">
                    News
                  </Text>
                </Box>
              </Link>

              {/* File Navigation */}
              <Link to="/files" style={{ display: "flex", width: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  p={2}
                >
                  <IconButton
                    aria-label="Files"
                    icon={<FaFileAlt />}
                    variant="ghost"
                    size="lg"
                    width="60px"
                    height="60px"
                    fontSize="25px"
                  />
                  <Text ml={3} fontSize="lg" fontWeight="bold">
                    Files
                  </Text>
                </Box>
              </Link>

              {/* Settings Navigation */}
              <Link to="/settings" style={{ display: "flex", width: "100%" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  w="100%"
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  p={2}
                >
                  <IconButton
                    aria-label="Settings"
                    icon={<FaCog />}
                    variant="ghost"
                    size="lg"
                    width="60px"
                    height="60px"
                    fontSize="25px"
                  />
                  <Text ml={3} fontSize="lg" fontWeight="bold">
                    Settings
                  </Text>
                </Box>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default AdminTopNavbar;
