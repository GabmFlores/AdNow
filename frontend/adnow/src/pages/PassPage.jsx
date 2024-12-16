// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import SettingsSide from "../components/SettingsSide";

const PasswordPage = () => {
  const toast = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all the fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Simulate API call
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formBgColor = useColorModeValue("blue.50", "blue.900");

  return (
    <HStack spacing={0} align="start" mt={16} ml={60} p={6}>
      <SettingsSide />

      <Box flex={1} p={6} bg="white" borderRadius="md">
        <VStack spacing={6} align="stretch">
          <Box bg={formBgColor} p={4} borderRadius="md">
            <Text fontSize="xl" fontWeight="semibold">
              Change Password
            </Text>
          </Box>

          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <HStack>
                <Input
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter Current Password"
                />
                <IconButton
                  icon={showPassword.current ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => toggleShowPassword("current")}
                  aria-label="Toggle Current Password Visibility"
                />
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>New Password</FormLabel>
              <HStack>
                <Input
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter New Password"
                />
                <IconButton
                  icon={showPassword.new ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => toggleShowPassword("new")}
                  aria-label="Toggle New Password Visibility"
                />
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <HStack>
                <Input
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm New Password"
                />
                <IconButton
                  icon={showPassword.confirm ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => toggleShowPassword("confirm")}
                  aria-label="Toggle Confirm Password Visibility"
                />
              </HStack>
            </FormControl>

            <Button w="full" colorScheme="blue" onClick={handlePasswordSubmit}>
              Save Changes
            </Button>
          </VStack>
        </VStack>
      </Box>
    </HStack>
  );
};

export default PasswordPage;
