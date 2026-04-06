import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// In-memory fallback for environments with broken storage
const memoryStore = {};

// Safe storage wrapper to handle native vs web/legacy environments
const safeStorage = {
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn(`AsyncStorage.getItem error for ${key}:`, e.message);
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      }
      return memoryStore[key] || null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(`AsyncStorage.setItem error for ${key}:`, e.message);
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
        return;
      }
      memoryStore[key] = value;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn(`AsyncStorage.removeItem error for ${key}:`, e.message);
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
        return;
      }
      delete memoryStore[key];
    }
  }
};

// ✅ Live Vercel Backend
const API_URL = "https://ansh-habit-tracker-api.vercel.app/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuth = async () => {
      try {
        const token = await safeStorage.getItem("user_token");
        const userData = await safeStorage.getItem("user_data");
        
        if (token) {
          setIsAuthenticated(true);
          if (userData) {
            try {
              setUser(JSON.parse(userData));
            } catch (err) {
              console.error("FAILED TO PARSE STORED USER DATA:", userData);
              await safeStorage.removeItem("user_data");
              await safeStorage.removeItem("user_token");
              setIsAuthenticated(false);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email, password) => {
    console.log("Attempting sign in for:", email);
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("SERVER RETURNED NON-JSON:", text);
        return { success: false, error: "Server returned a non-JSON response. Check logs." };
      }

      console.log("Sign in response:", data);
      if (!response.ok) return { success: false, error: data.error };

      await safeStorage.setItem("user_token", data.token);
      await safeStorage.setItem("user_data", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (e) {
      console.error("Sign in error:", e);
      return { success: false, error: "Network error. Check your connection." };
    }
  };

  const signUp = async (name, email, password) => {
    console.log("Attempting sign up for:", email);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      console.log("Sign up response:", data);
      
      if (!response.ok) return { success: false, error: data.error };

      await safeStorage.setItem("user_token", data.token);
      await safeStorage.setItem("user_data", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (e) {
      console.error("Sign up error:", e);
      return { success: false, error: "Network error. Check your connection." };
    }
  };

  const signOut = async () => {
    try {
      const token = await safeStorage.getItem("user_token");
      await fetch(`${API_URL}/auth/signout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      await safeStorage.removeItem("user_token");
      await safeStorage.removeItem("user_data");
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Failed to clear auth state", e);
    }
  };

  const completeOnboarding = async (goal, remindersEnabled, level, focusTime) => {
    try {
      const token = await safeStorage.getItem("user_token");
      const response = await fetch(`${API_URL}/auth/onboarding`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ goal, remindersEnabled, level, focusTime }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.error };

      const updatedUser = { ...user, ...data.user };
      await safeStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (e) {
      console.error("Onboarding error:", e);
      return { success: false, error: "Failed to save onboarding details." };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      signIn, 
      signUp, 
      signOut,
      completeOnboarding 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
