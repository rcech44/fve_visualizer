import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { appliances } from "../constants/appliances.jsx";

function Window1({ activeAppliances, handleShowAppliance }) {
  // Výpočet celkové spotřeby zaškrtnutých spotřebičů
  const totalConsumption = Object.values(appliances).reduce(
    (sum, appliance) => {
      if (
        activeAppliances[appliance.technicalName]?.show &&
        appliance.powerConsumption
      ) {
        return sum + appliance.powerConsumption;
      }
      return sum;
    },
    0
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "rgba(255, 255, 255, 0.9)",
        color: "black",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        zIndex: 10,
        minWidth: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
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
              <div style={{ display: "flex", alignItems: "center" }}>
                {appliance.icon}
                <span style={{ marginLeft: "8px" }}>{appliance.name}</span>
              </div>
            }
          />
        ))}
      </FormGroup>
      {/* Výpis celkové spotřeby */}
      <div style={{ marginTop: "10px", fontWeight: "bold" }}>
        Celková spotřeba: {totalConsumption} W
      </div>
    </div>
  );
}

export default Window1;
