import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { clearHabitReminder, upsertHabitReminder } from "../utils/reminders";

const HabitContext = createContext(null);

const API_URL = "https://ansh-habit-tracker-api.vercel.app/api";

// Helper for safe storage in React Native
const safeStorage = {
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {}
  },
};

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load habits on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const token = await safeStorage.getItem("user_token");
      const response = await fetch(`${API_URL}/habits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setHabits(data);
      }
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habitData) => {
    try {
      const token = await safeStorage.getItem("user_token");
      const response = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(habitData),
      });
      const newHabit = await response.json();
      if (response.ok) {
        setHabits((prev) => [newHabit, ...prev]);
        await upsertHabitReminder(newHabit);
        return { success: true, habit: newHabit };
      }
      return { success: false, error: newHabit.error };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const toggleHabit = async (habitId, completed) => {
    try {
      const token = await safeStorage.getItem("user_token");
      // Update locally first for snappy UI (Optimistic Update)
      const originalHabits = [...habits];
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, completedToday: completed } : h))
      );

      const response = await fetch(`${API_URL}/habits/${habitId}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        setHabits(originalHabits); // Rollback on error
        return;
      }

      // Pull canonical data after server write so Home screen stays in sync.
      await fetchHabits();
    } catch (err) {
      console.error("Failed to toggle habit:", err);
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      const token = await safeStorage.getItem("user_token");
      const response = await fetch(`${API_URL}/habits/${habitId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
        await clearHabitReminder(habitId);
      }
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  };

  const updateHabit = async (habitId, habitData) => {
    try {
      const token = await safeStorage.getItem("user_token");
      const response = await fetch(`${API_URL}/habits/${habitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(habitData),
      });
      const updatedHabit = await response.json();
      if (response.ok) {
        setHabits((prev) => prev.map((h) => (h.id === habitId ? updatedHabit : h)));
        await upsertHabitReminder(updatedHabit);
        return { success: true, habit: updatedHabit };
      }
      return { success: false, error: updatedHabit.error };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const value = useMemo(
    () => ({
      habits,
      loading,
      addHabit,
      toggleHabit,
      deleteHabit,
      updateHabit,
      refreshHabits: fetchHabits,
      getHabitById: (id) => habits.find((h) => h.id === id),
    }),
    [habits, loading]
  );

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitProvider");
  }
  return context;
}
