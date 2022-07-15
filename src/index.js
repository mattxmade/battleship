import "./style.css";
import Grid from "./grid";
import Player from "./player";
import Background from "./background";

import Effect from "./ui/effect";
import generateMasks from "./masks";

// import webpBattleship from "./battleship.webp";
import webpVictory from "./victory.webp";

const img = document.querySelector("img");
img.src = webpVictory;

const playYes = document.querySelector(".play-yes");
const playNo = document.querySelector(".play-no");

const modal = document.querySelector("dialog");

const gameZone = document.querySelector(".game-zone");

// three.js water background
Background.init(gameZone);
Background.animate();
// three.js water background

const gridContainer = document.querySelector(".grid");
const grid = Grid(gridContainer);
let available = grid.index;
const cells = document.querySelectorAll(".cell");

const player1 = Player();
const player2 = Player();

let percentage = 100;

player1.actions = player1.board.actions;
player2.actions = player2.board.actions;

player1.attack = player2.board.actions.receiveAttack;
player2.attack = player1.board.actions.receiveAttack;

// place ships - ALL for mobile - quick game;
const cpuShips = document.querySelectorAll(".cpu-ship");

// drag n drop
// orientation :: vertical or horizontal
// 0,0 position of drag over valid cell marks starting point
// head and tail same

// generate head / tail : position[0] | position[position.length-1]
// generate body -- position.length - 2
// if vert - height of body 100% of cell
// if horz - width  of body 100% of cell

// if (position.length == 2) only head + tail

// add head to start cell
// if vert nextSibling+10 else nextSibling
// if ship position on grid invalid (cannot fit?) snap to nearest
// grabbing ship again removes it from grid, generates floating ship
// on ok proceed, ships are locked, dragging no longer works, only clicks

let setup = true;
let parent;
let iElement;
let isDrawing = false;

cells.forEach((cell) => {
  cell.addEventListener("mouseover", appendHandler);
  cell.addEventListener("click", (e) => {});
});

const dockyard = document.querySelectorAll(".dock");
dockyard.forEach((dock) => {
  dock.addEventListener("mouseover", appendHandler);
});

function appendHandler(e) {
  if (e.target.classList.contains("fleet")) {
  } else parent = e.target;
}

let attacker;
let defender;

const playerShieldsUI = [];
const computerShieldsUI = [];
const shieldBars = document.querySelectorAll(".bar");

shieldBars.forEach((bar) => {
  if (bar.classList[0].length > 14) computerShieldsUI.push(bar);
  if (bar.classList[0].length === 14) playerShieldsUI.push(bar);
});

const player1Valid = [];
const player2Valid = [];
const positionsPlayed = [];

const pointsIndex = { player1: 0, player2: 0 };

function computerPlay() {
  if (attacker !== player2) return;

  const randomPlay =
    player2Valid[Math.floor(Math.random() * player2Valid.length)];

  if (positionsPlayed !== 0) {
    if (positionsPlayed.includes(randomPlay)) {
      updatetValidPositions(randomPlay, player2Valid);
      return computerPlay();
    }
  }

  const cellMasks = document.querySelectorAll(".mask");

  const cell = Array.from(cellMasks).find(
    (cell) => cell.dataset.id === randomPlay
  );

  cell.click();
}

const gridBlocker = document.querySelector(".grid-blocker");

let normalPlay = true;

