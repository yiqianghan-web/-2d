import React from 'react';
import { OrbitControls, Environment, Float, Stars, Sparkles } from '@react-three/drei';
import { ChristmasTree } from './ChristmasTree';
import { PostProcessing } from './PostProcessing';
import { COLORS } from '../constants';

export const Experience: React.FC = () => {
  return (
    <>
      {/* Camera & Controls */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={40}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {/* Environment & Lighting */}
      <color attach="background" args={['#000500']} />
      
      {/* HDRI for gold reflections */}
      <Environment preset="city" />
      
      <ambientLight intensity={0.2} />
      
      {/* Dramatic Spotlights */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={1} 
        intensity={200} 
        color={COLORS.GOLD} 
        castShadow 
      />
      <spotLight 
        position={[-10, 5, -10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={100} 
        color="#ffffff" 
      />
      
      {/* Backlight for silhouette */}
      <pointLight position={[0, 5, -10]} intensity={50} color={COLORS.EMERALD} />

      {/* The Tree Logic */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <ChristmasTree />
      </Float>

      {/* Magic Particles */}
      <Sparkles count={200} scale={20} size={4} speed={0.4} opacity={0.5} color={COLORS.GOLD} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Post Processing */}
      <PostProcessing />
    </>
  );
};