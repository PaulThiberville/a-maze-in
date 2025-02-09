import React, { useCallback, useMemo } from "react";
import { availableMapItems } from "./availableMapItems";

export const MapItem = ({
  mapItemSize,
  setGrid,
  selectedItem,
  id,
  type,
  isLocked,
}) => {
  const color = useMemo(() => {
    return availableMapItems[type].color;
  }, [type]);

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      if (isLocked) {
        return;
      }
      setGrid((prevGrid) => {
        return prevGrid.map((item) => {
          if (selectedItem === "start" || selectedItem === "end") {
            if (item.type === selectedItem) {
              return { ...item, type: "empty" };
            }
          }
          if (item.id === id) {
            return { ...item, type: selectedItem };
          }
          return item;
        });
      });
    },
    [id, setGrid, selectedItem, isLocked]
  );

  return (
    <div
      style={{ width: `${mapItemSize}px`, height: `${mapItemSize}px` }}
      className={`border-[1px] border-black ${color}`}
      onClick={handleClick}
    />
  );
};
