import { CuboidCollider, RigidBody } from "@react-three/rapier";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useDoorsContext } from "../doorsContext";
import { useBottomMessageContext } from "../bottomMessageContext";
import { useKeysContext } from "../keysContext";
import { useMaterials } from "../materials";

const DoorBase = ({
  rotation,
  position,
  isOpen,
  onIntersectionEnter,
  onIntersectionExit,
}) => {
  const { door } = useMaterials();
  return (
    <group position={position} rotation={rotation}>
      {!Boolean(isOpen) && (
        <RigidBody
          enabledTranslations={[]}
          enabledRotations={[]}
          friction={0}
          restitution={0}
        >
          <mesh material={door}>
            <boxGeometry args={[0.1, 3, 1]} />
          </mesh>
        </RigidBody>
      )}
      <RigidBody type="fixed" friction={0} restitution={0}>
        <mesh position={[0, 0, -0.5]} material={door}>
          <boxGeometry args={[0.3, 2.3, 0.3]} />
        </mesh>
        <mesh position={[0, 0, 0.5]} material={door}>
          <boxGeometry args={[0.3, 2.3, 0.3]} />
        </mesh>
        <mesh position={[0, 1.3, 0]} material={door}>
          <boxGeometry args={[0.3, 0.3, 1.3]} />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        sensor
        onIntersectionEnter={onIntersectionEnter}
        onIntersectionExit={onIntersectionExit}
      >
        <CuboidCollider args={[1, 0.5, 0.5]} position={[0, 0, 0]} />
      </RigidBody>
    </group>
  );
};

const Door = ({ id, position, neighbors }) => {
  const [subscribe, getKeys] = useKeyboardControls();
  const [isPlayerNear, setIsPlayerNear] = useState(false);
  const { openedDoors, openDoor } = useDoorsContext();
  const { setBottomMessage } = useBottomMessageContext();
  const { availableKeys, consumeKey } = useKeysContext();

  const handleIntersectionEnter = useCallback((e) => {
    if (e.rigidBodyObject.name === "player") {
      setIsPlayerNear(true);
    }
  }, []);

  const handleIntersectionExit = useCallback((e) => {
    if (e.rigidBodyObject.name === "player") {
      setIsPlayerNear(false);
    }
  }, []);

  const isOpen = useMemo(() => {
    return openedDoors.includes(id);
  }, [openedDoors, id]);

  useEffect(() => {
    if (!isPlayerNear || isOpen) {
      return setBottomMessage("");
    }
    if (availableKeys > 0) {
      return setBottomMessage("Press E to open the door");
    }
    return setBottomMessage("You need a key to open the door");
  }, [isPlayerNear, isOpen, availableKeys, setBottomMessage]);

  useFrame(() => {
    const { interact } = getKeys();
    if (interact && availableKeys > 0 && !isOpen && isPlayerNear) {
      openDoor(id);
      consumeKey();
    }
  });

  if (
    neighbors.top &&
    neighbors.bottom &&
    !neighbors.left &&
    !neighbors.right
  ) {
    return (
      <DoorBase
        rotation={[0, 0, 0]}
        position={position}
        isOpen={isOpen}
        onIntersectionEnter={handleIntersectionEnter}
        onIntersectionExit={handleIntersectionExit}
      />
    );
  }

  if (
    neighbors.left &&
    neighbors.right &&
    !neighbors.top &&
    !neighbors.bottom
  ) {
    return (
      <DoorBase
        rotation={[0, Math.PI / 2, 0]}
        position={position}
        isOpen={isOpen}
        onIntersectionEnter={handleIntersectionEnter}
        onIntersectionExit={handleIntersectionExit}
      />
    );
  }
};

export default Door;
