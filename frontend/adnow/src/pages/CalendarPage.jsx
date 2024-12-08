import React, { useState, useEffect } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAppointment } from "../store/Appointment";
import InboxSide from "../components/InboxSide";

const CalendarPage = () => {
  const { appointments, fetchAppointments } = useAppointment(); // Ensure fetchAppointments is exposed in your store
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      await fetchAppointments(); // Fetch data from the backend
      setLoading(false);
    };

    loadAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    const calendarEvents = appointments.map((appt) => ({
      title: `${appt.firstName} ${appt.lastName} - ${appt.concern}`,
      start: new Date(
        appt.status === "Scheduled" ? appt.scheduledDate : appt.desiredDate
      ),
      allDay: false,
      color: appt.status === "Scheduled" ? "#4CAF50" : "#FF9800", // Green for Scheduled, Orange for Unscheduled
    }));
    setEvents(calendarEvents);
  }, [appointments]);

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
        {/* Sidebar */}
        <Box width="300px" position="relative">
          <InboxSide />
        </Box>

        {/* Calendar */}
        <Box mt={20} ml={6} flex="1" p={4} overflowY="auto">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth" // Set default view to "Month"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            slotLabelInterval="4:00"
            height="calc(100vh - 120px)"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default CalendarPage;