function handleAttack(e) {
  // console.log(attacker, defender);

  let validPositions = player1Valid;
  let scoreIndex = pointsIndex.player1;
  let defenderShields = computerShieldsUI;
  let points = document.querySelectorAll(".user-point");

  if (attacker === player2) {
    validPositions = player2Valid;
    scoreIndex = pointsIndex.player2;
    defenderShields = playerShieldsUI;
    points = document.querySelectorAll(".cpu-point");
  }

  const attackPos = e.target.dataset.id;

  // human player can't hit own ship
  if (attacker === player1) {
    if (player1.board.heldPositions.flat(2).includes(attackPos)) {
      // console.log("ally vessel");
      return;
    }
  }

  const currentShip = defender.board.actions.receiveAttack(
    attackPos,
    defender.fleet
  );

  // console.log("Ship name: " + currentShip);

  if (currentShip !== undefined) {
    // console.log("hit");
    actionCarousel(500);

    currentShip.shields--;
    // console.log("Shields " + currentShip.shields);

    let removeFromIndex;

    const shipHealth = defenderShields.find((shipShield, index) => {
      if (shipShield.classList[0].slice(0, 10) === currentShip.name) {
        removeFromIndex = index;
        return shipShield;
      }
    });

    if (shipHealth !== undefined) {
      shipHealth.classList.add("deduct-bar");
      defenderShields.splice(removeFromIndex, 1);
    }

    if (currentShip.shields === 0) {
      // console.log("SUNK");
      defender.board.stats.available -= 1;

      // console.log("Ship destroyed!");
      // console.log(defender.board.stats.available + " ships remaining...");

      if (attacker === player1) revealCpuShip(currentShip.name);

      points[scoreIndex].style.backgroundColor = "green";
      attacker === player1 ? pointsIndex.player1++ : pointsIndex.player2++;

      if (normalPlay) actionCarousel(200);
    }

    e.target.previousSibling.classList.add("fa-bolt");
    e.target.previousSibling.classList.add("hit-indicator");
  } else {
    // console.log("miss");
    e.target.previousSibling.classList.add("fa-minus");
    e.target.previousSibling.classList.add("miss-indicator");

    actionCarousel(400);
  }

  e.target.appendChild(Effect());

  updatetValidPositions(attackPos, validPositions);
  positionsPlayed.push(attackPos);

  e.target.removeEventListener("click", handleAttack);

  if (winner()) return;

  if (attacker === player1) {
    attacker = player2;
    defender = player1;

    switch (normalPlay) {
      default:
        setTimeout(actionCarousel, 2000, 300);
        setTimeout(computerPlay, 3500);
        gridState();
        break;

      case false:
        setTimeout(actionCarousel, 6000, 300);
        setTimeout(computerPlay, 10500);
        gridState();

        normalPlay = true;
        break;
    }
  } else {
    attacker = player1;
    defender = player2;

    switch (normalPlay) {
      default:
        setTimeout(actionCarousel, 2000, 200);
        setTimeout(gridState, 2200);
        break;

      case false:
        setTimeout(actionCarousel, 6000, 300);
        setTimeout(computerPlay, 10500);
        normalPlay = true;
        break;
    }
  }
}

function revealCpuShip(sunkShip) {
  normalPlay = false;

  cpuShips.forEach((ship) => {
    if (ship.id.slice(0, 10) === sunkShip) {
      setTimeout(ship.classList.add("reveal-ship"), 600);
    }
  });

  actionCarousel(600);
}

function gridState() {
  gridBlocker.classList.toggle("blocker");
}

function setValidPositions(player, validPositions) {
  const gridTotal = grid.index;

  gridTotal.forEach((position) => {
    if (player.board.heldPositions.flat(2).includes(position)) return;
    validPositions.push(position);
  });
}

function updatetValidPositions(attackPos, validPositions) {
  let indexToRemove;

  validPositions.forEach((position, index) => {
    if (position === attackPos) indexToRemove = index;
  });

  if (indexToRemove !== undefined) validPositions.splice(indexToRemove, 1);
}

function winner() {
  if (player2.board.stats.available === 0) {
    // console.log("YOU WIN!");
    actionCarousel(700);
    modal.showModal();
    return true;
  }
  if (player1.board.stats.available === 0) {
    // console.log("YOU LOSE!");
    actionCarousel(800);
    modal.showModal();
    return true;
  }
}

window.addEventListener("mousemove", mouseMove);
window.addEventListener("mouseup", mouseUp);

