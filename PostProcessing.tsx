import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';

export const PostProcessing: React.FC = () => {
  return (
    <EffectComposer enableNormalPass={false}>
      {/* High-end luxury glow - Threshold tuned to pick up only bright metallics and lights */}
      <Bloom 
        luminanceThreshold={1.0} 
        luminanceSmoothing={0.3} 
        height={300} 
        opacity={1.5} 
        intensity={1.5}
      />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={0.6} />
    </EffectComposer>
  );
};