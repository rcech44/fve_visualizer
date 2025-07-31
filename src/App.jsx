// React Three Fiber
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useState, useEffect, useMemo, useRef } from 'react';
import React from 'react';

// Drei – pomocné komponenty
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import CircularSlider from '@fseehawer/react-circular-slider';

// (volitelné) Three.js – pokud potřebuješ materiály, světla, geometrii ručně
import * as THREE from 'three'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import OvenIcon from '@mui/icons-material/OutdoorGrill';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SolarPowerIcon from '@mui/icons-material/SolarPower';

const appliances = {
  fridge: { technicalName: 'fridge', name: 'Lednice', icon: <KitchenIcon />, model: '/fridge.glb', position: [-4.3, 0, 7.5], scale: 12, powerConsumption: 200, show: false },
  tv: { technicalName: 'tv', name: 'Televize', icon: <TvIcon />, model: '/tv.glb', position: [-17, 0, 2], scale: 10, rotation: [0, THREE.MathUtils.degToRad(90), 0], powerConsumption: 150, show: false },
}

const fve_appliances = {
  boiler: { technicalName: 'boiler', name: 'Bojler', icon: <LocalFireDepartmentIcon />, model: '/boiler.glb', position: [10.3, 0, -22], scale: 12, rotation: [0, THREE.MathUtils.degToRad(90), 0], show: false },
  carCharger: { technicalName: 'carCharger', name: 'Autonabíječka', icon: <LocalFireDepartmentIcon />, model: '/car_charger.glb', position: [0, 2, 20], scale: 12, rotation: [0, THREE.MathUtils.degToRad(90), 0], show: true },
  solarPanelsWest: { technicalName: 'solarPanelsWest', name: 'Panely na západ', icon: <SolarPowerIcon />, model: '/solar_panels.glb', position: [9.5, 10.3, 0.9], scale: 12, rotation: [THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-33)], show: true },
  solarPanelsEast: { technicalName: 'solarPanelsEast', name: 'Panely na východ', icon: <SolarPowerIcon />, model: '/solar_panels.glb', position: [1.5, 11, 0.9], scale: 12, rotation: [THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(33)], show: true },
}

