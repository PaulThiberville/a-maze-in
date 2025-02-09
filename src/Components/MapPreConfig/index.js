import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MapPreConfig = () => {
  const [mapSize, setMapSize] = useState(0);
  const navigate = useNavigate();

  const handleChangeMapSize = (e) => {
    const value = e.target.value;
    return setMapSize(value);
  };

  const handleValidate = () => {
    if (mapSize < 9 || mapSize > 64) {
      return alert(
        "Map size must be between 9 and 64 but is actually " + mapSize
      );
    }
    navigate(`/map-editor?size=${mapSize}`);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full flex flex-row justify-center items-center gap-2">
        <input
          type="number"
          value={mapSize}
          onChange={handleChangeMapSize}
          min={9}
          max={64}
          className="w-1/3 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleValidate}
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
        >
          Validate
        </button>
      </div>
    </div>
  );
};
