const top = [{ top: "25%" }, { top: "-25%" }];
const left = [{ left: "25%" }, { left: "-25%" }];
const right = [{ right: "25%" }, { right: "-25%" }];
const bottom = [{ bottom: "25%" }, { bottom: "-25%" }];

const topLeft = [
  { left: "25%", top: "25%" },
  { left: "-25%", top: "-25%" },
];

const topRight = [
  { right: "25%", top: "25%" },
  { right: "-25%", top: "-25%" },
];

const bottomLeft = [
  { left: "25%", bottom: "25%" },
  { left: "-25%", bottom: "-25%" },
];

const bottomRight = [
  { right: "25%", bottom: "25%" },
  { right: "-25%", bottom: "-25%" },
];

const directions = [
  top,
  topRight,
  right,
  bottomRight,
  bottom,
  bottomLeft,
  left,
  topLeft,
];

const palette = [
  {
    width: "25%",
    height: "25%",
    backgroundColor: "red",
  },
  {
    width: "15%",
    height: "15%",
    backgroundColor: "transparent",
  },
];

const timing = {
  duration: 300,
  iterations: 1,
};

function Effect() {
  const effect = document.createElement("div");

  effect.style.width = "100%";
  effect.style.height = "100%";
  effect.style.display = "grid";
  effect.style.position = "absolute";
  effect.style.placeItems = "center";

  directions.forEach((direction) => effect.appendChild(Particle(direction)));
  return effect;
}

function Particle(offset) {
  const particle = document.createElement("div");

  particle.style.width = "25%";
  particle.style.height = "50%";
  particle.style.position = "absolute";
  particle.style.borderRadius = "100%";

  particle.animate(palette, timing);
  particle.animate(offset, timing);

  return particle;
}

export default Effect;
