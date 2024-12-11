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
  Grid,
  GridItem,
  useToast,
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
    department: "",
    course: "",
    idNum: "",
    sex: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "gbox",
      "address",
      "department",
      "course",
      "idNum",
      "sex",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/patients", formData);
      toast({
        title: "Patient Added Successfully",
        description: response.data.message || "",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refreshPatients();
      onClose();
    } catch (error) {
      toast({
        title: "Error Adding Patient",
        description:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
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
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {Object.entries(formData).map(([key, value]) => (
              <GridItem key={key} colSpan={key === "address" ? 2 : 1}>
                <FormControl
                  isRequired={!["middleName", "suffix"].includes(key)}
                >
                  <FormLabel textTransform="capitalize">{key}</FormLabel>
                  <Input
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={`Enter ${key}`}
                  />
                </FormControl>
              </GridItem>
            ))}
          </Grid>
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