let shipRotation = 0;

const fleet = document.querySelectorAll(".fleet");
fleet.forEach((ship) => {
  ship.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.parentNode.classList.contains("dock")) return;

    if (e.target.style.transform === "") {
      e.target.style.transform = "rotate(0deg)";
    }

    shipRotation = e.target.style.transform.split("");
    shipRotation = Number(
      shipRotation.splice(7, shipRotation.length - 11).join("")
    );

    shipRotation = shipRotation + 90;
    if (shipRotation === 360) shipRotation = 0;

    e.target.style.transform = `rotate(${shipRotation}deg)`;

    if (shipRotation === 0) e.target.dataset.orientate = "east";
    if (shipRotation === 90) e.target.dataset.orientate = "south";
    if (shipRotation === 180) e.target.dataset.orientate = "west";
    if (shipRotation === 270) e.target.dataset.orientate = "north";

    player1.ships[e.target.id].orientation = e.target.dataset.orientate;
  };

  ship.addEventListener("mousedown", mouseDown);
});

function mouseDown(e) {
  if (e.target.tagName !== "DIV") return;

  isDrawing = true;
  iElement = e.target;
  iElement.style.cursor = "grabbing";
  gridContainer.style.cursor = "grabbing";

  if (parent.classList.contains("dock")) {
    parent.classList.add("deploy");
  }

  if (e.target.dataset.lastX === undefined) {
    e.target.dataset.parent = e.target.id;
    e.target.dataset.lastX = e.target.style.left;
    e.target.dataset.lastY = e.target.style.top;
  }

  e.target.style.position = "absolute";
  e.target.style.left = e.pageX - 25 + "px";
  e.target.style.top = e.pageY - 25 + "px";

  document.body.appendChild(e.target);
}

function mouseMove(e) {
  if (isDrawing && iElement !== undefined) {
    if (iElement.tagName !== "DIV") return;

    document.body.appendChild(iElement);
    gridContainer.style.cursor = "grabbing";

    iElement.style.cursor = "grabbing";
    iElement.style.position = "absolute";
    iElement.style.left = e.pageX - 25 + "px";
    iElement.style.top = e.pageY - 25 + "px";
  }
}

function mouseUp(e) {
  if (isDrawing && iElement.tagName === "DIV") {
    isDrawing = false;

    iElement.style.cursor = "grab";
    gridContainer.style.cursor = "default";

    if (parent.classList.contains("dock")) {
      const docks = document.querySelectorAll(".dock");
      for (const dock of docks) {
        if (dock.classList.contains(iElement.dataset.parent)) {
          parent = dock;
        }
      }
      shipRotation = 0;
      iElement.style.transform = "rotate(0deg)";
      iElement.style.left = iElement.dataset.lastX;
      iElement.style.top = iElement.dataset.lastY;
      parent.classList.remove("deploy");

      parent.appendChild(iElement);
    } else {
      iElement.style.left = 0 + "px";
      iElement.style.top = 0 + "px";

      parent.appendChild(iElement);
      setTimeout(() => {
        setLocators(iElement, player1);
        updateAvailablePositions();
      }, 1);
    }
  }

  if (docksEmpty() && setup) buttonMask.classList.add("toggle-button-mask");
  else buttonMask.classList.remove("toggle-button-mask");
}

