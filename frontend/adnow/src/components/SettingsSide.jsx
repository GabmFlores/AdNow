// eslint-disable-next-line no-unused-vars
import React from "react";
import { VStack, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const SettingsSide = () => {
  return (
    <VStack
      align="start"
      spacing={6}
      w={"250px"}
      p={6}
      bg={"gray.100"}
      borderRadius="md"
      mt={6}
    >
      <Heading size="md" mb={4}>
        Settings
      </Heading>
      <Link
        as={RouterLink}
        to="/settings"
        color="blue.600"
        fontWeight="semibold"
        transition="all 0.3s ease-in-out"
        _hover={{
          textDecoration: "none",
          color: "white",
          bg: "blue.600",
          px: 4,
          py: 2,
          borderRadius: "md",
          transform: "scale(1.05)",
        }}
      >
        Profile
      </Link>

      <Link
        as={RouterLink}
        to="/settings/password"
        color="blue.600"
        fontWeight="semibold"
        transition="all 0.3s ease-in-out"
        _hover={{
          textDecoration: "none",
          color: "white",
          bg: "blue.600",
          px: 4,
          py: 2,
          borderRadius: "md",
          transform: "scale(1.05)",
        }}
      >
        Password
      </Link>
    </VStack>
  );
};

export default SettingsSide;
