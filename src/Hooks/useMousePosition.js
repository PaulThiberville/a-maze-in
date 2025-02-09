import React, { useState } from "react";
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [isMouseLocked, setIsMouseLocked] = useState(false);

  React.useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition((prev) => ({
        x: prev.x + ev.movementX,
        y: prev.y + ev.movementY,
      }));
    };

    const requestPointerLock = () => {
      document.body.requestPointerLock();
    };

    const handleLockChange = () => {
      setIsMouseLocked(document.pointerLockElement === document.body);
    };

    // Activer le Pointer Lock au clic
    document.addEventListener("click", requestPointerLock);

    // Utiliser movementX/Y au lieu de clientX/Y
    document.addEventListener("mousemove", updateMousePosition);

    // Suivre l'état du Pointer Lock
    document.addEventListener("pointerlockchange", handleLockChange);

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("click", requestPointerLock);
      document.removeEventListener("pointerlockchange", handleLockChange);
    };
  }, []);

  return { mousePosition, isMouseLocked };
};

export default useMousePosition;
