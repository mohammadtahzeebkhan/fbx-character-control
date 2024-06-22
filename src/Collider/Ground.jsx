import { usePlane } from "@react-three/cannon";
import { useRef } from "react";
export default function Ground(props) {
    const [ref] = usePlane(() => ({ args: [1, 1, 1], mass: 0, ...props }), useRef())
  
  }
  
 