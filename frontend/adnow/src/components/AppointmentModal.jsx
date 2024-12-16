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
    idNum: "",
    sex: "",
    concern: "",
    desiredDate: "",
    scheduledDate: "",
    department: "",
    course: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (appointment) {
      const formattedData = {
        firstName: appointment.firstName || "",
        middleName: appointment.middleName || "",
        lastName: appointment.lastName || "",
        idNum: appointment.idNum || "",
        sex: appointment.sex || "",
        concern: appointment.concern || "",
        desiredDate: formatDateForInput(appointment.desiredDate) || "",
        scheduledDate: formatDateForInput(
          appointment.scheduledDate || appointment.desiredDate
        ),
        department: appointment.department || "",
        course: appointment.course || "",
      };

      setFormData(formattedData);
      setOriginalData(formattedData);
    }
  }, [appointment]);

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

  const hasChanges = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
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
      const updatedAppointment = {
        ...appointment,
        ...formData,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
      };

      await updateAppointment(appointment._id, updatedAppointment);

      if (formData.scheduledDate !== originalData.scheduledDate) {
        await updateAppointmentStatus(
          appointment._id,
          "Scheduled",
          new Date(formData.scheduledDate).toISOString()
        );
      }

      toast({
        title: "Appointment Updated",
        description: "Appointment details have been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      await deleteAppointment(appointment._id);

      toast({
        title: "Appointment Deleted",
        description: "The appointment has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
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
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Appointment Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
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

              <HStack width="full" spacing={4}>
                <FormControl flex={2}>
                  <FormLabel>ID Number</FormLabel>
                  <Input
                    name="idNum"
                    value={formData.idNum}
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

              <FormControl>
                <FormLabel>Concern</FormLabel>
                <Input
                  name="concern"
                  value={formData.concern}
                  onChange={handleChange}
                />
              </FormControl>

              <HStack width="full" spacing={4}>
                <FormControl flex={1}>
                  <FormLabel>Department</FormLabel>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl flex={1}>
                  <FormLabel>Course</FormLabel>
                  <Input
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>

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
    idNum: PropTypes.string,
    sex: PropTypes.string,
    concern: PropTypes.string,
    desiredDate: PropTypes.string,
    scheduledDate: PropTypes.string,
    department: PropTypes.string,
    course: PropTypes.string,
  }).isRequired,
};

export default AppointmentModal;
