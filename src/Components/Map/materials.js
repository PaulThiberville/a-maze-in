import { createContext, useContext } from "react";
import * as THREE from "three";

// Créer les matériaux une seule fois pour toute l'application
export const sharedMaterials = {
  wall: new THREE.MeshStandardMaterial({ color: "darkgray" }),
  door: new THREE.MeshStandardMaterial({
    color: "white",
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 1,
  }),
};

export const MaterialsContext = createContext(sharedMaterials);
export const useMaterials = () => useContext(MaterialsContext);
