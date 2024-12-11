import { create } from "zustand";

export const usePatient = create((set) => ({
  patients: [],

  setPatients: (patients) => set({ patients }),

  createPatient: async (newPatient) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "gboxAcc",
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

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ patients: [...state.patients, data.data] }));
      return { success: true, message: "Patient created successfully." };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error creating patient." };
    }
  },

  fetchPatients: async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      set({ patients: data.data });
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

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        patients: state.patients.filter((patient) => patient._id !== pid),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error deleting patient." };
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
        console.error("Update error:", data.message);
        return { success: false, message: data.message };
      }

      set((state) => ({
        patients: state.patients.map((patient) =>
          patient._id === pid ? data.data : patient
        ),
      }));

      return { success: true, message: "Patient updated successfully." };
    } catch (error) {
      console.error("Error updating patient:", error);
      return { success: false, message: "Error updating patient." };
    }
  },
}));
