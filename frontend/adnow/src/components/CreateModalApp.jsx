import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select, // Import Select
  useToast,
} from "@chakra-ui/react";
import { useAppointment } from "../store/Appointment";
import PropTypes from "prop-types"; // Import PropTypes
import { useState } from "react";

function CreateModalApp({ isOpen, onClose }) {
  const { createAppointment } = useAppointment();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gboxAcc: "",
    sex: "", // Default value is empty
    date: "",
    concern: "",
    idNum: "", // New idNum field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Use the date for both desiredDate and scheduledDate and set status to "Scheduled"
    const appointmentData = {
      ...formData,
      desiredDate: formData.date, // Use date for desiredDate
      scheduledDate: formData.date, // Use date for scheduledDate
      status: "Scheduled", // Set status to "Scheduled"
    };

    const response = await createAppointment(appointmentData);
    if (response.success) {
      toast({
        title: "Success",
        description: response.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose(); // Close the modal
      setFormData({
        firstName: "",
        lastName: "",
        gboxAcc: "",
        sex: "", // Reset sex field
        date: "",
        concern: "",
        idNum: "", // Reset idNum field
      });
    } else {
      toast({
        title: "Error",
        description: response.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="gboxAcc"
              value={formData.gboxAcc}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Id Number</FormLabel>
            <Input
              name="idNum" // New input for idNum
              value={formData.idNum}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Sex</FormLabel>
            <Select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Date</FormLabel>
            <Input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Concern</FormLabel>
            <Textarea
              name="concern"
              value={formData.concern}
              onChange={handleInputChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Add PropTypes validation
CreateModalApp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateModalApp;
