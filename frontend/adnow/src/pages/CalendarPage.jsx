// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Box, Flex, Spinner, Text, Select } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAppointment } from "../store/Appointment";
import InboxSide from "../components/InboxSide";
import AppointmentModal from "../components/AppointmentModal"; // Import the Appointment Modal

const CalendarPage = () => {
  const { appointments, fetchAppointments } = useAppointment();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State to store the clicked appointment
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      await fetchAppointments();
      setLoading(false);
    };

    loadAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    const filteredAppointments = appointments.filter((appt) => {
      if (filter === "all") return true;
      return appt.status.toLowerCase() === filter.toLowerCase();
    });

    const calendarEvents = filteredAppointments.map((appt) => ({
      title: `${appt.firstName} ${appt.lastName} - ${appt.concern}`,
      start: new Date(
        appt.status === "Scheduled" ? appt.scheduledDate : appt.desiredDate
      ),
      allDay: false,
      color: appt.status === "Scheduled" ? "#4CAF50" : "#FF9800",
      id: appt._id, // Adding the appointment ID to the event data
    }));

    setEvents(calendarEvents);
  }, [appointments, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleEventClick = (info) => {
    const clickedAppointment = appointments.find(
      (appt) => appt._id === info.event.id
    );
    setSelectedAppointment(clickedAppointment); // Set the selected appointment
    setIsModalOpen(true); // Open the modal
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg="gray.50">
        <Spinner size="xl" />
        <Text ml={4} fontSize="lg">
          Loading appointments...
        </Text>
      </Flex>
    );
  }

  return (
    <Box bg="gray.50" minHeight="100vh">
      <Flex p={4} direction="row" height="100vh">
        <Box width="300px" position="relative">
          <InboxSide />
        </Box>

        <Box mt={20} ml={6} flex="1" p={4} overflowY="auto">
          <Flex mb={4}>
            <Select onChange={handleFilterChange} value={filter} width="200px">
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="unscheduled">Unscheduled</option>
            </Select>
          </Flex>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            slotLabelInterval="4:00"
            height="calc(100vh - 120px)"
            eventClick={handleEventClick} // Add eventClick handler
          />
        </Box>
      </Flex>

      {/* Appointment Modal */}
      {selectedAppointment && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={selectedAppointment}
        />
      )}
    </Box>
  );
};

export default CalendarPage;
