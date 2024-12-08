import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Avatar,
  Tooltip,
  Checkbox,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  useToast,
  Select, // Import Select for dropdown
  HStack, // Import HStack for horizontal stacking
} from "@chakra-ui/react";
import { FaSearch, FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";
import { useAppointment } from "../store/Appointment"; // Import the Zustand store
import InboxSide from "../components/InboxSide"; // Import the new InboxSide component
import AppointmentModal from "../components/AppointmentModal"; // Import the AppointmentModal

function AdminInboxPage() {
  const {
    appointments,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
  } = useAppointment();
  const [selectedAppointments, setSelectedAppointments] = useState([]); // Track selected appointments
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State for selected appointment
  const [isModalOpen, setIsModalOpen] = useState(false); // Custom state to control modal visibility
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control for confirmation dialogs
  const [actionType, setActionType] = useState(""); // Track action type (approve/decline)
  const [newAppointmentDate, setNewAppointmentDate] = useState(""); // For changing the appointment date
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false); // Track delete confirmation modal

  const [filter, setFilter] = useState("All"); // New filter state
  const toast = useToast(); // Initialize the toast hook

  // Fetch appointments when component is mounted
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Function to format the date
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleString("en-US", { weekday: "long" });
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const time = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} ${day} ${time}`;
  };

  // Filter and sort appointments based on the selected filter
  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filter === "All") return true; // Show all appointments
      if (filter === "Unscheduled" && !appointment.scheduledDate) return true; // Only unscheduled appointments
      if (filter === "Scheduled" && appointment.scheduledDate) return true; // Only scheduled appointments
      return false;
    })
    .sort((a, b) => {
      // Sorting: Latest appointment at the top, but scheduled ones go to the bottom
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);

      // If both appointments are scheduled, sort by scheduled date
      if (a.scheduledDate && b.scheduledDate) {
        return new Date(b.scheduledDate) - new Date(a.scheduledDate);
      }

      // If one appointment is unscheduled and the other is scheduled, place unscheduled first
      if (a.scheduledDate && !b.scheduledDate) return 1;
      if (!a.scheduledDate && b.scheduledDate) return -1;

      // Otherwise, sort by createdAt date
      return bDate - aDate;
    });

  // Handle the approval of an appointment
  const handleApprove = (appointmentId) => {
    setActionType("Approve");
    const appointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
    setSelectedAppointment(appointment);
    setNewAppointmentDate(appointment.desiredDate); // Set initial date in the input
    onOpen(); // Open confirmation modal for approval
  };

  // Handle the decline of an appointment
  const handleDecline = (appointmentId) => {
    setActionType("Decline");
    const appointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
    setSelectedAppointment(appointment);
    onOpen(); // Open confirmation modal for decline
  };

  // Handle the confirmation of approve action
  const handleApproveConfirm = () => {
    updateAppointmentStatus(
      selectedAppointment._id,
      "Scheduled",
      newAppointmentDate
    ); // Update the date and status
    toast({
      title: "Appointment Approved.",
      description: "The appointment has been successfully approved.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose(); // Close modal after action
  };

  // Handle the confirmation of decline action
  const handleDeclineConfirm = () => {
    deleteAppointment(selectedAppointment._id); // Delete the appointment
    toast({
      title: "Appointment Declined.",
      description: "The appointment has been successfully declined.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose(); // Close modal after action
  };

  // Handle selecting or deselecting an appointment
  const handleSelectAppointment = (appointmentId) => {
    setSelectedAppointments((prevSelectedAppointments) => {
      if (prevSelectedAppointments.includes(appointmentId)) {
        // Deselect the appointment
        return prevSelectedAppointments.filter((id) => id !== appointmentId);
      } else {
        // Select the appointment
        return [...prevSelectedAppointments, appointmentId];
      }
    });
  };

  // Handle selecting or deselecting all appointments based on the filter
  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      // Deselect all appointments
      setSelectedAppointments([]);
    } else {
      // Select all appointments based on the current filter
      setSelectedAppointments(
        filteredAppointments.map((appointment) => appointment._id)
      );
    }
  };

  // Handle confirming the deletion of selected appointments
  const handleDeleteConfirm = () => {
    selectedAppointments.forEach((appointmentId) => {
      deleteAppointment(appointmentId); // Call deleteAppointment for each selected appointment
      toast({
        title: "Appointment Deleted.",
        description: "The selected appointments have been deleted.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });
    setSelectedAppointments([]); // Clear the selection after deletion
    setIsDeleteConfirmationOpen(false); // Close the confirmation modal
  };

  // Handle canceling the deletion of selected appointments
  const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false); // Close the confirmation modal
  };

  // Open the confirmation modal when the delete button is clicked
  const handleDeleteSelected = () => {
    if (selectedAppointments.length > 0) {
      setIsDeleteConfirmationOpen(true); // Open the confirmation modal
    }
  };

  return (
    <Box bg="gray.50" minHeight="100vh">
      {/* Main Flex Layout */}
      <Flex p={4} direction="row" height="100vh">
        {/* Sidebar Component */}
        <Box width="300px" position="relative">
          <InboxSide />
        </Box>

        {/* Main Content Area */}
        <Box mt={20} ml={6} flex="1" p={4} overflowY="auto">
          {/* Header: Delete Selected, Select All, and Filter in same line using HStack */}
          <HStack justify="space-between" mb={4}>
            {/* Delete Selected Button */}
            <HStack>
              <Button
                colorScheme="red"
                onClick={handleDeleteSelected}
                isDisabled={selectedAppointments.length === 0}
              >
                Delete Selected
              </Button>
              {/* Select All Checkbox */}
              <HStack spacing={2}>
                <Checkbox
                  ml="8"
                  isChecked={
                    selectedAppointments.length === filteredAppointments.length
                  }
                  onChange={handleSelectAll}
                >
                  Select All
                </Checkbox>
              </HStack>
            </HStack>

            {/* Filter Dropdown */}
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              width="200px"
              variant="outline"
            >
              <option value="All">All</option>
              <option value="Unscheduled">Unscheduled</option>
              <option value="Scheduled">Scheduled</option>
            </Select>
          </HStack>

          {/* Appointment List */}
          <Box>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Box
                  key={appointment._id}
                  p={4}
                  borderBottom="1px solid #e2e8f0"
                  boxShadow="sm"
                  borderRadius="lg"
                  mb={4}
                  bg="white"
                >
                  <Flex align="center" justify="space-between">
                    <div>
                      <Checkbox
                        isChecked={selectedAppointments.includes(
                          appointment._id
                        )}
                        onChange={() =>
                          handleSelectAppointment(appointment._id)
                        }
                      />
                    </div>

                    <Flex align="center" width="45%">
                      <Avatar name={appointment.firstName} size="sm" mr={3} />
                      <Box>
                        <Text
                          fontWeight="bold"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setIsModalOpen(true); // Open appointment modal when name is clicked
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {appointment.firstName} {appointment.lastName}
                        </Text>
                        <Text color="gray.500">{appointment.course}</Text>
                        <Text color="gray.600" noOfLines={1} maxW="400px">
                          {appointment.concern}
                        </Text>
                      </Box>
                    </Flex>

                    <Box textAlign="center" width="25%">
                      {/* Desired Appointment Date */}
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">
                        Desired Appointment Date:
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {formatAppointmentDate(appointment.desiredDate)}
                      </Text>

                      {/* Updated Appointment Date */}
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.500"
                        mt={2}
                      >
                        Updated Appointment Date:
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {appointment.scheduledDate
                          ? formatAppointmentDate(appointment.scheduledDate)
                          : "Not updated yet"}
                      </Text>
                    </Box>

                    <Box textAlign="right" width="25%">
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">
                        Booked On:
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {formatAppointmentDate(appointment.createdAt)}
                      </Text>
                      <Text
                        color={
                          appointment.status === "Scheduled"
                            ? "green.500"
                            : "yellow.500"
                        }
                      >
                        {appointment.status}
                      </Text>

                      <Flex justify="space-between" mt={4}>
                        <Button
                          as="a"
                          href={`mailto:${appointment.email}`}
                          leftIcon={<FaEnvelope />}
                          colorScheme="teal"
                          variant="solid"
                          size="sm"
                          w="full"
                        >
                          Email Patient
                        </Button>

                        <Flex ml={2}>
                          <Tooltip label="Approve Appointment">
                            <IconButton
                              aria-label="Approve"
                              icon={<FaCheck />}
                              colorScheme="green"
                              size="sm"
                              mr={2}
                              onClick={() => handleApprove(appointment._id)}
                            />
                          </Tooltip>
                          <Tooltip label="Decline Appointment">
                            <IconButton
                              aria-label="Decline"
                              icon={<FaTimes />}
                              colorScheme="red"
                              size="sm"
                              onClick={() => handleDecline(appointment._id)}
                            />
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text>No appointments available</Text>
            )}
          </Box>
        </Box>
      </Flex>

      {/* Appointment Approval Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {actionType === "Approve"
              ? "Approve Appointment"
              : "Decline Appointment"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {actionType === "Approve" ? (
              <FormControl>
                <FormLabel>Desired Appointment Date</FormLabel>
                <ChakraInput
                  type="datetime-local"
                  value={newAppointmentDate}
                  onChange={(e) => setNewAppointmentDate(e.target.value)}
                />
              </FormControl>
            ) : (
              <Text color="red.500">
                Are you sure you want to delete this appointment? This action
                cannot be undone.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={actionType === "Approve" ? "green" : "red"}
              onClick={
                actionType === "Approve"
                  ? handleApproveConfirm
                  : handleDeclineConfirm
              }
            >
              {actionType === "Approve" ? "Confirm" : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteConfirmationOpen} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="red.500">
              Are you sure you want to delete the selected appointments? This
              action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminInboxPage;
