import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const SettingsPage = () => {
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModified, setIsModified] = useState(false);

  // Fetch current authenticated user on page load
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error on new load
      try {
        const response = await fetch("/api/users/authenticated", {
          method: "GET",
          credentials: "include", // Include session cookies
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        const userData = data.user || {}; // Ensure data.user exists

        setUser({
          firstName: userData.firstName || "",
          middleName: userData.middleName || "",
          lastName: userData.lastName || "",
          suffix: userData.suffix || "",
          email: userData.email || "",
        });
      } catch (err) {
        setError(err.message || "Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Ensure required fields are not empty
    if (!user.firstName || !user.lastName || !user.email) {
      setError("First Name, Last Name, and Email are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      const updatedUser = { ...prev, [name]: value };
      setIsModified(JSON.stringify(updatedUser) !== JSON.stringify(user));
      return updatedUser;
    });
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt={10}
      p={5}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading size="lg" mb={5}>
        Settings
      </Heading>
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {success && (
          <Alert status="success">
            <AlertIcon />
            {success}
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            placeholder="Enter First Name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Middle Name (optional)</FormLabel>
          <Input
            type="text"
            name="middleName"
            value={user.middleName}
            onChange={handleChange}
            placeholder="Enter Middle Name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            placeholder="Enter Last Name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Suffix (optional)</FormLabel>
          <Input
            type="text"
            name="suffix"
            value={user.suffix}
            onChange={handleChange}
            placeholder="Enter Suffix"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          type="submit"
          isLoading={loading}
          loadingText="Saving"
          width="full"
          isDisabled={!isModified} // Disable button if no changes were made
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
