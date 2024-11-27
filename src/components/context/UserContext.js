import React, { createContext, useState, useContext } from "react";

export const UserContext = createContext();

const ONE_HOUR = 60 * 60 * 1000; // One hour in milliseconds, adjust as needed

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (Date.now() < parsed.expiry) {
        return parsed.data;
      }
    }
    return null;
  });

  const [facility, setFacilityState] = useState(() => {
    const storedFacility = localStorage.getItem("facility");
    if (storedFacility) {
      const parsed = JSON.parse(storedFacility);
      if (Date.now() < parsed.expiry) {
        return parsed.data;
      }
    }
    return null;
  });

  const setUser = (data) => {
    if (data) {
      const expiry = Date.now() + ONE_HOUR;
      localStorage.setItem("user", JSON.stringify({ data, expiry }));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(data);
  };

  const setFacility = (data) => {
    if (data) {
      const expiry = Date.now() + ONE_HOUR;
      localStorage.setItem("facility", JSON.stringify({ data, expiry }));
    } else {
      localStorage.removeItem("facility");
    }
    setFacilityState(data);
  };

  const logout = () => {
    localStorage.clear();
    setUserState(null);
    setFacilityState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, facility, setFacility, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
