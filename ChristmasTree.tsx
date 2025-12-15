import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { useStore } from '../store';
import { CONFIG, COLORS } from '../constants';

const tempObject = new THREE.Object3D();
const tempPos = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler();

// Helper to generate random point in sphere
const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

export const ChristmasTree: React.FC = () => {
  const mode = useStore((state) => state.mode);
  
  // -- Needles (The green part) --
  const needleMeshRef = useRef<THREE.InstancedMesh>(null);
  const needleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < CONFIG.NEEDLE_COUNT; i++) {
      // Tree Form Calculation (Spiral Cone)
      const y = Math.random() * CONFIG.TREE_HEIGHT; // Height from 0 to top
      const progress = y / CONFIG.TREE_HEIGHT;
      const radiusAtHeight = CONFIG.TREE_RADIUS * (1 - progress);
      const angle = (y * 5) + (Math.random() * Math.PI * 2); // Spiral + slight random
      
      // Add some "fluff" offset so it's not a perfect geometric cone
      const rOffset = (Math.random() - 0.5) * 1.5;
      const finalR = Math.max(0.1, radiusAtHeight + rOffset);
      
      const tx = Math.cos(angle) * finalR;
      const tz = Math.sin(angle) * finalR;
      const ty = y - CONFIG.TREE_HEIGHT / 2;

      // Orientation: Needles point somewhat outwards/upwards
      const treeRot = new THREE.Euler(
        (Math.random() - 0.5) * 0.5 - Math.PI / 4, // Tilt up
        angle, // Face outward
        (Math.random() - 0.5) * 0.5
      );

      data.push({
        treePos: new THREE.Vector3(tx, ty, tz),
        scatterPos: randomInSphere(CONFIG.SCATTER_RADIUS),
        treeRot,
        scatterRot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        scale: 0.8 + Math.random() * 0.5,
      });
    }
    return data;
  }, []);

  // -- Ornaments (The gold part) --
  const ornamentMeshRef = useRef<THREE.InstancedMesh>(null);
  const ornamentData = useMemo(() => {
    const data = [];
    for (let i = 0; i < CONFIG.ORNAMENT_COUNT; i++) {
        // Tree Form: randomly placed on surface of cone
        const y = Math.random() * (CONFIG.TREE_HEIGHT - 1);
        const progress = y / CONFIG.TREE_HEIGHT;
        const radiusAtHeight = (CONFIG.TREE_RADIUS * 0.9) * (1 - progress); // Slightly inside
        const angle = Math.random() * Math.PI * 2;
        
        const tx = Math.cos(angle) * radiusAtHeight;
        const tz = Math.sin(angle) * radiusAtHeight;
        const ty = y - CONFIG.TREE_HEIGHT / 2;

        data.push({
            treePos: new THREE.Vector3(tx, ty, tz),
            scatterPos: randomInSphere(CONFIG.SCATTER_RADIUS),
            scale: 0.2 + Math.random() * 0.3, // Varied sizes
        });
    }
    return data;
  }, []);

  // -- Star (The topper) --
  const starRef = useRef<THREE.Group>(null);
  const starPos = useMemo(() => ({
      tree: new THREE.Vector3(0, CONFIG.TREE_HEIGHT / 2 + 0.5, 0),
      scatter: randomInSphere(CONFIG.SCATTER_RADIUS)
  }), []);


  // Animation Loop
  useFrame((state, delta) => {
    // Determine target interpolation value (0 = Scattered, 1 = Tree)
    const target = mode === 'TREE_SHAPE' ? 1 : 0;
    
    // Smooth dampening for the global transition state
    if (!needleMeshRef.current || !ornamentMeshRef.current) return;

    // We store the current progress in the userdata of the mesh for convenience
    const mesh = needleMeshRef.current;
    // Initialize progress if undefined. If mode is TREE, we start at 0 to animate IN.
    if (mesh.userData.progress === undefined) mesh.userData.progress = mode === 'TREE_SHAPE' ? 0 : 1; 
    
    // Damp the progress value
    easing.damp(mesh.userData, 'progress', target, CONFIG.TRANSITION_SPEED, delta);
    const t = mesh.userData.progress;

    // Update Needles
    for (let i = 0; i < CONFIG.NEEDLE_COUNT; i++) {
      const d = needleData[i];
      // Lerp Position
      tempPos.lerpVectors(d.scatterPos, d.treePos, t);
      
      // Slerp Rotation
      const qA = new THREE.Quaternion().setFromEuler(d.scatterRot);
      const qB = new THREE.Quaternion().setFromEuler(d.treeRot);
      tempQuat.slerpQuaternions(qA, qB, t);
      
      tempObject.position.copy(tempPos);
      tempObject.quaternion.copy(tempQuat);
      tempObject.scale.setScalar(d.scale);
      tempObject.updateMatrix();
      
      needleMeshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    needleMeshRef.current.instanceMatrix.needsUpdate = true;

    // Update Ornaments
    for (let i = 0; i < CONFIG.ORNAMENT_COUNT; i++) {
        const d = ornamentData[i];
        tempPos.lerpVectors(d.scatterPos, d.treePos, t);
        
        // Ornaments rotate slowly constantly
        const time = state.clock.getElapsedTime();
        tempEuler.set(time * 0.5, time * 0.3, 0);
        tempQuat.setFromEuler(tempEuler);
        
        tempObject.position.copy(tempPos);
        tempObject.quaternion.copy(tempQuat);
        tempObject.scale.setScalar(d.scale);
        tempObject.updateMatrix();

        ornamentMeshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    ornamentMeshRef.current.instanceMatrix.needsUpdate = true;

    // Update Star
    if (starRef.current) {
        starRef.current.position.lerpVectors(starPos.scatter, starPos.tree, t);
        starRef.current.rotation.y += delta * 0.5;
        // Pulse scale
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        starRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Needles: Dark Emerald, rougher */}
      <instancedMesh 
        ref={needleMeshRef} 
        args={[null, null, CONFIG.NEEDLE_COUNT]} 
        castShadow 
        receiveShadow
        frustumCulled={false}
      >
        <coneGeometry args={[0.15, 0.8, 4]} />
        <meshStandardMaterial 
            color={COLORS.EMERALD} 
            roughness={0.7} 
            metalness={0.1}
            emissive={COLORS.DEEP_EMERALD}
            emissiveIntensity={0.2}
        />
      </instancedMesh>

      {/* Ornaments: High Gloss Gold */}
      <instancedMesh 
        ref={ornamentMeshRef} 
        args={[null, null, CONFIG.ORNAMENT_COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
            color={COLORS.GOLD}
            roughness={0.05}
            metalness={1.0}
            envMapIntensity={2}
        />
      </instancedMesh>

      {/* The Topper Star */}
      <group ref={starRef}>
        <mesh>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial 
                color={COLORS.GOLD} 
                emissive={COLORS.GLOW}
                emissiveIntensity={2}
                toneMapped={false}
            />
        </mesh>
        <pointLight color={COLORS.GLOW} intensity={10} distance={10} decay={2} />
      </group>
    </group>
  );
};