function App() {
  const [activeAppliances, setActiveAppliances] = useState(appliances);
  const [activeFveAppliances, setActiveFveAppliances] = useState(fve_appliances);
  const { scene: house } = useGLTF("/ver2.glb"); // cesta relativně ke složce public
  const { scene: small_house } = useGLTF("/small_house.glb"); // cesta relativně ke složce public
  const { scene: garage } = useGLTF("/garage.glb"); // cesta relativně ke složce public
  const { scene: tree } = useGLTF("/tree.glb"); // cesta relativně ke složce public
  const { scene: bush } = useGLTF("/bush.glb"); // cesta relativně ke složce public
  const [timeMinutes, setTimeMinutes] = useState(-100) // výchozí: 12:00

  function enableShadows(object) {
    object.traverse((child) => {
      if ((child).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  function handleShowAppliance(applianceKey) {
    setActiveAppliances((prevState) => ({
      ...prevState,
      [applianceKey]: {
        ...prevState[applianceKey],
        show: !prevState[applianceKey].show,
      },
    }));
  }

  function handleShowFVEAppliance(applianceKey) {
    setActiveFveAppliances((prevState) => ({
      ...prevState,
      [applianceKey]: {
        ...prevState[applianceKey],
        show: !prevState[applianceKey].show,
      },
    }));
  }

  function Car1Instance() {
    const { scene } = useGLTF('/car.glb');
    const meshRef = useRef();
    const headlightLeftRef = useRef();
    const headlightRightRef = useRef();
  
    const car = useMemo(() => {
      const c = scene.clone(true);
      enableShadows(c);
      return c;
    }, [scene]);
  
    const startZ = -200;
    const endZ = 200;
    const duration = 10; // v sekundách
    const speed = (endZ - startZ) / duration; // jednotek za sekundu
  
    const [elapsed, setElapsed] = useState(0);
  
    useFrame((_, delta) => {
      setElapsed((prev) => {
        const next = prev + delta;
        const looped = next >= duration ? 0 : next;
        const z = startZ + looped * speed;
  
        if (meshRef.current) {
          meshRef.current.position.set(63, 0, z);
        }
  
        // Aktualizace pozice světlometů
        if (headlightLeftRef.current) {
          headlightLeftRef.current.position.set(58, 3, z-2);
          headlightLeftRef.current.target.position.set(58, 3, z + 10);
          headlightLeftRef.current.target.updateMatrixWorld();
        }

        if (headlightRightRef.current) {
          headlightRightRef.current.position.set(62, 3, z-2);
          headlightRightRef.current.target.position.set(62, 3, z + 10);
          headlightRightRef.current.target.updateMatrixWorld();
        }

        return looped;
      });
    });
  
    return (
      <>
      <primitive ref={meshRef} object={car} scale={40} />

      {/* Levý světlomet */}
      <spotLight
        ref={headlightLeftRef}
        angle={0.3}
        intensity={200}
        distance={50}
        penumbra={0.5}
        castShadow
        color="#ffffff"
      />

      {/* Pravý světlomet */}
      <spotLight
        ref={headlightRightRef}
        angle={0.3}
        intensity={200}
        distance={50}
        penumbra={0.5}
        castShadow
        color="#ffffff"
      />
    </>
    );
  }

  // function Car2Instance() {
  //   const { scene } = useGLTF('/car.glb');
  //   const meshRef = useRef();
  //   const headlightLeftRef = useRef();
  //   const headlightRightRef = useRef();
  
  //   const car = useMemo(() => {
  //     const c = scene.clone(true);
  //     enableShadows(c);
  //     return c;
  //   }, [scene]);
  
  //   const startZ = 200;
  //   const endZ = -200;
  //   const duration = 10; // v sekundách
  //   const speed = (endZ - startZ) / duration; // jednotek za sekundu
  
  //   const [elapsed, setElapsed] = useState(0);
  
  //   useFrame((_, delta) => {
  //     setElapsed((prev) => {
  //       const next = prev + delta;
  //       const looped = next >= duration ? 0 : next;
  //       const z = startZ + looped * speed;
  
  //       if (meshRef.current) {
  //         meshRef.current.position.set(66, 0, z);
  //       }
  
  //       // Aktualizace pozice světlometů
  //       if (headlightLeftRef.current) {
  //         headlightLeftRef.current.position.set(67, 3, z+15);
  //         headlightLeftRef.current.target.position.set(67, 3, z-10);
  //         headlightLeftRef.current.target.updateMatrixWorld();
  //       }

  //       if (headlightRightRef.current) {
  //         headlightRightRef.current.position.set(72, 3, z+5);
  //         headlightRightRef.current.target.position.set(72, 3, z-10);
  //         headlightRightRef.current.target.updateMatrixWorld();
  //       }

  //       return looped;
  //     });
  //   });
  
  //   return (
  //     <>
  //     <primitive ref={meshRef} object={car} scale={40} rotation={[0,THREE.MathUtils.degToRad(180),0]} />

  //     {/* Levý světlomet */}
  //     <spotLight
  //       ref={headlightLeftRef}
  //       angle={0.3}
  //       intensity={200}
  //       distance={50}
  //       penumbra={0.5}
  //       castShadow
  //       color="#ffffff"
  //     />

  //     {/* Pravý světlomet */}
  //     <spotLight
  //       ref={headlightRightRef}
  //       angle={0.3}
  //       intensity={200}
  //       distance={50}
  //       penumbra={0.5}
  //       castShadow
  //       color="#ffffff"
  //     />
  //   </>
  //   );
  // }
  
  function RoadInstance({ position = [0, 0, 0], scale = 10, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/road.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      // enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function PathInstance({ position = [0, 0, 0], scale = 10, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/path.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      // enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function TreeInstance({ position = [0, 0, 0], scale = 10, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/tree.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function LampInstance({ position = [0, 0, 0], scale = 10, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/lamp.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function SmallHouseInstance({ position = [0, 0, 0], scale = 50, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/small_house.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function HouseInstance({ position = [0, 0, 0], scale = 50, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/house.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function GarageInstance({ position = [0, 0, 0], scale = 50, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/garage.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function BushInstance({ position = [0, 0, 0], scale = 10, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF('/bush.glb')
  
    const clone = useMemo(() => {
      const c = scene.clone(true)
      enableShadows(c)
      return c
    }, [scene])
  
    return (
      <primitive
        object={clone}
        position={position}
        scale={[scale, scale, scale]}
        rotation={rotation}
      />
    )
  }

  function AnimatedSun({ timeInMinutes }) {
    const lightRef = useRef()
    const ambientRef = useRef()
    const sunModelRef = useRef()
    const lampLightRef = useRef()
    const lampLightRef2 = useRef()
    const lampLightRef3 = useRef()
    const lampLightRef4 = useRef()
    const lampLightRef5 = useRef()
    const lampLightRef6 = useRef()
    const lampLightRef7 = useRef()
    const lampLightRef8 = useRef()
    const { gl } = useThree()
  
    const { scene } = useGLTF('sun.glb')
  
    const sun = useMemo(() => {
      const s = scene.clone(true)
      s.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false
          child.receiveShadow = false
          child.frustumCulled = false
          child.material = child.material.clone()
          child.material.emissive = new THREE.Color('#ffff99')
          child.material.emissiveIntensity = 2
          child.material.toneMapped = false
        }
      })
      return s
    }, [scene])
  
    useFrame(() => {
      const cycleDuration = 1440 // minutes
      const progress = (timeInMinutes % cycleDuration) / cycleDuration
      const angle = progress * 2 * Math.PI
      const radius = 100
  
      const x = Math.cos(angle) * radius * -1
      const y = Math.sin(angle) * radius
      const dayFactor = Math.max(0, y / radius)
  
      if (lightRef.current) {
        lightRef.current.position.set(x, y, 0)
        lightRef.current.target.position.set(0, 0, 0)
        lightRef.current.target.updateMatrixWorld()
        lightRef.current.intensity = dayFactor > 0 ? 2 : 0
      }
  
      if (ambientRef.current) {
        ambientRef.current.intensity = 0.2 + 0.5 * dayFactor
      }
  
      if (sunModelRef.current) {
        sunModelRef.current.position.set(x*10, y*10, 0)
        sunModelRef.current.rotation.y += 0.01
        sunModelRef.current.visible = true
      }
  
      const dayColor = new THREE.Color('#87ceeb')
      const nightColor = new THREE.Color('#0a0a1a')
      const backgroundColor = dayColor.clone().lerp(nightColor, 1 - dayFactor)
      gl.setClearColor(backgroundColor, 1)
  
      if (lampLightRef.current) {
        lampLightRef.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef2.current) {
        lampLightRef2.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef3.current) {
        lampLightRef3.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef4.current) {
        lampLightRef4.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef5.current) {
        lampLightRef5.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef6.current) {
        lampLightRef6.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef7.current) {
        lampLightRef7.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
      if (lampLightRef8.current) {
        lampLightRef8.current.intensity = dayFactor < 0.1 ? 300 : 0
      }
    })
  
    return (
      <>
        <ambientLight ref={ambientRef} intensity={0.5} />
        <directionalLight
          ref={lightRef}
          castShadow
          intensity={2}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={200}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
        />
        <primitive ref={sunModelRef} object={sun} scale={500} />
        <pointLight ref={lampLightRef} position={[20, 9, 10]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef2} position={[20, 9, -6]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef3} position={[52, 9, -6]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef4} position={[52, 9, 10]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef5} position={[52, 9, 50]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef6} position={[52, 9, -46]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef7} position={[-15, 10, 0]} distance={30} color="#ffcc99" />
        <pointLight ref={lampLightRef8} position={[0, 10, 17]} distance={30} color="#ffcc99" />
      </>
    )
  }

  function Window1()
  {
    // Výpočet celkové spotřeby zaškrtnutých spotřebičů
    const totalConsumption = Object.values(appliances).reduce((sum, appliance) => {
      if (activeAppliances[appliance.technicalName]?.show && appliance.powerConsumption) {
        return sum + appliance.powerConsumption;
      }
      return sum;
    }, 0);

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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
      >
      <h2>Spotřebiče</h2>
      <FormGroup>
        {Object.entries(appliances).map(([key, appliance]) => (
        <FormControlLabel
          key={key}
          control={
          <Checkbox
            name={key}
            onChange={() => handleShowAppliance(appliance.technicalName)}
            checked={activeAppliances[key]?.show || false}
          />
          }
          label={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {appliance.icon}
            <span style={{ marginLeft: '8px' }}>{appliance.name}</span>
          </div>
          }
        />
        ))}
      </FormGroup>
      {/* Výpis celkové spotřeby */}
      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
        Celková spotřeba: {totalConsumption} W
      </div>
      </div>
    );
  }
  
  function Window2({ timeInMinutes, activeFveAppliances }) {
    const maxPower = 4000;
    let percentWest = 0;
    let percentEast = 0;
  
    if (activeFveAppliances.solarPanelsWest?.show ) {
      if (timeInMinutes < 0 || timeInMinutes > 720) {
        percentWest = 0;
      } else if (timeInMinutes >= 240 && timeInMinutes <= 480) {
        percentWest = 1.0;
      } else if (timeInMinutes < 240) {
        // Pomalý náběh (ráno – západní panely „ospalé“)
        // Plný výkon dosažený až kolem 480 minut (původně 240)
        percentWest = 0.05 + (timeInMinutes / 480) * (1.0 - 0.05);
      } else if (timeInMinutes > 480 && timeInMinutes <= 720) {
        // Rychlejší pokles večer
        percentWest = 0.05 + ((720 - timeInMinutes) / 240) * (1.0 - 0.05);
      }
    }

    if (activeFveAppliances.solarPanelsEast?.show ) {
      if (timeInMinutes < 0 || timeInMinutes > 720) {
        percentEast = 0;
      } else if (timeInMinutes >= 0 && timeInMinutes <= 240) {
        // Rychlý náběh – východní orientace
        percentEast = 0.05 + (timeInMinutes / 240) * (1.0 - 0.05);
      } else if (timeInMinutes > 240 && timeInMinutes <= 480) {
        // Poledne – stále 100 %
        percentEast = 1.0;
      } else if (timeInMinutes > 480 && timeInMinutes <= 720) {
        // Pomalý pokles – západní slunce už tolik nevyužijeme
        percentEast = 0.05 + ((720 - timeInMinutes) / 480) * (1.0 - 0.05);
      }
    }
  
    const solarOutputWattsWest = Math.round(percentWest * maxPower);
    const solarOutputWattsEast = Math.round(percentEast * maxPower);
  
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h2>FVE</h2>
        <FormGroup>
          {Object.entries(fve_appliances).map(([key, appliance]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  name={key}
                  onChange={() => handleShowFVEAppliance(appliance.technicalName)}
                  checked={activeFveAppliances[key]?.show || false}
                />
              }
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {appliance.icon}
                  <span style={{ marginLeft: '8px' }}>{appliance.name}</span>
                </div>
              }
            />
          ))}
        </FormGroup>
        <hr style={{ width: '100%' }} />
        <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
          Výkon panelů na západ: {solarOutputWattsWest} W
          <br></br>
          Výkon panelů na východ: {solarOutputWattsEast} W
        </div>
      </div>
    );
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

  return (
    <>
    <Window1 />
    <Window2 timeInMinutes={timeMinutes} activeFveAppliances={activeFveAppliances}/>
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
    minWidth: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 9999,
    pointerEvents: 'auto',
  }}
