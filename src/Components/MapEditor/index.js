import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapItemSelectionBar } from "./MapItemSelectionBar";
import { MapItem } from "./MapItem";
import { TopBar } from "./TopBar";
import { MapItemSizeProvider } from "./MapItemSizeProvider";
import { useNavigate, useSearchParams } from "react-router-dom";

export const MapEditor = () => {
  const [searchParams] = useSearchParams();
  const mapSize = searchParams.get("size") || 9;
  const [grid, setGrid] = useState([]);
  const [selectedItem, setSelectedItem] = useState("empty");
  const [mapName, setMapName] = useState("");
  const navigate = useNavigate();

  const generateGrid = useCallback(() => {
    const grid = [];
    const positionBase = -(mapSize / 2 - 0.5);
    for (let z = 0; z < mapSize; z++) {
      for (let x = 0; x < mapSize; x++) {
        const isOnTheEdge =
          z === 0 || z === mapSize - 1 || x === 0 || x === mapSize - 1;
        const id = `${z}-${x}`;
        const position = [positionBase + x, 0.5, positionBase + z];
        if (isOnTheEdge) {
          grid.push({
            type: "wall",
            id,
            position,
            isLocked: true,
          });
        } else {
          grid.push({
            type: "empty",
            id,
            position,
          });
        }
      }
    }
    return grid;
  }, [mapSize]);

  const renderGrid = useCallback(
    (mapItemSize) => {
      return grid.map((item) => (
        <MapItem
          key={item.id}
          mapItemSize={mapItemSize}
          setGrid={setGrid}
          selectedItem={selectedItem}
          {...item}
        />
      ));
    },
    [grid, selectedItem]
  );

  const canSaveMap = useMemo(() => {
    const haveStart = grid.some((item) => item.type === "start");
    const haveEnd = grid.some((item) => item.type === "end");
    const haveName = Boolean(mapName);
    return haveStart && haveEnd && haveName;
  }, [grid, mapName]);

  const handleSaveMap = useCallback(() => {
    if (!canSaveMap) {
      return;
    }
    const id = Date.now();
    localStorage.setItem(
      `map-${id}`,
      JSON.stringify({
        id,
        name: mapName,
        size: mapSize,
        grid,
      })
    );
    navigate("/");
  }, [canSaveMap, mapName, mapSize, grid]);

  const handleClearMap = useCallback(() => {
    setGrid(generateGrid());
  }, [generateGrid]);

  useEffect(() => {
    if (grid.length === 0) {
      setGrid(generateGrid());
    }
  }, [grid, generateGrid]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <TopBar
        mapName={mapName}
        setMapName={setMapName}
        grid={grid}
        canSaveMap={canSaveMap}
        onSaveMap={handleSaveMap}
        onClearMap={handleClearMap}
      />
      <div id="map" className="h-2/3 aspect-square flex flex-row flex-wrap">
        <MapItemSizeProvider mapSize={mapSize}>
          {(mapItemSize) => renderGrid(mapItemSize)}
        </MapItemSizeProvider>
      </div>
      <MapItemSelectionBar
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};
