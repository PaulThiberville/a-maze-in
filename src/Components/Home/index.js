import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-1">
      <h1 className="text-4xl font-bold text-white pb-10">A Maze In</h1>
      <button
        onClick={() => navigate("/map-selection")}
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
      >
        Select map
      </button>
      <button
        onClick={() => navigate("/map-pre-config")}
        className="bg-blue-500 text-white px-2 py-1 rounded-md"
      >
        Create map
      </button>
    </div>
  );
};
