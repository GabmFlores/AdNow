import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Spacer,
  Button,
  Link,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
  useDisclosure,
  InputGroup,
  InputRightElement,
  useToast,
  ModalFooter,
} from "@chakra-ui/react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useUsers } from "../store/User"; // Import useUsers hook from Zustand
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate for redirection
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const toast = useToast(); // Initialize useToast hook

  // Zustand store functions
  const { authenticatedUser, loginUser, createUser, logoutUser } = useUsers();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState(""); // For registration

  useEffect(() => {
    // If user is already logged in, we can fetch their details from the Zustand store
  }, [authenticatedUser]);

  const toggleModal = () => setIsRegistering(!isRegistering);
  const togglePassword = () => setShowPassword(!showPassword);

  // Function to handle pressing "Enter" key
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const handleLogin = async () => {
    const { success, message } = await loginUser(username, password);

    if (success) {
      toast({
        title: "Login Successful",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      navigate("/home"); // Redirect to the homepage after login
    } else {
      toast({
        title: "Login Failed",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRegister = async () => {
    // Show the confirmation modal before submitting the registration
    onConfirmOpen();
  };

  const handleConfirmRegistration = async () => {
    const newUser = { username, email, password, invitationCode }; // Pass invitationCode here
    const { success, message } = await createUser(newUser);

    if (success) {
      onConfirmClose(); // Close the confirmation modal
      onClose(); // Close the register modal
      toast({
        title: "Registration Successful",
        description: "Welcome aboard!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/"); // Redirect to the homepage after successful registration
    } else {
      toast({
        title: "Registration Failed",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancelRegistration = () => {
    onConfirmClose();
  };

  const handleLogout = async () => {
    const { success, message } = await logoutUser();

    if (success) {
      toast({
        title: "Logout Successful",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/"); // Redirect to the homepage after logout
    } else {
      toast({
        title: "Logout Failed",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Navbar Component */}
      <Box
        as="header"
        bg="white"
        px={8}
        py={4}
        boxShadow="sm"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Flex alignItems="center">
          {/* Logo Section */}
          <HStack spacing={2}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
              <Box
                as="img"
                src="https://upload.wikimedia.org/wikipedia/en/e/e2/Ateneo_de_Naga_University_logo.png"
                alt="AdNow Logo"
                w="40px"
                h="40px"
              />
            </Link>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
              <Text fontSize="xl" fontWeight="bold" color="blue.500">
                Ad<span style={{ color: "orange" }}>Now</span>
              </Text>
            </Link>
          </HStack>

          {/* Navbar Links */}
          <HStack
            as="nav"
            spacing={12}
            ml={700}
            fontWeight="medium"
            fontSize="lg"
            color="gray.600"
          >
            <Link
              as={RouterLink}
              to="/"
              _hover={{ textDecoration: "none", color: "blue.500" }}
              borderBottom={
                location.pathname === "/" ? "2px solid blue" : "none"
              }
            >
              Home
            </Link>
            <Link
              as={RouterLink}
              to="/appointments"
              _hover={{ textDecoration: "none", color: "blue.500" }}
              borderBottom={
                location.pathname === "/appointments"
                  ? "2px solid blue"
                  : "none"
              }
            >
              Appointment
            </Link>
            <Link
              as={RouterLink}
              to="/news"
              _hover={{ textDecoration: "none", color: "blue.500" }}
              borderBottom={
                location.pathname === "/news" ? "2px solid blue" : "none"
              }
            >
              News
            </Link>
            <Link
              as={RouterLink}
              to="/contact"
              _hover={{ textDecoration: "none", color: "blue.500" }}
              borderBottom={
                location.pathname === "/contact" ? "2px solid blue" : "none"
              }
            >
              Contact Us
            </Link>
          </HStack>

          <Spacer />

          {/* Log In Button or Logout if authenticated */}
          {authenticatedUser ? (
            <Button colorScheme="blue" variant="solid" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <Button colorScheme="blue" variant="solid" onClick={onOpen}>
              Log In
            </Button>
          )}
        </Flex>
      </Box>

      {/* Modal for Login/Signup */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {isRegistering ? "Register" : "Log In"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {!isRegistering ? (
                // Login Form
                <>
                  <Text fontSize="sm" color="gray.500">
                    Remember, your username is case-sensitive.
                  </Text>
                  <Input
                    placeholder="Enter username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleLogin)} // Handle Enter key
                  />
                  <InputGroup>
                    <Input
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, handleLogin)} // Handle Enter key
                    />
                    <InputRightElement>
                      <Button
                        variant="link"
                        colorScheme="blue"
                        onClick={togglePassword}
                        fontSize="sm"
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    width="full"
                    onClick={handleLogin}
                  >
                    Log In
                  </Button>
                  <Text fontSize="sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      color="blue.500"
                      cursor="pointer"
                      onClick={toggleModal} // Switch to Register modal
                    >
                      Register
                    </Link>
                  </Text>
                </>
              ) : (
                // Register Form
                <>
                  <Input
                    placeholder="Enter username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleRegister)} // Handle Enter key
                  />
                  <Input
                    placeholder="Enter email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleRegister)} // Handle Enter key
                  />
                  <InputGroup>
                    <Input
                      placeholder="Enter password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, handleRegister)} // Handle Enter key
                    />
                    <InputRightElement>
                      <Button
                        variant="link"
                        colorScheme="blue"
                        onClick={togglePassword}
                        fontSize="sm"
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Input
                    placeholder="Enter invitation code"
                    type="text"
                    value={invitationCode} // Use invitationCode instead of adminKey
                    onChange={(e) => setInvitationCode(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleRegister)} // Handle Enter key
                  />
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    width="full"
                    onClick={handleRegister}
                  >
                    Register
                  </Button>
                  <Text fontSize="sm">
                    Already have an account?{" "}
                    <Link
                      color="blue.500"
                      cursor="pointer"
                      onClick={toggleModal} // Switch to Log In modal
                    >
                      Log In
                    </Link>
                  </Text>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal for Registration */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            Confirm Your Registration
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to submit your registration with the
              provided information?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={handleCancelRegistration}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleConfirmRegistration}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Navbar;
