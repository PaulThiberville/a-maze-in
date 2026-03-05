import React, { useCallback } from "react";

const dispatchKey = (code, type) => {
  window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true }));
};

const ControlButton = ({ code, label, className }) => {
  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      dispatchKey(code, "keydown");
    },
    [code]
  );

  const handlePointerUp = useCallback(
    (e) => {
      e.preventDefault();
      dispatchKey(code, "keyup");
    },
    [code]
  );

  return (
    <button
      className={`flex items-center justify-center w-14 h-14 rounded-lg bg-white/20 border border-white/40 text-white text-xl font-bold select-none active:bg-white/40 ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {label}
    </button>
  );
};

export const MobileControls = () => {
  return (
    <div className="absolute bottom-6 w-full flex justify-between items-end px-6 pointer-events-none">
      {/* D-pad */}
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        <ControlButton code="KeyW" label="▲" />
        <div className="flex gap-1">
          <ControlButton code="KeyA" label="◀" />
          <ControlButton code="KeyS" label="▼" />
          <ControlButton code="KeyD" label="▶" />
        </div>
      </div>

      {/* Interact button */}
      <div className="pointer-events-auto">
        <ControlButton
          code="KeyE"
          label="E"
          className="w-16 h-16 rounded-full text-sm"
        />
      </div>
    </div>
  );
};
