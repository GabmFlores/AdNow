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
  useToast,
  SimpleGrid,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function NewPatientModal({ isOpen, onClose, refreshPatients }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    gbox: "",
    address: "",
    department: "", // Optional
    course: "", // Optional
    idNum: "",
    sex: "", // Required select field (Male or Female)
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear the error when user types
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "gbox",
      "address",
      "idNum",
      "sex", // Sex is required
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Additional validation for gbox (email format)
    if (formData.gbox && !formData.gbox.includes("@gbox.adnu.edu.ph")) {
      newErrors.gbox = "Gbox email must be in the format @gbox.adnu.edu.ph";
    }

    // Validate that idNum is a number
    if (formData.idNum && isNaN(formData.idNum)) {
      newErrors.idNum = "ID Number must be numeric.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/patients", formData);
      toast({
        title: "Patient Added Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refreshPatients();
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        gbox: "",
        address: "",
        department: "", // Optional
        course: "", // Optional
        idNum: "",
        sex: "", // Reset sex field
      });
    } catch (error) {
      toast({
        title: "Error Adding Patient",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Patient</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {Object.entries(formData).map(([key, value]) => {
              if (key === "sex") {
                return (
                  <FormControl
                    key={key}
                    mb={4}
                    isRequired={true} // Sex is required
                    isInvalid={!!errors[key]} // Show error if sex is not selected
                  >
                    <FormLabel textTransform="capitalize">Sex</FormLabel>
                    <Select
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder="Select Sex"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                    <FormErrorMessage>{errors[key]}</FormErrorMessage>
                  </FormControl>
                );
              }

              // Skip optional fields (department and course) in required validation
              if (key === "department" || key === "course") {
                return (
                  <FormControl
                    key={key}
                    mb={4}
                    isInvalid={!!errors[key]} // Apply error styling if error exists
                  >
                    <FormLabel textTransform="capitalize">{key}</FormLabel>
                    <Input
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder={`Enter ${key}`}
                    />
                    <FormErrorMessage>{errors[key]}</FormErrorMessage>
                  </FormControl>
                );
              }

              return (
                <FormControl
                  key={key}
                  mb={4}
                  isRequired={key !== "middleName" && key !== "suffix"}
                  isInvalid={!!errors[key]} // Apply error styling if error exists
                >
                  <FormLabel textTransform="capitalize">{key}</FormLabel>
                  <Input
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                    isInvalid={!!errors[key]} // Show error state for invalid fields
                    inputMode={key === "idNum" ? "numeric" : "text"} // Use numeric mode for idNum
                    pattern={key === "idNum" ? "[0-9]*" : undefined} // Restrict non-numeric characters for idNum
                  />
                  <FormErrorMessage>{errors[key]}</FormErrorMessage>
                </FormControl>
              );
            })}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

NewPatientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshPatients: PropTypes.func.isRequired,
};

export default NewPatientModal;
