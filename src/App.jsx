// React Three Fiber
import { Canvas } from '@react-three/fiber'

// Drei – pomocné komponenty
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'

// (volitelné) Three.js – pokud potřebuješ materiály, světla, geometrii ručně
import * as THREE from 'three'

function App() {
  const { scene } = useGLTF("/Powerful Wluff-Allis (1).glb"); // cesta relativně ke složce public
  return (
    <Canvas
        shadows
        camera={{ position: [5, 5, 10], fov: 50 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* Slunce */}
        <directionalLight
          position={[10, 15, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Globální světlo */}
        <ambientLight intensity={0.3} />

        {/* Země */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]} // Otočení do roviny XZ
          position={[0, 0, 0]}            // Ve výšce 0
          receiveShadow
        >
          <circleGeometry args={[30, 128]} /> {/* args = [radius, segments] */}
          <meshStandardMaterial color="#57995a" />
        </mesh>


        {/* Kamera ovládání */}
        <OrbitControls
          target={[0, 0, 0]}       // střed rotace
          enablePan={false}        // zakáže posun kamery (pan)
          enableRotate={true}      // povolí otáčení kolem středu
          enableZoom={true}        // povolí přibližování/oddalování
          minDistance={5}          // nejbližší možná vzdálenost kamery
          maxDistance={50}         // nejvzdálenější možná vzdálenost
          maxPolarAngle={Math.PI / 2.1} // zakáže otočení „pod zem“ (pod horizont)
          minPolarAngle={0}              // kamera nikdy nejde pod horizont
        />

        {/* Obloha a světlo z HDR prostředí */}
        <Environment files="/kloofendal_48d_partly_cloudy_puresky_2k.hdr" background  />
        <primitive object={scene} scale={50} />
      </Canvas>
  );
}

export default App;
