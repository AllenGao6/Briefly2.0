import React from "react";
import Particles from "react-particles-js";
import ParticleConfig from "../config/particle-config";

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: -10,
      }}
    >
      <Particles params={ParticleConfig}></Particles>;
    </div>
  );
}
