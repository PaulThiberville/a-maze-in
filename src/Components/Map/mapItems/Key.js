import { Key as KeyModel } from "../../../Models";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { useKeysContext } from "../keysContext";
import { useCallback, useMemo } from "react";

const Key = ({ id, position }) => {
  const { collectKey, collectedKeys } = useKeysContext();

  const isCollected = useMemo(
    () => collectedKeys.includes(id),
    [collectedKeys, id]
  );

  const handleTriggerEnter = useCallback(() => {
    collectKey(id);
  }, [collectKey, id]);

  if (isCollected) {
    return null;
  }

  return (
    <group>
      <KeyModel position={position} />
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

export default Key;
