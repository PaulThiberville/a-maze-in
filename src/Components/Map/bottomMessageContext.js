import React, { createContext, useContext, useMemo, useState } from "react";

const BottomMessageContext = createContext();

export const BottomMessageProvider = ({ children }) => {
  const [bottomMessage, setBottomMessage] = useState("");

  const value = useMemo(() => {
    return {
      bottomMessage,
      setBottomMessage,
    };
  }, [bottomMessage, setBottomMessage]);

  return (
    <BottomMessageContext.Provider value={value}>
      {children}
    </BottomMessageContext.Provider>
  );
};

export function useBottomMessageContext() {
  return useContext(BottomMessageContext);
}
