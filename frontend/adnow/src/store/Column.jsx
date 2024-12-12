import { create } from "zustand";

export const useColumn = create((set) => ({
  columns: [],

  setColumns: (columns) => set({ columns }),

  createColumn: async (newColumn) => {
    const requiredFields = ["image", "columnTitle", "content"];

    const missingFields = requiredFields.filter(
      (field) => !newColumn[field] || newColumn[field].trim() === ""
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Please fill in all fields: ${missingFields.join(", ")}.`,
      };
    }

    try {
      const res = await fetch("/api/columns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newColumn),
      });

      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({ columns: [...state.columns, data.data] }));
      return { success: true, message: "Column created successfully." };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error creating column." };
    }
  },

  fetchColumns: async () => {
    try {
      const res = await fetch("/api/columns");
      const data = await res.json();
      set({ columns: data.data });
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  },

  deleteColumn: async (columnId) => {
    try {
      const res = await fetch(`/api/columns/${columnId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        columns: state.columns.filter((column) => column._id !== columnId),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Error deleting column." };
    }
  },

  updateColumn: async (columnId, updatedColumn) => {
    try {
      const payload = JSON.stringify(updatedColumn);
      const res = await fetch(`/api/columns/${columnId}`, {
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
        columns: state.columns.map((column) =>
          column._id === columnId ? data.data : column
        ),
      }));

      return { success: true, message: "Column updated successfully." };
    } catch (error) {
      console.error("Error updating column:", error);
      return { success: false, message: "Error updating column." };
    }
  },
}));
