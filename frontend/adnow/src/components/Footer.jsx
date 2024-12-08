import { Box, Flex, Text, HStack, Link, IconButton } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Optional for social icons
import { Link as RouterLink, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation(); // Get the current URL location

  return (
    <Box as="footer" bg="gray.800" color="white" py={6}>
      <Flex direction="column" align="center">
        {/* Logo and Title */}
        <HStack spacing={2} mb={4}>
          <Box
            as="img"
            src="https://upload.wikimedia.org/wikipedia/en/e/e2/Ateneo_de_Naga_University_logo.png" // Replace with your logo
            alt="AdNow Logo"
            w="40px"
            h="40px"
          />
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            Ad<span style={{ color: "orange" }}>Now</span>
          </Text>
        </HStack>

        {/* Footer Links */}
        <HStack spacing={8} mb={4}>
          <Link
            as={RouterLink}
            to="/"
            color={location.pathname === "/" ? "blue.400" : "white"} // Highlight active link
            _hover={{ color: "blue.400", textDecoration: "underline" }}
          >
            Home
          </Link>
          <Link
            as={RouterLink}
            to="/appointments"
            color={location.pathname === "/appointments" ? "blue.400" : "white"} // Highlight active link
            _hover={{ color: "blue.400", textDecoration: "underline" }}
          >
            Appointment
          </Link>
          <Link
            as={RouterLink}
            to="/news"
            color={location.pathname === "/news" ? "blue.400" : "white"} // Highlight active link
            _hover={{ color: "blue.400", textDecoration: "underline" }}
          >
            News
          </Link>
          <Link
            as={RouterLink}
            to="/contact"
            color={location.pathname === "/contact" ? "blue.400" : "white"} // Highlight active link
            _hover={{ color: "blue.400", textDecoration: "underline" }}
          >
            Contact Us
          </Link>
        </HStack>

        {/* Social Media Links (Optional) */}
        <HStack spacing={4} mb={4}>
          <IconButton
            aria-label="Facebook"
            icon={<FaFacebook />}
            variant="link"
            color="white"
            fontSize="2xl"
            _hover={{ color: "blue.400", transform: "scale(1.2)" }}
          />
          <IconButton
            aria-label="Twitter"
            icon={<FaTwitter />}
            variant="link"
            color="white"
            fontSize="2xl"
            _hover={{ color: "blue.400", transform: "scale(1.2)" }}
          />
          <IconButton
            aria-label="Instagram"
            icon={<FaInstagram />}
            variant="link"
            color="white"
            fontSize="2xl"
            _hover={{ color: "blue.400", transform: "scale(1.2)" }}
          />
        </HStack>

        {/* Copyright */}
        <Text fontSize="sm" color="gray.400">
          &copy; {new Date().getFullYear()} AdNow. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
