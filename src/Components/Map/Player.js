import { useEffect, useRef } from "react";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import useMousePosition from "../../Hooks/useMousePosition";
import { Vector3 } from "three";
const MOVEMENT_SPEED = 3;
const ROTATION_SPEED = 0.2;
export function Player({ position, onPositionChange }) {
  const playerRef = useRef();
  const cameraRef = useRef();
  const cameraDirection = useRef(new Vector3());
  const [subscribe, getKeys] = useKeyboardControls();
  const { mousePosition, isMouseLocked } = useMousePosition();
  const previousMouseX = useRef(mousePosition.x);

  useFrame(() => {
    const { forward, backward, left, right } = getKeys();

    const getMouseXDelta = () => {
      const mouseXDelta = mousePosition.x - previousMouseX.current;
      previousMouseX.current = mousePosition.x;
      if (!isMouseLocked) {
        return 0;
      }
      return mouseXDelta;
    };

    const mouseXDelta = getMouseXDelta();

    if (playerRef?.current && cameraRef?.current) {
      // Obtenir la direction de la caméra
      cameraRef.current.getWorldDirection(cameraDirection.current);

      // Calculer les vecteurs de mouvement basés sur la direction de la caméra
      let moveX = 0;
      let moveZ = 0;

      if (forward) {
        moveX += cameraDirection.current.x;
        moveZ += cameraDirection.current.z;
      }
      if (backward) {
        moveX -= cameraDirection.current.x;
        moveZ -= cameraDirection.current.z;
      }
      if (left) {
        moveX += cameraDirection.current.z;
        moveZ -= cameraDirection.current.x;
      }
      if (right) {
        moveX -= cameraDirection.current.z;
        moveZ += cameraDirection.current.x;
      }

      // Normaliser le vecteur de mouvement
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      if (length > 0) {
        moveX = (moveX / length) * MOVEMENT_SPEED;
        moveZ = (moveZ / length) * MOVEMENT_SPEED;
      }

      playerRef.current.setLinvel(
        {
          x: moveX,
          y: 0,
          z: moveZ,
        },
        true
      );

      playerRef.current.setAngvel(
        {
          x: 0,
          y: -mouseXDelta * ROTATION_SPEED,
          z: 0,
        },
        true
      );
    }
    if (playerRef?.current?.translation) {
      onPositionChange(playerRef.current.translation());
    }
  });

  return (
    <>
      <RigidBody
        ref={playerRef}
        position={position}
        gravityScale={0}
        enabledRotations={[false, true, false]}
        friction={0}
        restitution={0}
        lockRotations={[true, false, true]}
        name="player"
      >
        <CapsuleCollider args={[0.5, 0.125]} />
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0.5, 0]}
          fov={75}
        />
        <pointLight position={[0, 0.5, 0]} intensity={5} />
      </RigidBody>
    </>
  );
}
