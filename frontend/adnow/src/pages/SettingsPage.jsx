import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
  Image,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useUsers } from "../store/User";
import SettingsSide from "../components/SettingsSide";

const SettingsPage = () => {
  const { authenticatedUser, updateUser } = useUsers();
  const toast = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const profileBgColor = useColorModeValue("blue.50", "blue.900");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    username: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    if (authenticatedUser) {
      setFormData({
        firstName: authenticatedUser.firstName || "",
        lastName: authenticatedUser.lastName || "",
        middleName: authenticatedUser.middleName || "",
        suffix: authenticatedUser.suffix || "",
        username: authenticatedUser.username || "",
        email: authenticatedUser.email || "",
        image: authenticatedUser.image || "",
      });
      setImagePreview(authenticatedUser.image || "");
    }
  }, [authenticatedUser]);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async () => {
    try {
      const isUnchanged = Object.keys(formData).every(
        (key) => formData[key] === (authenticatedUser[key] || "")
      );

      if (isUnchanged) {
        toast({
          title: "No Changes Made",
          description: "Your profile is already up-to-date.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const result = await updateUser(authenticatedUser._id, formData);
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <HStack spacing={0} align="start" mt={16} ml={60} p={6}>
      <SettingsSide></SettingsSide>

      <Box flex={1} p={6} bg="white" borderRadius="md">
        <VStack spacing={6} align="stretch">
          <Box bg={profileBgColor} p={4} borderRadius="md">
            <Text fontSize="xl" fontWeight="semibold">
              Profile
            </Text>
          </Box>

          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Photo URL</FormLabel>
              <HStack align="start" spacing={4}>
                <Input
                  type="url"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  placeholder="Enter image URL"
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    w="24"
                    h="24"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                )}
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleProfileChange}
                placeholder="Enter Username"
              />
            </FormControl>

            <HStack spacing={4} w="full">
              <FormControl flex="1">
                <FormLabel>First Name</FormLabel>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleProfileChange}
                  placeholder="Enter First Name"
                />
              </FormControl>

              <FormControl flex="1">
                <FormLabel>Middle Name (optional)</FormLabel>
                <Input
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleProfileChange}
                  placeholder="Enter Middle Name"
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} w="full">
              <FormControl flex="1">
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleProfileChange}
                  placeholder="Enter Last Name"
                />
              </FormControl>

              <FormControl flex="1">
                <FormLabel>Postnominal/Suffix (optional)</FormLabel>
                <Input
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleProfileChange}
                  placeholder="Enter Postnominal/Suffix"
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                placeholder="Enter Email"
              />
            </FormControl>

            <Button w="full" colorScheme="blue" onClick={handleProfileSubmit}>
              Save Changes
            </Button>
          </VStack>
        </VStack>
      </Box>
    </HStack>
  );
};

export default SettingsPage;
