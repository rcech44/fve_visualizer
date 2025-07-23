// React Three Fiber
import { Canvas } from '@react-three/fiber'

// Drei – pomocné komponenty
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'

// (volitelné) Three.js – pokud potřebuješ materiály, světla, geometrii ručně
import * as THREE from 'three'

function Window1()
{
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        color: 'black',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 10,
        minWidth: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h2>Spotřebiče</h2>
    </div>
  )
}

function Window2()
{
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        color: 'black',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 10,
        minWidth: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h2>Nastavení</h2>
    </div>
  )
}

function Window3()
{
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        color: 'black',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 10,
        minWidth: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h2>Další</h2>
    </div>
  )
}

function Window4()
{
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        color: 'black',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 10,
        minWidth: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h2>Graf</h2>
    </div>
  )
}

function App() {
  const { scene } = useGLTF("/ver2.glb"); // cesta relativně ke složce public
  return (
    <>
    <Window1 />
    <Window2 />
    <Window3 />
    <Window4 />
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
          <circleGeometry args={[40, 128]} /> {/* args = [radius, segments] */}
          <meshStandardMaterial color="#57995a" />
        </mesh>


        {/* Kamera ovládání */}
        <OrbitControls
          target={[0, 0, 0]}       // střed rotace
          enablePan={false}        // zakáže posun kamery (pan)
          enableRotate={true}      // povolí otáčení kolem středu
          enableZoom={true}        // povolí přibližování/oddalování
          minDistance={40}          // nejbližší možná vzdálenost kamery
          maxDistance={70}         // nejvzdálenější možná vzdálenost
          maxPolarAngle={Math.PI / 2.1} // zakáže otočení „pod zem“ (pod horizont)
          minPolarAngle={0}              // kamera nikdy nejde pod horizont
        />

        {/* Obloha a světlo z HDR prostředí */}
        <Environment files="/kloofendal_48d_partly_cloudy_puresky_2k.hdr" background  />
        <primitive object={scene} scale={50} position={[10, 0, 10]} />
    </Canvas>
    </>
  );
}

export default App;
