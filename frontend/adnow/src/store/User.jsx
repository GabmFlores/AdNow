import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUsers = create(
  persist(
    (set) => ({
      users: [],
      authenticatedUser: null, // Renamed from currentUser to authenticatedUser

      setUsers: (users) => set({ users }),
      setAuthenticatedUser: (user) => set({ authenticatedUser: user }),

      // Create a new user
      createUser: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password) {
          return { success: false, message: "Please fill in all fields." };
        }

        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({ users: [...state.users, data.data] }));
        return { success: true, message: "User created successfully" };
      },

      // Fetch users from the database
      fetchUsers: async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        set({ users: data.data });
      },

      // Delete a user
      deleteUser: async (id) => {
        const res = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({
          users: state.users.filter((user) => user._id !== id),
        }));
        return { success: true, message: data.message };
      },

      // Update a user
      updateUser: async (id, updatedUser) => {
        const res = await fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({
          users: state.users.map((user) =>
            user._id === id ? data.data : user
          ),
        }));

        return { success: true, message: data.message };
      },

      // Log in user
      loginUser: async (username, password) => {
        const res = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set({ authenticatedUser: data.data }); // Store logged-in user info as authenticatedUser
        return { success: true, message: "Login successful" };
      },

      // Log out user (without navigation logic)
      logoutUser: async () => {
        const res = await fetch("/api/users/logout", {
          method: "POST",
        });

        const data = await res.json();
        if (data.success) {
          set({ authenticatedUser: null }); // Clear the authenticatedUser state
        }
        return data;
      },
    }),
    {
      name: "user-storage", // Key to store the data in localStorage
      partialize: (state) => ({ authenticatedUser: state.authenticatedUser }), // Persist only authenticatedUser
    }
  )
);
