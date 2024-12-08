// src/components/AppointmentModal.js
import PropTypes from "prop-types"; // Import PropTypes
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
} from "@chakra-ui/react";

function AppointmentModal({ isOpen, onClose, appointment }) {
  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Appointment Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="bold">Full Name:</Text>
            <Text>
              {appointment.firstName} {appointment.middleName}{" "}
              {appointment.lastName}
            </Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">ID Number:</Text>
            <Text>{appointment.idNum}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">GBox Account:</Text>
            <Text>{appointment.gboxAcc}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Course:</Text>
            <Text>{appointment.course}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Concern:</Text>
            <Text>{appointment.concern}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Appointment Date:</Text>
            <Text>{new Date(appointment.date).toLocaleString()}</Text>
          </Box>
          <Box mb={4}>
            <Text fontWeight="bold">Created On:</Text>
            <Text>{new Date(appointment.createdAt).toLocaleString()}</Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// PropTypes validation
AppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    idNum: PropTypes.string.isRequired,
    gboxAcc: PropTypes.string.isRequired,
    course: PropTypes.string,
    concern: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired, // Assuming it's a string, else use PropTypes.instanceOf(Date) if it's a Date object
    createdAt: PropTypes.string.isRequired, // Same for createdAt, if it's a date string
  }).isRequired,
};

export default AppointmentModal;
