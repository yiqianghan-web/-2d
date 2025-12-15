import * as THREE from 'three';

export interface DualPosition {
  treePosition: THREE.Vector3;
  scatterPosition: THREE.Vector3;
  treeRotation: THREE.Euler;
  scatterRotation: THREE.Euler;
  scale: number;
}
