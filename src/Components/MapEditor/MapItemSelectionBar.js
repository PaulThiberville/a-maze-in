import React from "react";
import { availableMapItems } from "./availableMapItems";

export const MapItemSelectionBar = ({ selectedItem, setSelectedItem }) => {
  return (
    <div className="absolute bottom-0 w-full flex flex-row justify-center items-center space-x-2 p-2">
      {Object.entries(availableMapItems).map(([key, value]) => {
        const isSelected = selectedItem === key;
        return (
          <div
            key={key}
            className={`w-20 aspect-square p-1 flex justify-center items-end ${
              value.color
            } border-gray-100 border-1 ${isSelected ? "border-2" : ""}`}
            onClick={() => setSelectedItem(key)}
          >
            <div className="bg-black px-2 py-[2px] rounded-full">
              <p className="text-white text-xs">{key}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
