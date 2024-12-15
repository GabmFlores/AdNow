import { create } from "zustand";

export const usePatient = create((set) => ({
  patients: [],

  setPatients: (patients) => set({ patients }),

  createPatient: async (newPatient) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "gboxAcc", // Ensure this field is consistent with the backend
      "sex",
      "course",
      "idNum",
    ];

    const missingFields = requiredFields.filter(
      (field) => !newPatient[field] || newPatient[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Please fill in all fields: ${missingFields.join(", ")}.`,
      };
    }

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        patients: [...state.patients, data.data], // Append the new patient
      }));
      return { success: true, message: "Patient created successfully." };
    } catch (error) {
      console.error("Error creating patient:", error);
      return {
        success: false,
        message: "An error occurred while creating the patient.",
      };
    }
  },

  fetchPatients: async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      if (data.success) {
        set({ patients: data.data });
      } else {
        console.error("Error fetching patients:", data.message);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  },

  deletePatient: async (pid) => {
    try {
      const res = await fetch(`/api/patients/${pid}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        patients: state.patients.filter((patient) => patient._id !== pid), // Remove patient from the list
      }));
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Error deleting patient:", error);
      return {
        success: false,
        message: "An error occurred while deleting the patient.",
      };
    }
  },

  updatePatient: async (pid, updatedPatient) => {
    try {
      const payload = JSON.stringify(updatedPatient);
      const res = await fetch(`/api/patients/${pid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        patients: state.patients.map(
          (patient) => (patient._id === pid ? data.data : patient) // Replace updated patient in the list
        ),
      }));

      return { success: true, message: "Patient updated successfully." };
    } catch (error) {
      console.error("Error updating patient:", error);
      return {
        success: false,
        message: "An error occurred while updating the patient.",
      };
    }
  },
}));
