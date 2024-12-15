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
  Select,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useAppointment } from "../store/Appointment";
import PropTypes from "prop-types";
import { useState } from "react";

function CreateModalApp({ isOpen, onClose }) {
  const { createAppointment } = useAppointment();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gboxAcc: "",
    sex: "",
    date: "",
    concern: "",
    idNum: "",
  });

  // Error handling state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    gboxAcc: "",
    sex: "",
    date: "",
    concern: "",
    idNum: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset error when the field is updated
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Check if required fields are filled out
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }
    if (!formData.gboxAcc) {
      newErrors.gboxAcc = "Email / Gbox Account is required";
      isValid = false;
    }
    if (!formData.idNum) {
      newErrors.idNum = "ID Number is required";
      isValid = false;
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }
    if (!formData.concern) {
      newErrors.concern = "Concern is required";
      isValid = false;
    }

    // Add validation for sex field (ensure it's not empty)
    if (!formData.sex) {
      newErrors.sex = "Sex is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validate the form
    if (!validateForm()) {
      return;
    }

    const appointmentData = {
      ...formData,
      desiredDate: formData.date,
      scheduledDate: formData.date,
      status: "Scheduled",
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
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        gboxAcc: "",
        sex: "",
        date: "",
        concern: "",
        idNum: "",
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
          <FormControl mb={4} isInvalid={!!errors.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.gboxAcc}>
            <FormLabel>Email / Gbox Account</FormLabel>
            <Input
              name="gboxAcc"
              value={formData.gboxAcc}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{errors.gboxAcc}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.idNum}>
            <FormLabel>ID Number</FormLabel>
            <Input
              name="idNum"
              value={formData.idNum}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{errors.idNum}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.sex}>
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
            <FormErrorMessage>{errors.sex}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.date}>
            <FormLabel>Date</FormLabel>
            <Input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{errors.date}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.concern}>
            <FormLabel>Concern</FormLabel>
            <Textarea
              name="concern"
              value={formData.concern}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{errors.concern}</FormErrorMessage>
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

// PropTypes validation
CreateModalApp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateModalApp;