function setLocators(shipElement, player) {
  if (player === undefined) return;

  const playerShip = player.ships[shipElement.id.slice(0, 10)];

  // console.log("Sheilds: " + playerShip.shields);

  let requiredPositions = playerShip.shields;
  playerShip.length = requiredPositions;

  let positionDirection;

  if (shipElement.dataset.orientate === "east") positionDirection = 1;
  if (shipElement.dataset.orientate === "west") positionDirection = -1;
  if (shipElement.dataset.orientate === "south") positionDirection = 10;
  if (shipElement.dataset.orientate === "north") positionDirection = -10;

  const gridPosition = locators(
    shipElement.parentNode.id,
    requiredPositions,
    positionDirection,
    shipElement,
    player
  );

  if (gridPosition.length !== requiredPositions)
    return newPosition(shipElement, player);

  // console.log(shipElement.id + " position: " + gridPosition);
  // console.log("Direction: " + shipElement.dataset.orientate);
  // console.log("");

  // clear ship's previous position
  if (playerShip.position.length !== 0) playerShip.position = [];

  // Update game objects
  playerShip.position.push(gridPosition);
  updateAvailablePositions();

  playerShip.cells = [];

  for (const cell of cells) {
    if (playerShip.position.flat().includes(cell.id))
      playerShip.cells.push(cell);
  }
}

function newPosition(element, player) {
  const degrees = [0, 90, 180, 270];
  const randomRotation = degrees[Math.floor(Math.random() * degrees.length)];
  element.dataset.orientate = setHeading(randomRotation);
  player.ships[element.id.slice(0, 10)].orientation = element.dataset.orientate;
  const randomCell = available[Math.floor(Math.random() * available.length)];

  if (player === player2) element.style.zIndex = -1;

  element.style.position = "absolute";
  element.style.transform = `rotate(${randomRotation}deg)`;
  element.style.left = 0 + "px";
  element.style.top = 0 + "px";

  parent = document.body;
  parent.appendChild(element);

  for (const cell of cells) if (cell.id === randomCell) parent = cell;

  parent.appendChild(element);
  setLocators(element, player);
}

function locators(id, requiredPositions, incrementJump, shipElement, player) {
  let searchIndex;

  cells.forEach((cell, index) => {
    if (cell.id === id) searchIndex = index;
  });

  const result = [];
  const check = id.slice(0, 1);
  let currentCellNum = searchIndex;

  for (let i = 0; i < requiredPositions; i++) {
    cells.forEach((cell, index) => {
      if (index === currentCellNum) {
        if (incrementJump === 1 || incrementJump === -1) {
          if (cell.id.slice(0, 1) === check) result.push(cell.id);
        } else result.push(cell.id);
      }
    });
    currentCellNum += incrementJump;
  }

  // ship off-grid ? move back into grid bounds
  if (result.length !== requiredPositions && result.length > 0) {
    return [];
    const diff = requiredPositions - result.length;
    // south
    if (incrementJump === 10) {
      const newIndx = searchIndex - diff * 10;
      moveToBounds(newIndx, shipElement);
    }
    // north
    if (incrementJump === -10) {
      const newIndx = searchIndex + diff * 10;
      moveToBounds(newIndx, shipElement);
    }
    // east
    if (incrementJump === 1) {
      const newIndx = searchIndex - diff;
      moveToBounds(newIndx, shipElement);
    }
    // west
    if (incrementJump === -1) {
      const newIndx = searchIndex + diff;
      moveToBounds(newIndx, shipElement);
    }
  }

  // prevent ship overlap
  let overlaps = 0;
  const current = player.ships[shipElement.id.slice(0, 10)];

  player1.fleet.forEach((ship) => {
    if (current === ship) return;
    for (const position of ship.position.flat()) {
      result.forEach((cood) => (position === cood ? overlaps++ : overlaps));
    }
  });

  player2.fleet.forEach((ship) => {
    if (current === ship) return;
    for (const position of ship.position.flat()) {
      result.forEach((cood) => (position === cood ? overlaps++ : overlaps));
    }
  });

  if (overlaps > 0) {
    return [];
    if (searchIndex === cells.length - 1) searchIndex = 0;
    moveToBounds(searchIndex + 1, shipElement, player);
  }

  return result;
}

function moveToBounds(newIndx, element, player) {
  cells.forEach((cell, index) => {
    if (index === newIndx) parent = cell;
  });

  parent.appendChild(element);
  element.style.left = 0 + "px";
  element.style.top = 0 + "px";

  setTimeout(setLocators, 1, element, player);
}

