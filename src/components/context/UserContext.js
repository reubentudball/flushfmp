import React, { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [facility, setFacility] = useState(() => {
    const storedFacility = localStorage.getItem("facility");
    return storedFacility ? JSON.parse(storedFacility) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (facility) {
      localStorage.setItem("facility", JSON.stringify(facility));
    } else {
      localStorage.removeItem("facility");
    }
  }, [facility]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setFacility(null);
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
