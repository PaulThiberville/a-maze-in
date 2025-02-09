import { RigidBody } from "@react-three/rapier";
import { useMaterials } from "../materials";

const Wall = ({ position, neighbors }) => {
  const { wall } = useMaterials();

  return (
    <RigidBody type="fixed" friction={0} restitution={0}>
      <mesh position={[position[0], position[1], position[2]]} material={wall}>
        <boxGeometry args={[0.25, 3, 0.25]} />
      </mesh>
      {neighbors.top && (
        <mesh
          position={[position[0], position[1], position[2] + 0.25]}
          material={wall}
        >
          <boxGeometry args={[0.1, 3, 0.5]} />
        </mesh>
      )}
      {neighbors.right && (
        <mesh
          position={[position[0] + 0.25, position[1], position[2]]}
          material={wall}
        >
          <boxGeometry args={[0.5, 3, 0.1]} />
        </mesh>
      )}
      {neighbors.bottom && (
        <mesh
          position={[position[0], position[1], position[2] - 0.25]}
          material={wall}
        >
          <boxGeometry args={[0.1, 3, 0.5]} />
        </mesh>
      )}
      {neighbors.left && (
        <mesh
          position={[position[0] - 0.25, position[1], position[2]]}
          material={wall}
        >
          <boxGeometry args={[0.5, 3, 0.1]} />
        </mesh>
      )}
      {neighbors.topLeft && neighbors.topLeft?.type !== "door" && (
        <mesh
          position={[position[0] - 0.25, position[1], position[2] + 0.25]}
          rotation={[0, -Math.PI / 4, 0]}
          material={wall}
        >
          <boxGeometry args={[0.1, 3, Math.sqrt(0.5)]} />
        </mesh>
      )}
      {neighbors.topRight && neighbors.topRight?.type !== "door" && (
        <mesh
          position={[position[0] + 0.25, position[1], position[2] + 0.25]}
          rotation={[0, Math.PI / 4, 0]}
          material={wall}
        >
          <boxGeometry args={[0.1, 3, Math.sqrt(0.5)]} />
        </mesh>
      )}
      {neighbors.bottomRight && neighbors.bottomRight?.type !== "door" && (
        <mesh
          position={[position[0] + 0.25, position[1], position[2] - 0.25]}
          rotation={[0, -Math.PI / 4, 0]}
          material={wall}
        >
          <boxGeometry args={[0.1, 3, Math.sqrt(0.5)]} />
        </mesh>
      )}
      {neighbors.bottomLeft && neighbors.bottomLeft?.type !== "door" && (
        <mesh
          position={[position[0] - 0.25, position[1], position[2] - 0.25]}
          rotation={[0, Math.PI / 4, 0]}
          material={wall}
        >
          <boxGeometry args={[0.1, 3, Math.sqrt(0.5)]} />
        </mesh>
      )}
    </RigidBody>
  );
};

export default Wall;
