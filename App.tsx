import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-[#000500]">
      <UI />
      
      <Canvas
        shadows
        dpr={[1, 2]} // Quality scaling
        camera={{ position: [0, 0, 25], fov: 45 }}
        gl={{ antialias: false, toneMappingExposure: 1.2 }} // Antialias off for post-processing performance
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      
      <Loader 
        containerStyles={{ background: '#000500' }}
        innerStyles={{ width: '200px', background: '#022112' }}
        barStyles={{ background: '#C5A059', height: '2px' }}
        dataStyles={{ fontFamily: 'Cinzel', color: '#C5A059' }}
      />
    </div>
  );
};

export default App;