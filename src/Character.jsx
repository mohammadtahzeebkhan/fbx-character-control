
import { useGLTF, Html, useAnimations, PerspectiveCamera } from '@react-three/drei';
import { useCallback, useEffect, useRef } from 'react';
import { useCompoundBody } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
let cam;

let currAction;

const Character = ({camera}) => {

  const activeAnimation= {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
  dance: false,
};


let prevAction;

  const currentPosition = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3();
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
  const acceleration = new THREE.Vector3(1, 0.125, 100.0);
  const velocity = new THREE.Vector3(0, 0, 0);
    
    const { scene, animations } = useGLTF('/SM.glb');

    console.log("animations",animations)
const ref = useRef();


useEffect(()=>{
 console.log("actions",actions)
 actions.Walking.play()
 
},[])

//console.log("currect ",currAction)
//console.log("actions",character&&character.current.quaternion)
// Physics body setup
const [character, api] = useCompoundBody(() => ({
  mass: 10,
 ref:ref,
  shapes: [
    { args: [0.35], position: [0, 0.30, 0], type: 'Sphere' },
    { args: [0.35], position: [0, 0.80, 0], type: 'Sphere' },
    { args: [0.35], position: [0, 1.30, 0], type: 'Sphere' }
  ],
}));

const { actions } = useAnimations(animations, ref);


const calculateIdealOffset = () => {
  const idealOffset = new THREE.Vector3(0, 2, -3);
  idealOffset.applyQuaternion(character.current.quaternion);
  idealOffset.add(character.current.position);
  return idealOffset;
};


const calculateIdealLookat = () => {
  const idealLookat = new THREE.Vector3(0, 1, 5);
  idealLookat.applyQuaternion(character.current.quaternion);
  idealLookat.add(character.current.position);
  return idealLookat;
};



function updateCameraTarget(delta) {
  const idealOffset = calculateIdealOffset();
  const idealLookat = calculateIdealLookat();

  const t = 1.0 - Math.pow(0.001, delta);

  currentPosition.lerp(idealOffset, t);
  currentLookAt.lerp(idealLookat, t);

  camera.position.copy(currentPosition);
}



  // movement
  const characterState = (delta) => {
    const newVelocity = velocity;
    const frameDecceleration = new THREE.Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

    newVelocity.add(frameDecceleration);

    const controlObject = character.current;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();
    if (activeAnimation.run) {
      acc.multiplyScalar(2.0);
    }

    if (currAction ===actions.idle) {
      acc.multiplyScalar(0.0);
    }

    if (activeAnimation.forward) {
      newVelocity.z += 5 * delta;
    }
    if (activeAnimation.backward) {
      newVelocity.z -= 5 * delta;
    }
    if (activeAnimation.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 1.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (activeAnimation.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 2.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(newVelocity.x * delta);
    forward.multiplyScalar(newVelocity.z * delta);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    character.current.position.copy(controlObject.position);
    updateCameraTarget(delta);
  };



  // Controll Input
  const handleKeyPress = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = true;

        break;

      case 65: //a
        activeAnimation.left = true;

        break;

      case 83: //s
        activeAnimation.backward = true;

        break;

      case 68: // d
        activeAnimation.right = true;

        break;

      case 69: //e dance
        activeAnimation.dance = true;

        break;
      case 16: // shift
        activeAnimation.run = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = false;
        break;

      case 65: //a
        activeAnimation.left = false;
        break;

      case 83: //s
        activeAnimation.backward = false;
        break;

      case 68: // d
        activeAnimation.right = false;
        break;

      case 69: //e dance
        activeAnimation.dance = false;
        break;

      case 16: // shift
        activeAnimation.run = false;
        break;
    }
  }, []);


  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    document.addEventListener("keyup", handleKeyUp);
    //currAction.play();
    return () => {
      document.removeEventListener("keydown", handleKeyPress);

      document.removeEventListener("keyup", handleKeyUp);
    };
  });


    // Animation and movement logic
    useFrame((state, delta) => {
      //cam=camera
      //
      console.log("currAction",currAction)
      if(currAction){
        currAction.play();
      }
      characterState(delta);
    // Always play Idle animation
    });
    

return(
    <>
{/*      {scene && (
        <primitive
          object={scene}
         
          ref={(node) => {
            //ref.current = node; // Assign to physics ref
            character.current = node; // Assign to animation ref
          }}
          
        />

      

        
      )} */}
      <primitive  ref={ref} object={scene}/>
      
      
      </>
)

}
export default Character;