const keyframes = [
  { backgroundColor: "black" },
  { backgroundColor: "transparent" },
];

const deployTiming = {
  duration: 1500,
  iterations: 1,
};

function deployCpuShips() {
  let delay = 0;
  const cpuDocks = document.querySelectorAll(".dock-cpu");
  const cpuAside = document.querySelector(".computer-aside");

  cpuDocks.forEach((dock) => {
    setTimeout(() => {
      dock.classList.add("deploy-cpu");
      dock.children[0].animate(keyframes, deployTiming);
    }, 0 + delay);
    delay += 300;
  });
  setTimeout(() => {
    cpuAside.style.zIndex = -1;
  }, 4500);
}

const buttonMask = document.querySelector(".button-mask");

const commenceGame = document.querySelector(".js-button-start");
commenceGame.addEventListener("click", () => {
  if (allShipsPlaced() && docksEmpty()) {
    deployCpuShips();

    actionCarousel(100);
    setTimeout(prepareBoard, 2800);

    //setPlayers
    attacker = player1;
    defender = player2;
  }
});

function prepareBoard() {
  if (available !== 66) placeOpponentShips();

  player1.board.actions.clearPositions();
  player2.board.actions.clearPositions();

  player1.fleet.forEach((ship) => {
    player1.board.actions.addShipToBoard(ship.position);
  });
  player2.fleet.forEach((ship) => {
    player2.board.actions.addShipToBoard(ship.position);
  });

  setValidPositions(player1, player1Valid);
  setValidPositions(player2, player2Valid);

  dockyard.forEach((dock) => (dock.style.cursor = "default"));

  cells.forEach((cell) => (cell.style.zIndex = "unset"));

  generateMasks(cells, handleAttack);
  actionCarousel(200);

  buttonMask.classList.remove("toggle-button-mask");
  setup = false;
}

function allShipsPlaced() {
  let placed = true;

  for (const ship of player1.fleet) {
    if (ship.position.length === 0) placed = false;
  }

  return placed;
}

const docks = document.querySelectorAll(".dock");
function docksEmpty() {
  let empty = 0;
  docks.forEach((dock) => {
    dock.children.length === 0 ? empty++ : empty;
  });

  if (empty === 5) return true;
}

function updateAvailablePositions() {
  const copy = [];

  const occupied = [];
  player1.fleet.map((ship) => occupied.push(ship.position.flat()));
  player2.fleet.map((ship) => occupied.push(ship.position.flat()));

  grid.index.forEach((position) => {
    if (occupied.flat().includes(position) === false) {
      copy.push(position);
    }
  });
  available = copy;
}

function placeOpponentShips() {
  cpuShips.forEach((cpuShip) => newPosition(cpuShip, player2));

  const is17 = player2.fleet.reduce((prev, ship) => {
    return prev + ship.position.flat().length;
  }, 0);

  if (is17 !== 17) return placeOpponentShips();
}

function setHeading(shipRotation) {
  if (shipRotation === 0) return "east";
  if (shipRotation === 90) return "south";
  if (shipRotation === 180) return "west";
  if (shipRotation === 270) return "north";
}

function gridDirection(shipElement) {
  if (shipElement.dataset.orientate === "east") return 1;
  if (shipElement.dataset.orientate === "west") return -1;
  if (shipElement.dataset.orientate === "south") return 10;
  if (shipElement.dataset.orientate === "north") return -10;
}

const ui = {
  feedback: {
    titantron: {
      outerBody: document.querySelector(".titantron"),
      innerBody: document.querySelector(".chevron"),
      innerText: document.querySelector(".action-text"),
    },
  },

  animators: {
    titantron: {
      properties: [{ height: "0" }, { height: "25rem" }],
      timing: { duration: 1000, iterations: 1 },
    },
    chevron: {
      properties: [
        { transform: "rotate(45deg)" },
        { transform: "rotate(135deg)" },
      ],
      timing: { duration: 1000, iterations: 1 },
    },
    actionText: {
      properties: [
        { transform: "rotate(-45deg)" },
        { transform: "rotate(-135deg)" },
      ],
      timing: { duration: 1000, iterations: 1 },
    },
  },
};

