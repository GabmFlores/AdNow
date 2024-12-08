import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Input,
  Button,
  useToast, // Import useToast
} from "@chakra-ui/react";
import { useAppointment } from "../store/Appointment"; // Assuming Zustand store is in store/appointmentStore.js

function AppointmentModal({ isOpen, onClose, appointment }) {
  const { updateAppointment } = useAppointment();
  const [formData, setFormData] = useState({});
  const toast = useToast(); // Initialize useToast

  // Set initial form data when appointment is passed in
  useEffect(() => {
    if (appointment) {
      setFormData({
        firstName: appointment.firstName,
        middleName: appointment.middleName || "",
        lastName: appointment.lastName,
        idNum: appointment.idNum,
        gboxAcc: appointment.gboxAcc,
        course: appointment.course || "",
        concern: appointment.concern,
        desiredDate: appointment.desiredDate,
        createdAt: appointment.createdAt,
      });
    }
  }, [appointment]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check if data has changed
  const isDataChanged = () => {
    return (
      formData.firstName !== appointment.firstName ||
      formData.middleName !== appointment.middleName ||
      formData.lastName !== appointment.lastName ||
      formData.idNum !== appointment.idNum ||
      formData.gboxAcc !== appointment.gboxAcc ||
      formData.course !== appointment.course ||
      formData.concern !== appointment.concern ||
      formData.desiredDate !== appointment.desiredDate
    );
  };

  // Handle form submit for updating the appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any data has changed before updating
    if (!isDataChanged()) {
      toast({
        title: "No changes made.",
        description: "There were no changes to update.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const response = await updateAppointment(appointment._id, formData);
    if (response.success) {
      // Show success toast
      toast({
        title: "Appointment updated.",
        description: "The appointment has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose(); // Close modal on successful update
    } else {
      alert(response.message); // Show error message if update fails
    }
  };

  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Appointment Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Box mb={4}>
              <Text fontWeight="bold">Full Name:</Text>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                mb={2}
              />
              <Input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle Name (Optional)"
                mb={2}
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                mb={2}
              />
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">ID Number:</Text>
              <Input
                name="idNum"
                value={formData.idNum}
                onChange={handleChange}
                placeholder="ID Number"
                mb={2}
              />
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">GBox Account:</Text>
              <Input
                name="gboxAcc"
                value={formData.gboxAcc}
                onChange={handleChange}
                placeholder="GBox Account"
                mb={2}
              />
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Course:</Text>
              <Input
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Course"
                mb={2}
              />
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Concern:</Text>
              <Input
                name="concern"
                value={formData.concern}
                onChange={handleChange}
                placeholder="Concern"
                mb={2}
              />
            </Box>
            <Box mb={4}>
              <Text fontWeight="bold">Appointment Date:</Text>
              <Input
                type="datetime-local"
                name="desiredDate"
                value={formData.desiredDate}
                onChange={handleChange}
                mb={2}
              />
            </Box>
            <Button colorScheme="blue" type="submit">
              Update Appointment
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// PropTypes validation
AppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    idNum: PropTypes.string.isRequired,
    gboxAcc: PropTypes.string.isRequired,
    course: PropTypes.string,
    concern: PropTypes.string.isRequired,
    desiredDate: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default AppointmentModal;
