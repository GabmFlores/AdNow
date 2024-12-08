import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Input,
  Button,
  Select,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { useAppointment } from "../store/Appointment";
import { DateTime } from "luxon";

function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  updateAppointmentStatus,
}) {
  const { updateAppointment } = useAppointment();
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return DateTime.fromISO(dateStr, { zone: "Asia/Manila" }).toFormat(
      "yyyy-MM-dd'T'HH:mm"
    );
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    return DateTime.fromISO(dateStr, { zone: "Asia/Manila" }).toLocaleString(
      DateTime.DATETIME_MED
    );
  };

  useEffect(() => {
    if (appointment) {
      setFormData({
        firstName: appointment.firstName,
        middleName: appointment.middleName || "",
        lastName: appointment.lastName,
        idNum: appointment.idNum,
        gboxAcc: appointment.gboxAcc,
        course: appointment.course || "",
        concern: appointment.concern,
        sex: appointment.sex || "",
        department: appointment.department || "",
        scheduledDate:
          appointment.scheduledDate || appointment.desiredDate
            ? formatDateForInput(appointment.scheduledDate)
            : formatDateForInput(appointment.desiredDate),
        desiredDate: appointment.desiredDate,
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      JSON.stringify(formData) === JSON.stringify(appointment) // Check if data has changed
    ) {
      toast({
        title: "No Changes Made",
        description: "You have not made any changes to the appointment.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Update the appointment details first
    const response = await updateAppointment(appointment._id, formData);

    if (response.success) {
      // Now update the status to "Scheduled"
      const statusResponse = await updateAppointmentStatus(
        appointment._id,
        "Scheduled",
        formData.scheduledDate
      );

      if (statusResponse.success) {
        toast({
          title: "Appointment Updated",
          description:
            "The appointment details were updated and status set to Scheduled.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Failed to Update Status",
          description: "There was an error updating the appointment status.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Update Failed",
        description:
          response.message || "There was an error updating the appointment.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Appointment Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {/* Personal Information Fields */}
            <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
              <GridItem>
                <Text fontWeight="bold">Full Name:</Text>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  mb={2}
                />
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Middle Name:</Text>
                <Input
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle Name (Optional)"
                  mb={2}
                />
              </GridItem>
              <GridItem colSpan={2}>
                <Text fontWeight="bold">Last Name:</Text>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  mb={2}
                />
              </GridItem>
            </Grid>

            {/* Other Details */}
            <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
              <GridItem>
                <Text fontWeight="bold">ID Number:</Text>
                <Input
                  name="idNum"
                  value={formData.idNum}
                  onChange={handleChange}
                  placeholder="ID Number"
                  mb={2}
                />
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">GBox Account:</Text>
                <Input
                  name="gboxAcc"
                  value={formData.gboxAcc}
                  onChange={handleChange}
                  placeholder="GBox Account"
                  mb={2}
                />
              </GridItem>
            </Grid>

            {/* Sex and Concern */}
            <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
              <GridItem>
                <Text fontWeight="bold">Sex:</Text>
                <Select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  mb={2}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Concern:</Text>
                <Input
                  name="concern"
                  value={formData.concern}
                  onChange={handleChange}
                  placeholder="Concern"
                  mb={2}
                />
              </GridItem>
            </Grid>

            {/* Dates */}
            <Box mb={4}>
              <Text fontWeight="bold">Appointment Date:</Text>
              <Text>{formatDateForDisplay(formData.desiredDate)}</Text>
            </Box>

            <Box mb={4}>
              <Text fontWeight="bold">Scheduled Appointment Date:</Text>
              <Input
                type="datetime-local"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                mb={2}
              />
            </Box>

            {/* Submit Button */}
            <Button colorScheme="blue" type="submit">
              Update Appointment
            </Button>
          </form>
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
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    idNum: PropTypes.string.isRequired,
    gboxAcc: PropTypes.string.isRequired,
    course: PropTypes.string,
    concern: PropTypes.string.isRequired,
    sex: PropTypes.string.isRequired,
    department: PropTypes.string,
    desiredDate: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isOptional,
    createdAt: PropTypes.string.isRequired,
    updateAppointmentStatus: PropTypes.func.isRequired,
  }).isRequired,
};

export default AppointmentModal;
