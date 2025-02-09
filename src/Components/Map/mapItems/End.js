import { BallCollider, RigidBody } from "@react-three/rapier";
import { Model as FlagModel } from "../../../Models/Flag";

const End = ({ position }) => {
  const handleTriggerEnter = () => {
    console.log("WIN");
  };
  return (
    <group>
      <FlagModel position={[position[0], 1.5, position[2]]} />
      <RigidBody
        type="fixed"
        colliders="ball"
        sensor
        position={position}
        onIntersectionEnter={handleTriggerEnter}
      >
        <BallCollider args={[0.45]} />
      </RigidBody>
    </group>
  );
};

export default End;
