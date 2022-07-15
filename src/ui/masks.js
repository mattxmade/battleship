let gridInitDelay = 5;

function generateMasks(cells, handleAttack) {
  cells.forEach((cell, index) => {
    const icon = document.createElement("i");
    icon.style.borderRadius = "100%";
    icon.style.position = "absolute";
    icon.style.fontSize = "2rem";
    icon.style.height = "55%";
    icon.style.width = "55%";

    icon.style.zIndex = 9;
    icon.style.display = "grid";
    icon.style.placeItems = "center";

    icon.classList.add("play-indicators");
    icon.classList.add("fas");

    cell.appendChild(icon);

    const mask = document.createElement("div");
    mask.dataset.id = cell.id;
    mask.dataset.index = index;
    mask.classList.add("mask");

    mask.style.zIndex = 10;
    mask.style.width = "100%";
    mask.style.height = "100%";
    mask.style.cursor = "cell";
    mask.style.position = "absolute";

    mask.style.display = "flex";
    mask.style.alignItems = "center";
    mask.style.justifyContent = "center";
    mask.addEventListener("click", handleAttack);

    mask.addEventListener("mouseenter", hoverMode);
    mask.addEventListener("mouseleave", removePara);

    cell.appendChild(mask);

    setTimeout(() => {
      mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    }, gridInitDelay);

    setTimeout(() => {
      mask.style.backgroundColor = "transparent";
    }, gridInitDelay + 5);

    gridInitDelay += 5;
  });
}

function hoverMode(e) {
  const p = document.createElement("p");
  p.textContent = e.target.dataset.id;
  p.style.color = "white";
  p.style.position = "absolute";
  p.style.top = "0.25rem";
  p.style.left = "0.25rem";
  p.style.zIndex = -100;
  e.target.appendChild(p);
}

function removePara(e) {
  let para;
  if (e.target.childNodes.length > 0) {
    e.target.childNodes.forEach((child) => {
      if (child.tagName === "P") para = child;
    });
  }
  para.remove();
}

export default generateMasks;
