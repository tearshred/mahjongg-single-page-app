import { useRef } from "react";
import * as THREE from "three";

interface Tile3DProps {
  position?: [number, number, number];
}

function Tile3D({ position = [0, 0, 0] }: Tile3DProps) {
  const boxGeometry = useRef<THREE.BoxGeometry>(null);
  
  return (
    <group position={position}>
      <mesh>
        <boxGeometry ref={boxGeometry} args={[1, 0.3, 1.5]}/>
        {/* Each side gets its own color for depth */}
        <meshStandardMaterial attach="material-0" color="#e8e8e8" /> {/* Right */}
        <meshStandardMaterial attach="material-1" color="#d0d0d0" /> {/* Left */}
        <meshStandardMaterial attach="material-2" color="#f5f5f5" /> {/* Top - slightly off-white */}
        <meshStandardMaterial attach="material-3" color="#b8b8b8" /> {/* Bottom */}
        <meshStandardMaterial attach="material-4" color="#e0e0e0" /> {/* Front */}
        <meshStandardMaterial attach="material-5" color="#d8d8d8" /> {/* Back */}
      </mesh>
      
      {/* Dark outline edges */}
      <lineSegments>
        <edgesGeometry args={[boxGeometry.current]} />
        <lineBasicMaterial color="#333333" linewidth={2} />
      </lineSegments>
    </group>
  );
}

export default Tile3D;