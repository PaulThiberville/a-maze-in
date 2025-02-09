import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const DoorsContext = createContext();

export const DoorsProvider = ({ children }) => {
  const [openedDoors, setOpenedDoors] = useState([]);

  const openDoor = useCallback((id) => {
    setOpenedDoors((previousOpenedDoors) => [...previousOpenedDoors, id]);
  }, []);

  const value = useMemo(() => {
    return {
      openedDoors,
      openDoor,
    };
  }, [openedDoors, openDoor]);

  return (
    <DoorsContext.Provider value={value}>{children}</DoorsContext.Provider>
  );
};

export function useDoorsContext() {
  return useContext(DoorsContext);
}
