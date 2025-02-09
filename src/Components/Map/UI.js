import React from "react";
import { useKeysContext } from "./keysContext";
import { useBottomMessageContext } from "./bottomMessageContext";

export const UI = () => {
  const { availableKeys } = useKeysContext();
  const { bottomMessage } = useBottomMessageContext();
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50">
      <div className="text-white text-2xl p-4">Keys: {availableKeys || 0}</div>

      <div className="absolute w-full bottom-0 text-center text-white text-2xl p-4">
        {bottomMessage}
      </div>
    </div>
  );
};
