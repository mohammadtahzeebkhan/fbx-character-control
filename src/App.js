import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls} from "@react-three/drei";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import Character from "./Character1";
import { Debug, Physics } from "@react-three/cannon";
import Ground from "./Collider/Ground";
import Question from "./UI/Question";

import {   Html, Text as DreiText, Loader } from '@react-three/drei';


function Hall() {
  const { scene } = useGLTF('./hallwb.glb', true);  // Use true to automatically resolve the scene

  return (
    <>
      {scene && (
        <primitive object={scene} />
      )}
    </>
  );
}


function App() {
  
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);

  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 1000.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(25, 10, 25);
 // camera.autoRotate=true
 const light = new THREE.DirectionalLight(0xffffff, 1.0);
 light.position.set(-100, 100, 100);
 light.target.position.set(0, 0, 0);
 light.castShadow = true;
 light.shadow.bias = -0.001;
 light.shadow.mapSize.width = 4096;
 light.shadow.mapSize.height = 4096;
 light.shadow.camera.near = 0.1;
 light.shadow.camera.far = 500.0;
 light.shadow.camera.near = 0.5;
 light.shadow.camera.far = 500.0;
 light.shadow.camera.left = 50;
 light.shadow.camera.right = -50;
 light.shadow.camera.top = 50;
 light.shadow.camera.bottom = -50;

 


  return (
    <div className="w-full h-screen bg-fuchsia-100">
      <Canvas shadows   camera={camera}  style={{height:"100vh"}} >
   
      <hemisphereLight {...hemiLight} />/
      <directionalLight {...light} />
        <ambientLight intensity={2} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Hall />
          
                    <perspectiveCamera {...camera} /> 
                    <Physics>
                      <Debug color={"red"}>
                        <Ground rotation={[-Math.PI / 2, 0, 0]}/>
            <Character camera={camera}  /> 
                      </Debug>
          </Physics>
    
        </Suspense>
        <DreiText position={[3.5, 2, -11]} rotation={[0, 0, 0]} fontSize={1} bevelEnabled bevelThickness={1} bevelSize={2}>
<Question/>
</DreiText>

      </Canvas>

  
  
    
  
    </div>
  );
}

export default App;
