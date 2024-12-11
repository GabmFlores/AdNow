// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Select,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useAppointment } from "../store/Appointment";

const AppointmentModal = ({ isOpen, onClose, appointment }) => {
  const { updateAppointment, updateAppointmentStatus, deleteAppointment } =
    useAppointment();
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    sex: "",
    concern: "",
    desiredDate: "",
    scheduledDate: "",
  });

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Track original data to check for changes
  const [originalData, setOriginalData] = useState({});

  // Populate form data when appointment prop changes
  useEffect(() => {
    if (appointment) {
      const formattedData = {
        firstName: appointment.firstName || "",
        middleName: appointment.middleName || "",
        lastName: appointment.lastName || "",
        idNumber: appointment.idNumber || "",
        sex: appointment.sex || "",
        concern: appointment.concern || "",
        desiredDate: formatDateForInput(appointment.desiredDate) || "",
        scheduledDate: formatDateForInput(
          appointment.scheduledDate || appointment.desiredDate
        ),
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
    }
  }, [appointment]);

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Check if any field has changed
  const hasChanges = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Check if there are any changes
    if (!hasChanges()) {
      toast({
        title: "No Changes",
        description: "No modifications were made.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      return;
    }

    try {
      // Prepare updated appointment data
      const updatedAppointment = {
        ...appointment,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        sex: formData.sex,
        concern: formData.concern,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };

      // Update appointment details
      await updateAppointment(appointment._id, updatedAppointment);

      // Update appointment status if scheduled date changed
      if (formData.scheduledDate !== originalData.scheduledDate) {
        await updateAppointmentStatus(
          appointment._id,
          "Scheduled",
          new Date(formData.scheduledDate).toISOString()
        );
      }

      // Success toast
      toast({
        title: "Appointment Updated",
        description: "Appointment details have been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      // Error toast
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = async () => {
    try {
      // Delete the appointment
      await deleteAppointment(appointment._id);

      // Success toast
      toast({
        title: "Appointment Deleted",
        description: "The appointment has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close both modals
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      // Error toast
      toast({
        title: "Delete Error",
        description: error.message || "Failed to delete appointment.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Main Appointment Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Appointment Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {/* Name Fields in a Horizontal Stack */}
              <HStack width="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel>Middle Name</FormLabel>
                  <Input
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>

              {/* ID and Sex in a Horizontal Stack */}
              <HStack width="full" spacing={4}>
                <FormControl flex={2}>
                  <FormLabel>ID Number</FormLabel>
                  <Input
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel>Sex</FormLabel>
                  <Select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </FormControl>
              </HStack>

              {/* Concern Field */}
              <FormControl>
                <FormLabel>Concern</FormLabel>
                <Input
                  name="concern"
                  value={formData.concern}
                  onChange={handleChange}
                />
              </FormControl>

              {/* Date Fields in a Horizontal Stack */}
              <HStack width="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel>Desired Appointment Date</FormLabel>
                  <Input
                    type="datetime-local"
                    name="desiredDate"
                    value={formData.desiredDate}
                    isReadOnly
                    bg="gray.100"
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel>Scheduled Appointment Date</FormLabel>
                  <Input
                    type="datetime-local"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Appointment
            </Button>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirmation}>
              Confirm Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// PropTypes validation
AppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    idNumber: PropTypes.string,
    sex: PropTypes.string,
    concern: PropTypes.string,
    desiredDate: PropTypes.string,
    scheduledDate: PropTypes.string,
  }).isRequired,
};

export default AppointmentModal;
