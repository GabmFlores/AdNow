import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Avatar,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaSearch, FaEllipsisV, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import FilesModal from "../components/FilesModal";
import NewPatientModal from "../components/NewPatientModal"; // import NewPatientModal

function FilesPage() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPatient, setSelectedPatient] = useState(null);

  // useDisclosure hook for NewPatientModal
  const {
    isOpen: isNewPatientModalOpen,
    onOpen: onOpenNewPatientModal,
    onClose: onCloseNewPatientModal,
  } = useDisclosure();

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/api/patients");
      setPatients(response.data.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    onOpen();
  };

  return (
    <Flex
      height="100vh"
      ml="80px"
      mt="60px"
      p={6}
      flexDirection="column"
      bg="gray.50"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Patient Files
      </Text>

      <Flex mb={6} alignItems="center">
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="white"
          boxShadow="md"
          borderRadius="md"
        />
        <IconButton
          icon={<FaSearch />}
          aria-label="Search"
          ml={2}
          colorScheme="blue"
        />
      </Flex>

      <Box bg="white" boxShadow="md" borderRadius="md" p={4}>
        <Flex fontWeight="bold" mb={2}>
          <Box flex="3">Name</Box>
          <Box flex="1">Course</Box>
          <Box flex="1">ID Number</Box>
          <Box flex="1">Sex</Box>
          <Box flex="1">Next Appointment</Box>
          <Box flex="0.5">Actions</Box>
        </Flex>

        {patients
          .filter(
            (patient) =>
              patient.firstName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((patient, index) => (
            <Flex key={patient._id || index} alignItems="center" mb={4}>
              {/* Name & Logo Section */}
              <Box
                flex="3"
                display="flex"
                alignItems="center"
                cursor="pointer" // Only cursor pointer here
                onClick={() => handlePatientClick(patient)} // Open patient details when clicked
              >
                <Avatar
                  size="md"
                  src={patient.image}
                  name={`${patient.firstName} ${patient.lastName}`}
                  mr={4}
                />
                <Text>{`${patient.firstName} ${patient.lastName}`}</Text>
              </Box>

              {/* Other fields */}
              <Box flex="1">{patient.course}</Box>
              <Box flex="1">{patient.idNum}</Box>
              <Box flex="1">{patient.sex}</Box>
              <Box flex="1">--</Box>

              {/* Edit (3 dots) Button */}
              <Box flex="0.5" cursor="pointer">
                {" "}
                {/* Added cursor pointer here */}
                <IconButton
                  icon={<FaEllipsisV />}
                  aria-label="Actions"
                  variant="ghost"
                  onClick={() => handlePatientClick(patient)} // Trigger the same function to show patient details
                />
              </Box>
            </Flex>
          ))}
      </Box>

      {/* The Button to Open NewPatientModal */}
      <Button
        colorScheme="blue"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        leftIcon={<FaPlus />}
        onClick={onOpenNewPatientModal} // Trigger the modal open
      >
        Add Patient
      </Button>

      {/* Render NewPatientModal here */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={onCloseNewPatientModal}
        refreshPatients={fetchPatients}
      />

      {selectedPatient && (
        <FilesModal
          title="Patient Details"
          isOpen={isOpen}
          onClose={onClose}
          patientData={selectedPatient}
          refreshFiles={fetchPatients}
        />
      )}
    </Flex>
  );
}

export default FilesPage;
