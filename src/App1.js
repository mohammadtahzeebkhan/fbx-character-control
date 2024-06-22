import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three'
import { useBox,Physics,Debug } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';

// Function component for your FBX model with physics
function PhysicsFBXModel({ url }) {
  const fbx = useLoader(FBXLoader, url);
  fbx.scale.set(.05, .05, .05);

  // Get geometry information from the loaded FBX model
  const { geometry } = fbx.children[0];


 

  // Create a cannon body with mass and shape
  /* const [ref, api] = useBox(
    () => ({ args: [7, 5, 75], mass: 1,  }),
    useRef()
  ) */

  return (
    <group /* ref={ref} */>
      <primitive object={fbx} />
    </group>
  );
}

// Main component to render the 3D scene
function App() {
  return (
    <Canvas style={{height:"100vh"}}>
      <ambientLight intensity={0.5} />
      <OrbitControls/>
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Physics>
        <Debug color={"Red"}>
        <PhysicsFBXModel url="/character.fbx" />
        </Debug>
      </Physics>
    </Canvas>
  );
}

export default App;