const actionTextGrp = document.querySelectorAll(".action-text");

actionTextGrp.forEach((action) =>
  action.addEventListener("click", textCarousel)
);

function textCarousel(e) {
  actionTextGrp.forEach((action) => {
    if (percentage === 0) {
      action.style.top = 0;
    }

    action.style.top = `-${percentage}%`;
  });
  percentage += 100;
  if (percentage === 400) percentage = 0;
}

playYes.addEventListener("click", (e) => {
  setup = true;
  actionCarousel(0);
  buttonMask.classList.remove("toggle-button-mask");

  const valid1 = player1Valid.length;
  const valid2 = player2Valid.length;
  const played = positionsPlayed.length;

  popOff(valid1, player1Valid);
  popOff(valid2, player2Valid);
  popOff(played, positionsPlayed);

  pointsIndex.player1 = 0;
  pointsIndex.player2 = 0;

  player1.board.stats.available = 5;
  player2.board.stats.available = 5;

  player1.fleet.forEach((ship) => {
    ship.shields = ship.length;
    ship.position = [];
    ship.cells = [];
  });

  player2.fleet.forEach((ship) => {
    ship.shields = ship.length;
    ship.position = [];
    ship.cells = [];
  });

  const resestShips = document.querySelectorAll(".ship");
  const homeDocks = document.querySelectorAll(".dock");

  homeDocks.forEach((dock, index) => {
    resestShips[index].style.transform = "rotate(0deg)";
    resestShips[index].style.left = resestShips[index].dataset.lastX;
    resestShips[index].style.top = resestShips[index].dataset.lastX;

    resestShips[index].dataset.orientate === "east";

    dock.classList.remove("deploy");
    dock.appendChild(resestShips[index]);
  });

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.style.zIndex = "initial"));

  const masks = document.querySelectorAll(".mask");
  masks.forEach((mask) => mask.remove());

  const icons = document.querySelectorAll(".play-indicators");
  icons.forEach((icon) => icon.remove());

  const bars = document.querySelectorAll(".bar");
  bars.forEach((bar) => bar.classList.remove("deduct-bar"));

  const points = document.querySelectorAll(".point");
  points.forEach((point) => (point.style.backgroundColor = "transparent"));

  const cpuShips = document.querySelectorAll(".cpu-ship");
  cpuShips.forEach((ship) => ship.classList.remove("reveal-ship"));

  const cpuAside = document.querySelector(".computer-aside");
  cpuAside.style.zIndex = 0;

  const cpuDocks = document.querySelectorAll(".dock-cpu");
  cpuDocks.forEach((dock, index) => {
    cpuShips[index].style.transform = "rotate(0deg)";
    cpuShips[index].style.left = 0;
    cpuShips[index].style.top = 0;

    dock.classList.remove("deploy-cpu");
    dock.appendChild(cpuShips[index]);
  });

  available = grid.index;
  modal.close();
});

function popOff(number, source) {
  for (let i = 0; i !== number; i++) {
    source.pop();
  }
}

function actionCarousel(percentage) {
  actionTextGrp.forEach((action) => {
    // if (percentage === 0) {
    //   action.style.top = 0;
    // }

    action.style.top = `-${percentage}%`;
  });
  // percentage += 100;
  // if (percentage > 800) percentage = 0;
}

const body = document.body;
const loadscreen = document.querySelector(".load-screen");

setTimeout(() => {
  body.style.visibility = "visible";
  loadscreen.classList.add("fade-screen");
}, 900);

setTimeout(() => {
  loadscreen.style.zIndex = -200;
}, 950);
