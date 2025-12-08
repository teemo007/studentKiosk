import { createContext, useState } from "react";

export const DisplayContext = createContext({
  isOpen: {},
  setIsOpen: () => null,
  currentTopic: null,
  setCurrentTopic: () => {},
  currentFlow: null, // Generic flowKey, such as "claim" / "wifi-walkthrough-for-windows-users" / "print_library_pc"
  setCurrentFlow: () => {},
  currentSessionId: null,
  setCurrentSessionId: () => {},
});

export const DisplayProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState({});
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentFlow, setCurrentFlow] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const value = {
    isOpen,
    setIsOpen,
    currentTopic,
    setCurrentTopic,
    currentFlow,
    setCurrentFlow,
    currentSessionId,
    setCurrentSessionId,
  };

  return (
    <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>
  );
};
