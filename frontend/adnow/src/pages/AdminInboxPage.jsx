import {
  Box,
  Flex,
  Text,
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
  Select,
  HStack,
} from "@chakra-ui/react";
import { FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";
import { useAppointment } from "../store/Appointment";
import InboxSide from "../components/InboxSide";
import AppointmentModal from "../components/AppointmentModal";
import { useEffect, useState } from "react";

function AdminInboxPage() {
  const {
    appointments,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
  } = useAppointment();
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const {
    isOpen: isAppointmentModalOpen,
    onOpen: onAppointmentModalOpen,
    onClose: onAppointmentModalClose,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionType, setActionType] = useState("");
  const [newAppointmentDate, setNewAppointmentDate] = useState("");
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [filter, setFilter] = useState("All");
  const toast = useToast();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handler to open appointment details modal
  const openAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    onAppointmentModalOpen();
  };

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

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (filter === "All") return true;
      if (filter === "Unscheduled" && !appointment.scheduledDate) return true;
      if (filter === "Scheduled" && appointment.scheduledDate) return true;
      return false;
    })
    .sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);

      if (a.scheduledDate && b.scheduledDate) {
        return new Date(b.scheduledDate) - new Date(a.scheduledDate);
      }

      if (a.scheduledDate && !b.scheduledDate) return 1;
      if (!a.scheduledDate && b.scheduledDate) return -1;

      return bDate - aDate;
    });

  const handleApprove = (appointmentId) => {
    setActionType("Approve");
    const appointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
    setSelectedAppointment(appointment);

    // Convert the desired date to local time
    const localDate = new Date(appointment.desiredDate);

    // Extract components of the local time
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    // Create a formatted string for the datetime-local input (YYYY-MM-DDTHH:MM)
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    setNewAppointmentDate(formattedDate); // Update the state with the local date and time
    onOpen();
  };

  const handleDecline = (appointmentId) => {
    setActionType("Decline");
    const appointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
    setSelectedAppointment(appointment);
    onOpen();
  };

  const handleApproveConfirm = () => {
    updateAppointmentStatus(
      selectedAppointment._id,
      "Scheduled",
      newAppointmentDate
    );
    toast({
      title: "Appointment Approved.",
      description: "The appointment has been successfully approved.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose();
  };

  const handleDeclineConfirm = () => {
    deleteAppointment(selectedAppointment._id);
    toast({
      title: "Appointment Declined.",
      description: "The appointment has been successfully declined.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose();
  };

  const handleSelectAppointment = (appointmentId) => {
    setSelectedAppointments((prevSelectedAppointments) => {
      if (prevSelectedAppointments.includes(appointmentId)) {
        return prevSelectedAppointments.filter((id) => id !== appointmentId);
      } else {
        return [...prevSelectedAppointments, appointmentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(
        filteredAppointments.map((appointment) => appointment._id)
      );
    }
  };

  const handleDeleteConfirm = () => {
    selectedAppointments.forEach((appointmentId) => {
      deleteAppointment(appointmentId);
      toast({
        title: "Appointment Deleted.",
        description: "The selected appointments have been deleted.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    });
    setSelectedAppointments([]);
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteSelected = () => {
    if (selectedAppointments.length > 0) {
      setIsDeleteConfirmationOpen(true);
    }
  };

  return (
    <Box bg="gray.50" minHeight="100vh">
      <Flex p={4} direction="row" height="100vh">
        <Box width="300px" position="relative">
          <InboxSide />
        </Box>

        <Box mt={20} ml={6} flex="1" p={4} overflowY="auto">
          <HStack justify="space-between" mb={4}>
            <HStack>
              <Button
                colorScheme="red"
                onClick={handleDeleteSelected}
                isDisabled={selectedAppointments.length === 0}
              >
                Delete Selected
              </Button>
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
                      <Avatar
                        name={appointment.firstName}
                        size="sm"
                        mr={3}
                        onClick={() => openAppointmentDetails(appointment)}
                        style={{ cursor: "pointer" }}
                      />
                      <Box textAlign="left" width="45%">
                        <Text
                          fontWeight="bold"
                          onClick={() => openAppointmentDetails(appointment)}
                          style={{ cursor: "pointer", marginBottom: "8px" }}
                        >
                          {appointment.firstName} {appointment.lastName}
                        </Text>
                        <Text color="gray.500" mb={2}>
                          {appointment.course}
                        </Text>

                        {/* Make sure the concern text wraps correctly */}
                        <Text
                          color="gray.600"
                          noOfLines={2} // Set this to allow wrapping over multiple lines
                          maxW="400px"
                          whiteSpace="normal" // Allow wrapping for long text
                          wordBreak="break-word" // Prevent long words from breaking the layout
                          mb={2} // Add margin-bottom for spacing
                        >
                          {appointment.concern}
                        </Text>
                      </Box>
                    </Flex>

                    <Box textAlign="center" width="25%">
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">
                        Desired Appointment Date:
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {formatAppointmentDate(appointment.desiredDate)}
                      </Text>

                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color="gray.500"
                        mt={2}
                      >
                        Updated Appointment Date:
                      </Text>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="blue.500" // Added blue color for emphasis
                        mt={1}
                      >
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
                          href={`mailto:${
                            appointment.gboxAcc
                          }?subject=Appointment Confirmation&body=${
                            !appointment.scheduledDate
                              ? "We are sorry to inform you that your appointment cannot be scheduled at this time. Please contact us for alternative options."
                              : appointment.scheduledDate ===
                                appointment.desiredDate
                              ? `Dear ${
                                  appointment.firstName
                                },\n\nYour appointment has been scheduled at: ${formatAppointmentDate(
                                  appointment.scheduledDate
                                )}.\nKindly confirm if you're available.`
                              : `Dear ${
                                  appointment.firstName
                                },\n\nUnfortunately, the requested appointment date of ${formatAppointmentDate(
                                  appointment.desiredDate
                                )} is not available. However, we have scheduled your appointment for ${formatAppointmentDate(
                                  appointment.scheduledDate
                                )}. Please confirm if you're available.`
                          }`}
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
                {/* Ensure that the input is correctly initialized with the time */}
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

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={onAppointmentModalClose}
          appointment={selectedAppointment}
        />
      )}
    </Box>
  );
}

export default AdminInboxPage;
