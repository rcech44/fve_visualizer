import * as THREE from "three";
import KitchenIcon from "@mui/icons-material/Kitchen";
import TvIcon from "@mui/icons-material/Tv";
import OvenIcon from "@mui/icons-material/OutdoorGrill";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SolarPowerIcon from "@mui/icons-material/SolarPower";

export const appliances = {
  fridge: {
    technicalName: "fridge",
    name: "Lednice",
    icon: <KitchenIcon />,
    model: "/fridge.glb",
    position: [-4.3, 0, 7.5],
    scale: 12,
    powerConsumption: 200,
    show: false,
  },
  tv: {
    technicalName: "tv",
    name: "Televize",
    icon: <TvIcon />,
    model: "/tv.glb",
    position: [-17, 0, 2],
    scale: 10,
    rotation: [0, THREE.MathUtils.degToRad(90), 0],
    powerConsumption: 150,
    show: false,
  },
};

export const fve_appliances = {
  boiler: {
    technicalName: "boiler",
    name: "Bojler",
    icon: <LocalFireDepartmentIcon />,
    model: "/boiler.glb",
    position: [10.3, 0, -22],
    scale: 12,
    rotation: [0, THREE.MathUtils.degToRad(90), 0],
    show: false,
  },
  carCharger: {
    technicalName: "carCharger",
    name: "Autonabíječka",
    icon: <LocalFireDepartmentIcon />,
    model: "/car_charger.glb",
    position: [0, 2, 20],
    scale: 12,
    rotation: [0, THREE.MathUtils.degToRad(90), 0],
    show: true,
  },
  solarPanelsWest: {
    technicalName: "solarPanelsWest",
    name: "Panely na západ",
    icon: <SolarPowerIcon />,
    model: "/solar_panels.glb",
    position: [9.5, 10.3, 0.9],
    scale: 12,
    rotation: [
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(-33),
    ],
    show: true,
  },
  solarPanelsEast: {
    technicalName: "solarPanelsEast",
    name: "Panely na východ",
    icon: <SolarPowerIcon />,
    model: "/solar_panels.glb",
    position: [1.5, 11, 0.9],
    scale: 12,
    rotation: [
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(0),
      THREE.MathUtils.degToRad(33),
    ],
    show: true,
  },
};
