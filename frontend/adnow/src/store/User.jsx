import { create } from "zustand";
import { persist } from "zustand/middleware";

const fetchWithCredentials = (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
};

export const useUsers = create(
  persist(
    (set) => ({
      users: [],
      authenticatedUser: null,
      setUsers: (users) => set({ users }),
      setAuthenticatedUser: (user) => set({ authenticatedUser: user }),

      createUser: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password) {
          return { success: false, message: "Please fill in all fields." };
        }
        const res = await fetchWithCredentials("/api/users", {
          method: "POST",
          body: JSON.stringify(newUser),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };
        set((state) => ({ users: [...state.users, data.data] }));
        return { success: true, message: "User created successfully" };
      },

      fetchUsers: async () => {
        const res = await fetchWithCredentials("/api/users");
        const data = await res.json();
        set({ users: data.data });
      },

      deleteUser: async (id) => {
        const res = await fetchWithCredentials(`/api/users/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };
        set((state) => ({
          users: state.users.filter((user) => user._id !== id),
        }));
        return { success: true, message: data.message };
      },

      updateUser: async (id, updatedUser) => {
        const res = await fetchWithCredentials(`/api/users/${id}`, {
          method: "PATCH",
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

      loginUser: async (username, password) => {
        const res = await fetchWithCredentials("/api/users/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };
        set({ authenticatedUser: data.data });
        return { success: true, message: "Login successful" };
      },

      logoutUser: async () => {
        const res = await fetchWithCredentials("/api/users/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (data.success) {
          set({ authenticatedUser: null });
        }
        return data;
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ authenticatedUser: state.authenticatedUser }),
    }
  )
);
