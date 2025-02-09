import { Home } from "./Components/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MapEditor } from "./Components/MapEditor";
import { MapSelection } from "./Components/MapSelection";
import { Map } from "./Components/Map";
import { MapPreConfig } from "./Components/MapPreConfig";

export const Navigation = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map-selection" element={<MapSelection />} />
        <Route path="/map-pre-config" element={<MapPreConfig />} />
        <Route path="/map-editor" element={<MapEditor />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </BrowserRouter>
  );
};
