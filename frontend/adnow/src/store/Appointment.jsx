import { create } from "zustand";

export const useAppointment = create((set) => ({
  appointments: [],
  setAppointments: (appointments) => set({ appointments }),

  createAppointment: async (newAppointment) => {
    // Check if all required fields are filled
    if (
      !newAppointment.lastName ||
      !newAppointment.firstName ||
      !newAppointment.gboxAcc ||
      !newAppointment.sex ||
      !newAppointment.desiredDate ||
      !newAppointment.concern ||
      !newAppointment.idNum || // Ensure idNum is provided
      isNaN(newAppointment.idNum) // Ensure idNum is a number
    ) {
      return {
        success: false,
        message: "Please fill in all fields correctly.",
      };
    }

    // Validate Gbox email
    const gboxEmailPattern = /^[a-zA-Z0-9._%+-]+@gbox\.adnu\.edu\.ph$/;
    if (!gboxEmailPattern.test(newAppointment.gboxAcc)) {
      return {
        success: false,
        message: "Please provide a valid Gbox email address.",
      };
    }

    // Format the desiredDate to ISO 8601 format
    const formattedDesiredDate = new Date(
      newAppointment.desiredDate
    ).toISOString();

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newAppointment,
        desiredDate: formattedDesiredDate, // Ensure the date is properly formatted
        idNum: Number(newAppointment.idNum), // Ensure idNum is passed as a number
      }),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ appointments: [...state.appointments, data.data] }));
    return { success: true, message: "Appointment booked successfully" };
  },

  fetchAppointments: async () => {
    const res = await fetch("/api/appointments");
    const data = await res.json();
    set({ appointments: data.data });
  },

  deleteAppointment: async (aid) => {
    const res = await fetch(`/api/appointments/${aid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      appointments: state.appointments.filter(
        (appointment) => appointment._id !== aid
      ),
    }));
    return { success: true, message: data.message };
  },

  updateAppointment: async (aid, updatedAppointment) => {
    const res = await fetch(`/api/appointments/${aid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAppointment),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment._id === aid ? data.data : appointment
      ),
    }));

    return { success: true, message: data.message };
  },

  // Updated function to handle `status`, `scheduledDate`, and `desiredDate`
  updateAppointmentStatus: async (aid, status, scheduledDate) => {
    const res = await fetch(`/api/appointments/${aid}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, scheduledDate }),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment._id === aid
          ? {
              ...appointment,
              status,
              scheduledDate, // Update only the scheduled date and status
            }
          : appointment
      ),
    }));

    return {
      success: true,
      message: "Appointment status updated successfully",
    };
  },
}));
