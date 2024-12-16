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
  FormHelperText,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useAppointment } from "../store/Appointment";

const departmentCourseMap = {
  "COLLEGE OF BUSINESS AND ACCOUNTANCY": [
    "BS Accountancy",
    "BS BA Financial Accounting",
    "BS BA major in Accounting Information Management",
    "BS BA major in Banking and Finance",
    "BS BA major in Business Economics",
    "BS BA major in Business Engineering",
    "BS BA major in Business Management Honors Program",
    "BS BA major in Financial Management and Accounting",
    "BS BA major in Hospital and Health Care Management",
    "BS BA major in Legal Management",
    "BS BA major in Management",
    "BS BA major in Marketing Management",
  ],
  "COLLEGE OF COMPUTER STUDIES": [
    "BS Computer Engineering",
    "BS Computer Science",
    "BS Digital Illustration and Animation",
    "BS Information Systems",
    "BS Information Technology",
  ],
  "COLLEGE OF EDUCATION": [
    "Bachelor of Early Childhood Education (BECEd)",
    "Bachelor of Elementary Education (BEED)",
    "Bachelor of Library Information Science (BLIS)",
    "Bachelor of Secondary Education major in English",
    "Bachelor of Secondary Education major in Filipino",
    "Bachelor of Secondary Education major in Mathematics",
    "Bachelor of Secondary Education major in Science",
    "Bachelor of Secondary Education major in Social Studies",
    "Bachelor of Special Needs Education major in Early Childhood Education",
    "Bachelor of Special Needs Education major in Elementary School Teaching",
    "Bachelor of Special Needs Education major in Generalist",
    "Bachelor of Special Needs Education major in Teaching Deaf and Hard-of-Hearing Learners",
    "Bachelor of Special Needs Education major in Teaching Learners with Visual Impairment",
  ],
  "COLLEGE OF HUMANITIES AND SOCIAL SCIENCES": [
    "AB Broadcasting",
    "AB Communication",
    "AB Economics",
    "AB English Language Studies",
    "AB Journalism",
    "AB Literature",
    "AB Philosophy - Foreign Service and International Relations",
    "AB Philosophy - Pre-Law",
    "AB Philosophy - Teaching",
    "AB Political Science major in Government and Politics",
    "AB Political Science major in Public Administration",
    "AB Religious and Values Education",
    "BS Development Communication",
  ],
  "COLLEGE OF NURSING": ["BS Nursing"],
  "COLLEGE OF SCIENCE, ENGINEERING AND ARCHITECTURE": [
    "BS Architecture",
    "BS Biology",
    "BS Civil Engineering",
    "BS Electronics Engineering",
    "BS Environmental Management",
    "BS Mathematics",
    "BS Computer Engineering",
  ],
};

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
    desiredDate: "",
    concern: "",
  });

  const [isOtherCourse, setIsOtherCourse] = useState(false);
  const [isOtherDepartment, setIsOtherDepartment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    gboxAcc: "",
    idNum: "",
    sex: "",
    department: "",
    course: "",
    desiredDate: "",
    concern: "",
  });
  const toast = useToast();
  const { createAppointment } = useAppointment();

  const handleAddAppointment = async () => {
    // Reset errors before validation
    setErrors({
      lastName: "",
      firstName: "",
      middleName: "",
      gboxAcc: "",
      idNum: "",
      sex: "",
      department: "",
      course: "",
      desiredDate: "",
      concern: "",
    });

    let formIsValid = true;
    const newErrors = {};

    // Validate required fields and format
    if (!newAppointment.lastName) {
      formIsValid = false;
      newErrors.lastName = "Last Name is required.";
    }
    if (!newAppointment.firstName) {
      formIsValid = false;
      newErrors.firstName = "First Name is required.";
    }
    if (
      !newAppointment.gboxAcc ||
      !newAppointment.gboxAcc.includes("@gbox.adnu.edu.ph")
    ) {
      formIsValid = false;
      newErrors.gboxAcc =
        "Gbox account should be in the format: @gbox.adnu.edu.ph";
    }
    if (!newAppointment.idNum || isNaN(newAppointment.idNum)) {
      formIsValid = false;
      newErrors.idNum = "ID number should be a number.";
    }
    if (!newAppointment.sex) {
      formIsValid = false;
      newErrors.sex = "Sex is required.";
    }
    if (!newAppointment.desiredDate) {
      formIsValid = false;
      newErrors.desiredDate = "Date and time are required.";
    }
    if (!newAppointment.concern) {
      formIsValid = false;
      newErrors.concern = "Concern is required.";
    }

    // If any validation fails, show an error toast and highlight errors
    if (!formIsValid) {
      setErrors(newErrors);
      toast({
        title: "Input Error",
        description: "Please correct the highlighted fields.",
        status: "error",
        isClosable: true,
      });
      return; // Stop the form submission if there are errors
    }

    // If validation passes, proceed with the appointment creation
    const { success, message } = await createAppointment(newAppointment);

    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Success",
      description: message,
      status: "success",
      isClosable: true,
    });

    // Reset the form
    setNewAppointment({
      lastName: "",
      firstName: "",
      middleName: "",
      gboxAcc: "",
      idNum: "",
      sex: "",
      department: "",
      course: "",
      desiredDate: "",
      concern: "",
    });
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setNewAppointment({ ...newAppointment, course: value });

    if (value === "Other") {
      setIsOtherCourse(true);
    } else {
      setIsOtherCourse(false);
    }
  };

  const handleDepartmentChange = (e) => {
    const value = e.target.value;

    // Reset `course` and related state when department changes
    setNewAppointment({
      ...newAppointment,
      department: value,
      course: value === "Other" ? "" : "",
    });

    if (value === "Other") {
      setIsOtherDepartment(true);
      setIsOtherCourse(false); // Ensure no "Other" course persists
    } else {
      setIsOtherDepartment(false);
      setIsOtherCourse(false); // Reset "Other" course input if applicable
    }
  };

  const openConfirmationModal = () => {
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
  };

  const confirmAppointment = () => {
    handleAddAppointment();
    closeConfirmationModal();
  };

  return (
    <Box
      bg="blue.50"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w={{ base: "90%", md: "60%", lg: "50%" }}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <HStack justify="center" spacing={2} mb={3}>
          <Box
            as="img"
            src="https://paascu.org.ph/wp-content/uploads/elementor/thumbs/school-18-p3rc1n0wwxg1fnm1iu2x786az999uvjyw6y3imbo8g.png"
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

        <VStack spacing={6} align="stretch">
          <HStack spacing={4} align="flex-start" wrap="wrap">
            <FormControl
              flex={{ base: "1 0 100%", md: "1" }}
              isInvalid={!!errors.lastName}
            >
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
              {errors.lastName && (
                <FormHelperText color="red.500">
                  {errors.lastName}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              flex={{ base: "1 0 100%", md: "1" }}
              isInvalid={!!errors.firstName}
            >
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
              {errors.firstName && (
                <FormHelperText color="red.500">
                  {errors.firstName}
                </FormHelperText>
              )}
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start" wrap="wrap">
            <FormControl
              flex={{ base: "1 0 100%", md: "1" }}
              isInvalid={!!errors.middleName}
            >
              <FormLabel>
                Middle Name{" "}
                <Text as="span" fontSize="sm" color="gray.500">
                  (Optional)
                </Text>
              </FormLabel>
              <Input
                placeholder="Enter middle name"
                value={newAppointment.middleName}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    middleName: e.target.value,
                  })
                }
              />
              {errors.middleName && (
                <FormHelperText color="red.500">
                  {errors.middleName}
                </FormHelperText>
              )}
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start">
            <FormControl flex={1} isInvalid={!!errors.gboxAcc}>
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
              {errors.gboxAcc && (
                <FormHelperText color="red.500">
                  {errors.gboxAcc}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl flex={1} isInvalid={!!errors.idNum}>
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
              {errors.idNum && (
                <FormHelperText color="red.500">{errors.idNum}</FormHelperText>
              )}
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start">
            <FormControl flex={1} isInvalid={!!errors.sex}>
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
              {errors.sex && (
                <FormHelperText color="red.500">{errors.sex}</FormHelperText>
              )}
            </FormControl>
          </HStack>

          <HStack spacing={4} align="flex-start">
            <FormControl flex={1} isInvalid={!!errors.department}>
              <FormLabel>Department (Optional)</FormLabel>
              <Select
                placeholder="Please Select"
                value={newAppointment.department}
                onChange={handleDepartmentChange}
              >
                {Object.keys(departmentCourseMap).map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
                <option value="Other">Other</option>
              </Select>
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
              {errors.department && (
                <FormHelperText color="red.500">
                  {errors.department}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl flex={1} isInvalid={!!errors.course}>
              <FormLabel>
                Course{" "}
                <Text as="span" fontSize="sm" color="gray.500">
                  (Optional)
                </Text>
              </FormLabel>
              <Select
                placeholder="Please Select"
                value={newAppointment.course}
                onChange={handleCourseChange}
                isDisabled={!newAppointment.department}
              >
                {departmentCourseMap[newAppointment.department]?.map(
                  (course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  )
                )}
                <option value="Other">Other</option>
              </Select>
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
              {errors.course && (
                <FormHelperText color="red.500">{errors.course}</FormHelperText>
              )}
            </FormControl>
          </HStack>

          <FormControl isInvalid={!!errors.desiredDate}>
            <FormLabel>Date and Time</FormLabel>
            <Box
              w="full" // Make sure it takes up full width on all screen sizes
              position="relative" // Ensures that the datepicker stays in place
            >
              <DatePicker
                selected={
                  newAppointment.desiredDate
                    ? new Date(newAppointment.desiredDate)
                    : null
                }
                onChange={(date) =>
                  setNewAppointment({
                    ...newAppointment,
                    desiredDate: date.toISOString(),
                  })
                }
                showTimeSelect
                dateFormat="yy/MM/dd HH:mm"
                placeholderText="yy/mm/dd hh:mm"
                className="react-datepicker-custom-input"
                wrapperClassName="custom-datepicker-wrapper"
              />
            </Box>
            {errors.desiredDate && (
              <FormHelperText color="red.500">
                {errors.desiredDate}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.concern}>
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
            {errors.concern && (
              <FormHelperText color="red.500">{errors.concern}</FormHelperText>
            )}
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
