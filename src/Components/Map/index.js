import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Physics } from "@react-three/rapier";
import { Player } from "./Player";
import availableMapItems from "./mapItems";
import { UI } from "./UI";
import { MaterialsContext, sharedMaterials } from "./materials";
import { KeysProvider } from "./keysContext";
import { BottomMessageProvider } from "./bottomMessageContext";
import { DoorsProvider } from "./doorsContext";

const controls = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "interact", keys: ["KeyE"] },
];

const INITIAL_NEIGHBORS = {
  top: null,
  right: null,
  bottom: null,
  left: null,
};

const getNeighbors = (id, map) => {
  const [z, x] = id.split("-").map(Number);
  const neighbors = { ...INITIAL_NEIGHBORS };
  neighbors.top =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z + 1}-${x}`
    ) || null;
  neighbors.right =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z}-${x + 1}`
    ) || null;

  neighbors.bottom =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z - 1}-${x}`
    ) || null;

  neighbors.left =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z}-${x - 1}`
    ) || null;

  neighbors.topLeft =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z + 1}-${x - 1}`
    ) || null;
  neighbors.topRight =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z + 1}-${x + 1}`
    ) || null;
  neighbors.bottomLeft =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z - 1}-${x - 1}`
    ) || null;
  neighbors.bottomRight =
    map.grid.find(
      (item) =>
        (item.type === "wall" || item.type === "door") &&
        item.id === `${z - 1}-${x + 1}`
    ) || null;
  return neighbors;
};

const getSurroundingChunks = (chunkId, chunks) => {
  const [chunkX, chunkZ] = chunkId.split("/").map(Number);
  const surroundingChunks = [];
  const topLeftChunkId = `${chunkX - CHUNK_SIZE}/${chunkZ + CHUNK_SIZE}`;
  const topChunkId = `${chunkX}/${chunkZ + CHUNK_SIZE}`;
  const topRightChunkId = `${chunkX + CHUNK_SIZE}/${chunkZ + CHUNK_SIZE}`;
  const bottomLeftChunkId = `${chunkX - CHUNK_SIZE}/${chunkZ - CHUNK_SIZE}`;
  const bottomChunkId = `${chunkX}/${chunkZ - CHUNK_SIZE}`;
  const bottomRightChunkId = `${chunkX + CHUNK_SIZE}/${chunkZ - CHUNK_SIZE}`;
  const rightChunkId = `${chunkX + CHUNK_SIZE}/${chunkZ}`;
  const leftChunkId = `${chunkX - CHUNK_SIZE}/${chunkZ}`;
  surroundingChunks.push(...(chunks[topChunkId] || []));
  surroundingChunks.push(...(chunks[bottomChunkId] || []));
  surroundingChunks.push(...(chunks[rightChunkId] || []));
  surroundingChunks.push(...(chunks[leftChunkId] || []));
  surroundingChunks.push(...(chunks[topLeftChunkId] || []));
  surroundingChunks.push(...(chunks[topRightChunkId] || []));
  surroundingChunks.push(...(chunks[bottomLeftChunkId] || []));
  surroundingChunks.push(...(chunks[bottomRightChunkId] || []));
  return surroundingChunks;
};

const generateMapByChunks = ({ mapId, chunkSize }) => {
  const mapData = JSON.parse(localStorage.getItem(`map-${mapId}`));
  const chunks = mapData.grid.reduce((acc, item) => {
    const chunkX = Math.floor(item.position[0] / chunkSize) * chunkSize;
    const chunkZ = Math.floor(item.position[2] / chunkSize) * chunkSize;
    const chunkId = `${chunkX}/${chunkZ}`;
    if (item.type === "empty") {
      return acc;
    }
    const formattedItem = {
      ...item,
      neighbors: getNeighbors(item.id, mapData),
    };

    acc[chunkId] = [...(acc[chunkId] || []), formattedItem];
    return acc;
  }, {});
  const startingPosition = mapData.grid.find(
    (item) => item.type === "start"
  ).position;
  const { id, name, size } = mapData;
  return { id, name, size, chunks, startingPosition };
};

const getCurrentChunkId = ({ position, chunkSize }) => {
  const chunkX = Math.floor(position[0] / chunkSize) * chunkSize;
  const chunkZ = Math.floor(position[2] / chunkSize) * chunkSize;
  const id = `${chunkX}/${chunkZ}`;
  return id;
};

const CHUNK_SIZE = 10;
export const Map = () => {
  const [searchParams] = useSearchParams();
  const [map, setMap] = useState(
    generateMapByChunks({
      mapId: searchParams.get("id"),
      chunkSize: CHUNK_SIZE,
    })
  );
  const [currentChunkId, setCurrentChunkId] = useState(
    getCurrentChunkId({
      position: map.startingPosition,
      chunkSize: CHUNK_SIZE,
    })
  );

  const renderMapItems = useCallback(() => {
    if (!map?.chunks) {
      return null;
    }
    const currentChunk = map.chunks[currentChunkId];
    const surroundingChunks = getSurroundingChunks(currentChunkId, map.chunks);
    return [...currentChunk, ...surroundingChunks].map((item) => {
      const MapItem = availableMapItems[item.type];
      if (!MapItem) {
        return null;
      }
      return <MapItem key={item.id} {...item} />;
    });
  }, [currentChunkId, map.chunks]);

  const handlePlayerPositionChange = useCallback((position) => {
    const formattedPosition = [position.x, 0, position.z];
    const updatedChunkId = getCurrentChunkId({
      position: formattedPosition,
      chunkSize: CHUNK_SIZE,
    });
    setCurrentChunkId((previousChunkId) => {
      if (updatedChunkId !== previousChunkId) {
        return updatedChunkId;
      }
      return previousChunkId;
    });
  }, []);

  const renderFloorAndRoof = useCallback(() => {
    const size = map.size;
    return (
      <>
        <mesh position={[0, -0.5, 0]} material={sharedMaterials.wall}>
          <boxGeometry args={[size, 1, size]} />
        </mesh>
        <mesh position={[0, 2.5, 0]} material={sharedMaterials.wall}>
          <boxGeometry args={[size, 1, size]} />
        </mesh>
      </>
    );
  }, [map.size]);

  return (
    <MaterialsContext.Provider value={sharedMaterials}>
      <KeysProvider>
        <DoorsProvider>
          <BottomMessageProvider>
            <div id="canvas-container" className="w-full h-full">
              <Canvas>
                <KeyboardControls map={controls}>
                  <Physics>
                    {Boolean(map?.startingPosition) && (
                      <Player
                        position={map.startingPosition}
                        onPositionChange={handlePlayerPositionChange}
                      />
                    )}
                    <React.Suspense fallback={null}>
                      {renderMapItems()}
                    </React.Suspense>
                    {renderFloorAndRoof()}
                  </Physics>
                </KeyboardControls>
              </Canvas>

              <UI />
            </div>
          </BottomMessageProvider>
        </DoorsProvider>
      </KeysProvider>
    </MaterialsContext.Provider>
  );
};
