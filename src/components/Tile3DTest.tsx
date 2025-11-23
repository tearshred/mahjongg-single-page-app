import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Tile3D from "./Tile3D";

function Tile3DTest() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#2a2a2a' }}>
      <Canvas
        camera={{ 
          position: [8, 12, 8],  // Looking down at an angle (like viewing a board game)
          fov: 50 
        }}
      >
        
        {/* LIGHTS */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 15, 10]} 
          intensity={1.2}
          castShadow
        />
        
        {/* Camera controls - can still rotate to explore */}
        <OrbitControls 
          target={[0, 0, 0]}  // Look at center of board
        />
        
        {/* MAHJONGG TOWER - Proper pyramid stacking */}
        
        {/* LAYER 0 - Bottom layer (6x6 = 36 tiles) */}
        {/* Row 1 */}
        <Tile3D position={[-2.5, 0, -3.75]} />
        <Tile3D position={[-1.5, 0, -3.75]} />
        <Tile3D position={[-0.5, 0, -3.75]} />
        <Tile3D position={[0.5, 0, -3.75]} />
        <Tile3D position={[1.5, 0, -3.75]} />
        <Tile3D position={[2.5, 0, -3.75]} />
        
        {/* Row 2 */}
        <Tile3D position={[-2.5, 0, -2.25]} />
        <Tile3D position={[-1.5, 0, -2.25]} />
        <Tile3D position={[-0.5, 0, -2.25]} />
        <Tile3D position={[0.5, 0, -2.25]} />
        <Tile3D position={[1.5, 0, -2.25]} />
        <Tile3D position={[2.5, 0, -2.25]} />
        
        {/* Row 3 */}
        <Tile3D position={[-2.5, 0, -0.75]} />
        <Tile3D position={[-1.5, 0, -0.75]} />
        <Tile3D position={[-0.5, 0, -0.75]} />
        <Tile3D position={[0.5, 0, -0.75]} />
        <Tile3D position={[1.5, 0, -0.75]} />
        <Tile3D position={[2.5, 0, -0.75]} />
        
        {/* Row 4 */}
        <Tile3D position={[-2.5, 0, 0.75]} />
        <Tile3D position={[-1.5, 0, 0.75]} />
        <Tile3D position={[-0.5, 0, 0.75]} />
        <Tile3D position={[0.5, 0, 0.75]} />
        <Tile3D position={[1.5, 0, 0.75]} />
        <Tile3D position={[2.5, 0, 0.75]} />
        
        {/* Row 5 */}
        <Tile3D position={[-2.5, 0, 2.25]} />
        <Tile3D position={[-1.5, 0, 2.25]} />
        <Tile3D position={[-0.5, 0, 2.25]} />
        <Tile3D position={[0.5, 0, 2.25]} />
        <Tile3D position={[1.5, 0, 2.25]} />
        <Tile3D position={[2.5, 0, 2.25]} />
        
        {/* Row 6 */}
        <Tile3D position={[-2.5, 0, 3.75]} />
        <Tile3D position={[-1.5, 0, 3.75]} />
        <Tile3D position={[-0.5, 0, 3.75]} />
        <Tile3D position={[0.5, 0, 3.75]} />
        <Tile3D position={[1.5, 0, 3.75]} />
        <Tile3D position={[2.5, 0, 3.75]} />
        
        {/* LAYER 1 - Second layer (4x4 = 16 tiles, centered on top) */}
        <Tile3D position={[-1.5, 0.3, -2.25]} />
        <Tile3D position={[-0.5, 0.3, -2.25]} />
        <Tile3D position={[0.5, 0.3, -2.25]} />
        <Tile3D position={[1.5, 0.3, -2.25]} />
        
        <Tile3D position={[-1.5, 0.3, -0.75]} />
        <Tile3D position={[-0.5, 0.3, -0.75]} />
        <Tile3D position={[0.5, 0.3, -0.75]} />
        <Tile3D position={[1.5, 0.3, -0.75]} />
        
        <Tile3D position={[-1.5, 0.3, 0.75]} />
        <Tile3D position={[-0.5, 0.3, 0.75]} />
        <Tile3D position={[0.5, 0.3, 0.75]} />
        <Tile3D position={[1.5, 0.3, 0.75]} />
        
        <Tile3D position={[-1.5, 0.3, 2.25]} />
        <Tile3D position={[-0.5, 0.3, 2.25]} />
        <Tile3D position={[0.5, 0.3, 2.25]} />
        <Tile3D position={[1.5, 0.3, 2.25]} />
        
        {/* LAYER 2 - Third layer (2x2 = 4 tiles) */}
        <Tile3D position={[-0.5, 0.6, -0.75]} />
        <Tile3D position={[0.5, 0.6, -0.75]} />
        <Tile3D position={[-0.5, 0.6, 0.75]} />
        <Tile3D position={[0.5, 0.6, 0.75]} />
        
        {/* LAYER 3 - Top tile (1 tile in center) */}
        <Tile3D position={[0, 0.9, 0]} />
        
        {/* Ground plane - dark surface for tiles to sit on */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        
      </Canvas>
    </div>
  );
}

export default Tile3DTest;