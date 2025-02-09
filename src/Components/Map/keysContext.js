import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const KeysContext = createContext();

export const KeysProvider = ({ children }) => {
  const [collectedKeys, setCollectedKeys] = useState([]);
  const [availableKeys, setAvailableKeys] = useState(0);

  const collectKey = useCallback((id) => {
    setCollectedKeys((previousCollectedKeys) => [...previousCollectedKeys, id]);
    setAvailableKeys((previousAvailableKeys) => previousAvailableKeys + 1);
  }, []);

  const consumeKey = useCallback(() => {
    setAvailableKeys((previousAvailableKeys) => previousAvailableKeys - 1);
  }, []);

  const value = useMemo(() => {
    return {
      collectedKeys,
      availableKeys,
      collectKey,
      consumeKey,
    };
  }, [collectedKeys, availableKeys, collectKey, consumeKey]);

  return <KeysContext.Provider value={value}>{children}</KeysContext.Provider>;
};

export function useKeysContext() {
  return useContext(KeysContext);
}
