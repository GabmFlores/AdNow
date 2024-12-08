import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Import useEffect
import { useUsers } from "../store/User"; // Zustand store

const HomePage = () => {
  const navigate = useNavigate();
  const { authenticatedUser } = useUsers(); // Get authenticated user state

  // Redirect authenticated users to admin homepage
  useEffect(() => {
    if (authenticatedUser) {
      navigate("/home"); // Redirect to admin home if authenticated
    }
  }, [authenticatedUser, navigate]);

  return (
    <Box
      minH="100vh"
      position="relative"
      bgSize="cover" // Ensures the background image covers the entire viewport
      bgPosition="center"
      bgRepeat="no-repeat"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgImage:
          "url('https://plus.unsplash.com/premium_photo-1675686363399-91ad6111f82d?q=80&w=3514&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Background image
        bgSize: "cover", // Ensure the background covers the entire viewport
        bgPosition: "center",
        bgRepeat: "no-repeat",
        filter: "blur(6px)", // Apply blur only to the background image
        zIndex: -1, // Ensures the background stays at the back
      }}
    >
      {/* Dark Overlay - Only applies to the background image area */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)" // Dark overlay effect for text readability
        zIndex={1}
      />

      {/* Main Content Section */}
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
        zIndex={2} // Ensures the content is above the overlay and background
        paddingTop={{ base: "60px", md: "80px" }} // Adjust padding to avoid Navbar overlap
      >
        <VStack spacing={6}>
          <Text
            fontSize="5xl"
            fontWeight="bold"
            letterSpacing="wide"
            color="white"
          >
            Ateneo Infirmary
          </Text>
          <Text fontSize="3xl" mt={4} color="white">
            Book now!
          </Text>
          <Button
            colorScheme="orange"
            mt={6}
            size="lg"
            onClick={() => navigate("/appointments")}
          >
            Book an Appointment
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;
