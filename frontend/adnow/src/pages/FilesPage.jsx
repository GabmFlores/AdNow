import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Avatar,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaSearch, FaEllipsisV, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

function PatientFilesPage() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patients");
        setPatients(response.data.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

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
          colorScheme="teal"
        />
      </Flex>

      <Box bg="white" boxShadow="md" borderRadius="md" p={4}>
        <Flex fontWeight="bold" mb={2}>
          <Box flex="1">Image</Box>
          <Box flex="2">Name</Box>
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
          .map((patient) => (
            <Flex key={patient.id} alignItems="center" mb={4}>
              <Box flex="1">
                <Avatar
                  size="md"
                  src={patient.image}
                  name={`${patient.firstName} ${patient.lastName}`}
                />
              </Box>
              <Box flex="2">{`${patient.firstName} ${patient.lastName}`}</Box>
              <Box flex="1">{patient.course}</Box>
              <Box flex="1">{patient.idNum}</Box>
              <Box flex="1">{patient.sex}</Box>
              <Box flex="1">--</Box>
              <Box flex="0.5">
                <IconButton
                  icon={<FaEllipsisV />}
                  aria-label="Actions"
                  variant="ghost"
                />
              </Box>
            </Flex>
          ))}
      </Box>

      <Button
        colorScheme="teal"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        leftIcon={<FaPlus />}
      >
        Add Patient
      </Button>
    </Flex>
  );
}

export default PatientFilesPage;
