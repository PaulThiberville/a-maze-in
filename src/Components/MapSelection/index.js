import React from "react";
import { useNavigate } from "react-router-dom";

export const MapSelection = () => {
  const navigate = useNavigate();
  // recuperer toutes les maps dans le local storage
  const mapKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith("map-")
  );
  const maps = mapKeys.map((key) => JSON.parse(localStorage.getItem(key)));
  return (
    <div>
      {maps.map((map) => (
        <div
          key={map.id}
          className="text-white"
          onClick={() => navigate(`/map?id=${map.id}`)}
        >
          {map.name}
        </div>
      ))}
    </div>
  );
};