>
  {/* <label>Časová pozice: {timeMinutes} minut</label> */}

  <input
    type="range"
    min={-200}
    max={900}
    value={timeMinutes}
    step={10}
    onChange={(e) => setTimeMinutes(parseInt(e.target.value))}
    style={{ width: '100%', marginTop: '10px' }}
  />

  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '0.8rem',
    marginTop: '4px'
  }}>
    <span>🌙 Východ</span>
    <span>☀️ Den</span>
    <span>🌙 Západ</span>
  </div>
</div>

    {/* <Window4 /> */}
    <Canvas
        shadows
        camera={{ position: [5, 5, 10], fov: 50 }}
        style={{ width: "100vw", height: "100vh", zIndex: 0 }}
      >

        <AnimatedSun timeInMinutes={timeMinutes} />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]} // Otočení do roviny XZ
          position={[0, -0.05, 0]}            // Ve výšce 0
          receiveShadow
        >
          <circleGeometry args={[10000, 128]} /> {/* args = [radius, segments] */}
          <meshStandardMaterial color="#315732" />
        </mesh>

        {/* Kamera ovládání */}
        <OrbitControls
          target={[0, 0, 0]}       // střed rotace
          enablePan={false}        // zakáže posun kamery (pan)
          enableRotate={true}      // povolí otáčení kolem středu
          enableZoom={true}        // povolí přibližování/oddalování
          minDistance={40}          // nejbližší možná vzdálenost kamery
          maxDistance={110}         // nejvzdálenější možná vzdálenost
          maxPolarAngle={Math.PI / 2.1} // zakáže otočení „pod zem“ (pod horizont)
          minPolarAngle={0}              // kamera nikdy nejde pod horizont
        />

        {Object.values(activeAppliances).map((appliance, index) => (
          appliance.show && (
            <primitive
              key={index}
              object={useGLTF(appliance.model).scene}
              position={appliance.position}
              scale={[appliance.scale, appliance.scale, appliance.scale]}
              rotation={appliance.rotation ? appliance.rotation : [0, 0, 0]}
              castShadow
              receiveShadow
            />
          )
        ))}

        {Object.values(activeFveAppliances).map((appliance, index) => (
          appliance.show && (
            <primitive
              key={index}
              object={useGLTF(appliance.model).scene.clone()}
              position={appliance.position}
              scale={[appliance.scale, appliance.scale, appliance.scale]}
              rotation={appliance.rotation ? appliance.rotation : [0, 0, 0]}
              castShadow
              receiveShadow
            />
          )
        ))}

        {/* Obloha a světlo z HDR prostředí */}
        {/* <Environment files="/kloofendal_48d_partly_cloudy_puresky_2k.hdr" background  /> */}

        <HouseInstance position={[10, 0, 10]} />
        <SmallHouseInstance position={[10, 0, -15]} />
        <GarageInstance position={[11, 0, 30]} />
        <RoadInstance position={[80, -0.8, 30]} scale={120} />
        <RoadInstance position={[80, -0.8, -210]} scale={120} />
        <RoadInstance position={[80, -0.8, 260]} scale={120} />
        <PathInstance position={[34, 0, 2]} scale={16.5} />

        <TreeInstance position={[40, 0, 30]} />
        {/* <TreeInstance position={[55, 0, 10]} /> */}
        <TreeInstance position={[-20, 0, -30]} />
        <TreeInstance position={[0, 0, 60]} />     
        <TreeInstance position={[0, 0, -70]} />    
        <TreeInstance position={[-70, 0, 0]} />   
        {/* <TreeInstance position={[70, 0, 0]} />     */}
        <TreeInstance position={[-50, 0, 50]} />  
        <TreeInstance position={[-60, 0, -60]} /> 
        {/* <TreeInstance position={[60, 0, 60]} />    */}
        {/* <TreeInstance position={[50, 0, -50]} />   */}
        <TreeInstance position={[0, 0, -60]} />   
        <TreeInstance position={[0, 0, 65]} /> 
        {/* <TreeInstance position={[68, 0, -52]} /> */}
        <TreeInstance position={[-78, 0, -22]} />
        <TreeInstance position={[32, 0, 12]} />
        <TreeInstance position={[-60, 0, 48]} />
        <TreeInstance position={[48, 0, 65]} />
        <TreeInstance position={[0, 0, -75]} />
        <TreeInstance position={[-45, 0, -65]} />
        {/* <TreeInstance position={[78, 0, 5]} /> */}
        <TreeInstance position={[24, 0, -58]} />
        <TreeInstance position={[-65, 0, 22]} />

        <BushInstance position={[-70, 0, -10]} />
        <BushInstance position={[35, 0, -60]} />
        {/* <BushInstance position={[60, 0, 40]} /> */}
        <BushInstance position={[-60, 0, 65]} />
        <BushInstance position={[-30, 0, -50]} />
        <BushInstance position={[22, 0, 60]} />
        {/* <BushInstance position={[65, 0, -35]} /> */}
        <BushInstance position={[-65, 0, 25]} />
        {/* <BushInstance position={[55, 0, 55]} /> */}
        <BushInstance position={[0, 0, -65]} />
        <BushInstance position={[45, 0, -60]} />
        <BushInstance position={[-70, 0, -35]} />
        {/* <BushInstance position={[65, 0, 65]} /> */}
        <BushInstance position={[-80, 0, 40]} />
        {/* <BushInstance position={[55, 0, -15]} /> */}
        <BushInstance position={[30, 0, -70]} />
        <BushInstance position={[-60, 0, 60]} />
        <BushInstance position={[22, 0, 50]} />
        {/* <BushInstance position={[75, 0, -50]} /> */}
        <BushInstance position={[-40, 0, 20]} />
        <BushInstance position={[0, 0, -80]} />
        <BushInstance position={[40, 0, 55]} />
        <BushInstance position={[-55, 0, -60]} />
        {/* <BushInstance position={[80, 0, 5]} /> */}
        <BushInstance position={[-30, 0, -45]} />
        {/* <BushInstance position={[60, 0, -65]} /> */}
        <BushInstance position={[-60, 0, 5]} />
        <BushInstance position={[35, 0, 40]} />
        <BushInstance position={[-65, 0, -20]} />
        <BushInstance position={[25, 0, -55]} />

        <LampInstance position={[20, 0, 10]} />
        <LampInstance position={[20, 0, -6]} />
        <LampInstance position={[52, 0, -6]} />
        <LampInstance position={[52, 0, 10]} />
        <LampInstance position={[52, 0, 50]} />
        <LampInstance position={[52, 0, -46]} />

        <Car1Instance />
        {/* <Car2Instance /> */}

    </Canvas>
    </>
  );
}

export default App;
