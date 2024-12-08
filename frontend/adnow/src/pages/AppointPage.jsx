import {
  Box,
  Input,
  Button,
  Select,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  HStack,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useAppointment } from "../store/Appointment";

const AppointPage = () => {
  const [newAppointment, setNewAppointment] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    gboxAcc: "",
    idNum: "",
    sex: "",
    department: "",
    course: "",
    desiredDate: "", // Changed from 'date' to 'desiredDate'
    concern: "",
  });

  const [isOtherCourse, setIsOtherCourse] = useState(false); // Track if user selects "Other" for course
  const [isOtherDepartment, setIsOtherDepartment] = useState(false); // Track if user selects "Other" for department
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const toast = useToast();
  const { createAppointment } = useAppointment();

  const handleAddAppointment = async () => {
    const { success, message } = await createAppointment(newAppointment);

    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
      return; // Don't reset the form
    }

    toast({
      title: "Success",
      description: message,
      status: "success",
      isClosable: true,
    });

    // Reset the form only if the submission is successful
    setNewAppointment({
      lastName: "",
      firstName: "",
      middleName: "",
      gboxAcc: "",
      idNum: "",
      sex: "",
      department: "",
      course: "",
      desiredDate: "", // Reset 'desiredDate'
      concern: "",
    });
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setNewAppointment({ ...newAppointment, course: value });

    // Show input field if "Other" is selected
    if (value === "Other") {
      setIsOtherCourse(true);
    } else {
      setIsOtherCourse(false);
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsOtherDepartment(true);
    } else {
      setIsOtherDepartment(false);
      setNewAppointment({ ...newAppointment, department: value });
    }
  };

  // Open the confirmation modal
  const openConfirmationModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeConfirmationModal = () => {
    setIsModalOpen(false);
  };

  // Confirm the appointment submission
  const confirmAppointment = () => {
    handleAddAppointment();
    closeConfirmationModal(); // Close the modal after confirmation
  };

  return (
    <Box
      bg="blue.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgImage="" // Add your background image here
      bgSize="cover"
      bgPosition="center"
    >
      <Box
        w={{ base: "90%", md: "60%" }}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        {/* AdNow Logo and Title centered */}
        <HStack justify="center" spacing={2} mb={3}>
          <Box
            as="img"
            src="https://paascu.org.ph/wp-content/uploads/elementor/thumbs/school-18-p3rc1n0wwxg1fnm1iu2x786az999uvjyw6y3imbo8g.png" // Replace with your logo
            alt="AdNow Logo"
            w="40px"
            h="40px"
          />
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            Ad<span style={{ color: "orange" }}>Now</span>
          </Text>
        </HStack>

        <Heading as="h2" fontSize="lg" mb={6} textAlign="center">
          Book Appointment
        </Heading>

        {/* Form Fields */}
        <VStack spacing={6} align="stretch">
          <HStack spacing={4} align="flex-start">
            <FormControl flex={1}>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder="Enter last name"
                value={newAppointment.lastName}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    lastName: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder="Enter first name"
                value={newAppointment.firstName}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    firstName: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel>
                Middle Name{" "}
                <Text as="span" fontSize="sm" color="gray.500">
                  (Optional)
                </Text>
              </FormLabel>
              <Input
                placeholder="Enter middle name (Optional)"
                value={newAppointment.middleName}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    middleName: e.target.value,
                  })
                }
                borderColor="gray.300" // Lighter border to make it less prominent
                _hover={{ borderColor: "gray.500" }} // Hover effect to match the theme
              />
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start">
            <FormControl flex={1}>
              <FormLabel>Gbox Account</FormLabel>
              <Input
                placeholder="Enter Gbox account"
                value={newAppointment.gboxAcc}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    gboxAcc: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl flex={1}>
              <FormLabel>ID Number</FormLabel>
              <Input
                placeholder="Enter ID number"
                value={newAppointment.idNum}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    idNum: e.target.value,
                  })
                }
              />
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start">
            <FormControl flex={1}>
              <FormLabel>Sex</FormLabel>
              <Select
                placeholder="Please Select"
                value={newAppointment.sex}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, sex: e.target.value })
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start">
            <FormControl flex={1}>
              <FormLabel>
                Department{" "}
                <Text as="span" fontSize="sm" color="gray.500">
                  (Optional)
                </Text>
              </FormLabel>
              <Select
                placeholder="Please Select"
                value={newAppointment.department}
                onChange={handleDepartmentChange}
              >
                <option value="Science">Computer Studies</option>
                <option value="Arts">Humanities</option>
                <option value="Engineering">Engineering</option>
                <option value="Other">Other</option>
              </Select>
              {/* Display input if "Other" is selected */}
              {isOtherDepartment && (
                <Input
                  placeholder="Enter your department"
                  value={newAppointment.department}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      department: e.target.value,
                    })
                  }
                />
              )}
            </FormControl>
            <FormControl flex={1}>
              <FormLabel>
                Program or Course{" "}
                <Text as="span" fontSize="sm" color="gray.500">
                  (Optional)
                </Text>
              </FormLabel>
              <Select
                placeholder="Please Select"
                value={newAppointment.course}
                onChange={handleCourseChange}
              >
                <option value="Course 1">Course 1</option>
                <option value="Course 2">Course 2</option>
                <option value="Other">Other</option>
              </Select>
              {/* Display input if "Other" is selected */}
              {isOtherCourse && (
                <Input
                  placeholder="Enter your course/program"
                  value={newAppointment.course}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      course: e.target.value,
                    })
                  }
                />
              )}
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel>Date and Time</FormLabel>
            <DatePicker
              selected={
                newAppointment.desiredDate
                  ? new Date(newAppointment.desiredDate)
                  : null // Changed to 'desiredDate'
              }
              onChange={(date) =>
                setNewAppointment({
                  ...newAppointment,
                  desiredDate: date.toISOString(), // Store in 'desiredDate'
                })
              }
              showTimeSelect
              dateFormat="yy/MM/dd HH:mm"
              placeholderText="yy/mm/dd hh:mm"
              className="react-datepicker-custom-input"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Concern/s</FormLabel>
            <Input
              placeholder="Specify your concern"
              value={newAppointment.concern}
              onChange={(e) =>
                setNewAppointment({
                  ...newAppointment,
                  concern: e.target.value,
                })
              }
            />
          </FormControl>

          <Button colorScheme="blue" w="full" onClick={openConfirmationModal}>
            Book Now
          </Button>
        </VStack>
      </Box>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeConfirmationModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to submit the appointment request?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={closeConfirmationModal}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={confirmAppointment}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AppointPage;
