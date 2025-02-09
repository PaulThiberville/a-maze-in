import { useEffect, useState } from "react";

export const MapItemSizeProvider = ({ mapSize, children }) => {
  const [mapItemSize, setMapItemSize] = useState(0);

  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const updateSize = () => {
      setMapItemSize(mapElement.clientWidth / mapSize);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(mapElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapSize]);

  return <>{children(mapItemSize)}</>;
};
