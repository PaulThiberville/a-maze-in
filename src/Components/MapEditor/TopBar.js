import React from "react";

export const TopBar = ({
  mapName,
  setMapName,
  canSaveMap,
  onSaveMap,
  onClearMap,
}) => {
  return (
    <div className="absolute top-0 w-full p-1 flex justify-evenly items-center">
      <input
        type="text"
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
        className="w-[200px] h-[30px] bg-white"
      />
      <div className="flex flex-row gap-1">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded-md"
          onClick={onSaveMap}
          disabled={!canSaveMap}
        >
          Save
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-md"
          onClick={onClearMap}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
