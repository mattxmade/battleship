import "./style.css";
import Player from "./player";
import Background from "./background";

import Effect from "./ui/effect";
import generateMasks from "./ui/masks";
import uiComponents from "./ui/components";

const Battleship = (() => {
  const ui = uiComponents();

  // three.js water background
  Background.init(ui.board.gameZone);
  Background.animate();

  // index
  const buttonMask = document.querySelector(".button-mask");
  const playYes = document.querySelector(".play-yes");
  const playNo = document.querySelector(".play-no");
  const modal = document.querySelector("dialog");

  // model
  const player1 = Player();
  const player2 = Player();

  let available = ui.board.grid.index;

  let parent;
  let iElement;
  let setup = true;
  let isDrawing = false;

  ui.board.cells.forEach((cell) => {
    cell.addEventListener("mouseover", appendHandler);
  });

  ui.player.user.docks.forEach((dock) => {
    dock.addEventListener("mouseover", appendHandler);
  });

  function appendHandler(e) {
    if (e.target.classList.contains("fleet")) {
    } else parent = e.target;
  }

  // model
  // model.game.attacker
  // model.game.defender

  let attacker;
  let defender;
  let normalPlay = true;

  // model.player.valid = []
  // model[player1].valid = []
  // model[player2].valid = []

  const player1Valid = [];
  const player2Valid = [];
  const positionsPlayed = [];

  const pointsIndex = { player1: 0, player2: 0 };

  function actionCarousel(percentage) {
    ui.score.actionTextGrp.forEach(
      (action) => (action.style.top = `-${percentage}%`)
    );
  }

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

  function handleAttack(e) {
    if (e.target.tagName === "P") return;

    let validPositions = player1Valid;
    let scoreIndex = pointsIndex.player1;
    let defenderShields = ui.player.computer.shields;
    let points = document.querySelectorAll(".user-point");

    if (attacker === player2) {
      validPositions = player2Valid;
      scoreIndex = pointsIndex.player2;
      defenderShields = ui.player.user.shields;
      points = document.querySelectorAll(".cpu-point");
    }

    const attackPos = e.target.dataset.id;

    // human player cannot hit ally ships
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

      //console.log("Shields " + currentShip.shields.get());

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

      if (currentShip.shields.get() === 0) {
        normalPlay = false;
        defender.board.stats.available -= 1;

        // console.log("SUNK");
        // console.log("Ship destroyed!");
        // console.log(defender.board.stats.available + " ships remaining...");

        if (attacker === player1) revealCpuShip(currentShip.name);
        if (attacker === player2) actionCarousel(600);

        points[scoreIndex].style.backgroundColor = "green";
        attacker === player1 ? pointsIndex.player1++ : pointsIndex.player2++;
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
          setTimeout(actionCarousel, 6000, 200);
          setTimeout(gridState, 10500);
          normalPlay = true;
          break;
      }
    }
  }

  function revealCpuShip(sunkShip) {
    ui.player.computer.fleet.forEach((ship) => {
      if (ship.id.slice(0, 10) === sunkShip) {
        setTimeout(ship.classList.add("reveal-ship"), 600);
      }
    });

    actionCarousel(600);
  }

  function gridState() {
    ui.board.gridBlocker.classList.toggle("blocker");
  }

  function setValidPositions(player, validPositions) {
    const gridTotal = ui.board.grid.index;

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
      actionCarousel(700); // You Win!
      modal.showModal();
      return true;
    }
    if (player1.board.stats.available === 0) {
      actionCarousel(800); // You Lose!
      modal.showModal();
      return true;
    }
  }

  window.addEventListener("mousemove", moveShip);
  window.addEventListener("mouseup", placeShip);

  let shipRotation = 0;

  ui.board.gridContainer.oncontextmenu = disableContextMenu;

  ui.player.user.fleet.forEach((ship) => {
    ship.oncontextmenu = (e) => {
      disableContextMenu(e);

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

    ship.addEventListener("mousedown", selectShip);
  });

  function disableContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function selectShip(e) {
    if (e.target.tagName !== "DIV") return;

    isDrawing = true;
    iElement = e.target;
    iElement.style.cursor = "grabbing";
    ui.board.gridContainer.style.cursor = "grabbing";

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

  function moveShip(e) {
    if (isDrawing && iElement !== undefined) {
      if (iElement.tagName !== "DIV") return;

      document.body.appendChild(iElement);
      ui.board.gridContainer.style.cursor = "grabbing";

      iElement.style.cursor = "grabbing";
      iElement.style.position = "absolute";
      iElement.style.left = e.pageX - 25 + "px";
      iElement.style.top = e.pageY - 25 + "px";
    }
  }

  function placeShip(e) {
    if (isDrawing && iElement.tagName === "DIV") {
      isDrawing = false;

      iElement.style.cursor = "grab";
      ui.board.gridContainer.style.cursor = "default";

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

    let requiredPositions = playerShip.shields.get();
    playerShip.length = requiredPositions;

    const positionDirection = elementDirection(shipElement.dataset.orientate);

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

    for (const cell of ui.board.cells) {
      if (playerShip.position.flat().includes(cell.id))
        playerShip.cells.push(cell);
    }
  }

  function newPosition(element, player) {
    const degrees = [0, 90, 180, 270];
    const randomRotation = degrees[Math.floor(Math.random() * degrees.length)];
    element.dataset.orientate = setHeading(randomRotation);
    player.ships[element.id.slice(0, 10)].orientation =
      element.dataset.orientate;
    const randomCell = available[Math.floor(Math.random() * available.length)];

    if (player === player2) element.style.zIndex = -1;

    element.style.position = "absolute";
    element.style.transform = `rotate(${randomRotation}deg)`;
    element.style.left = 0 + "px";
    element.style.top = 0 + "px";

    parent = document.body;
    parent.appendChild(element);

    for (const cell of ui.board.cells)
      if (cell.id === randomCell) parent = cell;

    parent.appendChild(element);
    setLocators(element, player);
  }

  function locators(id, requiredPositions, incrementJump, shipElement, player) {
    let searchIndex;

    ui.board.cells.forEach((cell, index) => {
      if (cell.id === id) searchIndex = index;
    });

    const result = [];
    const check = id.slice(0, 1);
    let currentCellNum = searchIndex;

    for (let i = 0; i < requiredPositions; i++) {
      ui.board.cells.forEach((cell, index) => {
        if (index === currentCellNum) {
          if (incrementJump === 1 || incrementJump === -1) {
            if (cell.id.slice(0, 1) === check) result.push(cell.id);
          } else result.push(cell.id);
        }
      });
      currentCellNum += incrementJump;
    }

    // out of bounds
    if (result.length !== requiredPositions && result.length > 0) return [];

    // ship overlap
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

    if (overlaps > 0) return [];

    return result;
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

  function startGame(e) {
    if (!allShipsPlaced() && !docksEmpty()) return;

    deployCpuShips();

    actionCarousel(100);
    setTimeout(prepareBoard, 2800);

    //setPlayers
    attacker = player1;
    defender = player2;
  }

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

    ui.player.user.docks.forEach((dock) => (dock.style.cursor = "default"));
    ui.board.cells.forEach((cell) => (cell.style.zIndex = "unset"));

    generateMasks(ui.board.cells, handleAttack);
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

    ui.board.grid.index.forEach((position) => {
      if (occupied.flat().includes(position) === false) {
        copy.push(position);
      }
    });
    available = copy;
  }

  function placeOpponentShips() {
    ui.player.computer.fleet.forEach((cpuShip) =>
      newPosition(cpuShip, player2)
    );

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

  function elementDirection(orientation) {
    if (orientation === "east") return 1;
    if (orientation === "west") return -1;
    if (orientation === "south") return 10;
    if (orientation === "north") return -10;
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
      ship.shields.reset();
      ship.position = [];
      ship.cells = [];
    });

    player2.fleet.forEach((ship) => {
      ship.shields.reset();
      ship.position = [];
      ship.cells = [];
    });

    const homeDocks = document.querySelectorAll(".dock");

    homeDocks.forEach((dock, index) => {
      ui.player.user.fleet[index].style.transform = "rotate(0deg)";
      ui.player.user.fleet[index].style.left =
        ui.player.user.fleet[index].dataset.lastX;
      ui.player.user.fleet[index].style.top =
        ui.player.user.fleet[index].dataset.lastX;

      ui.player.user.fleet[index].dataset.orientate === "east";

      dock.classList.remove("deploy");
      dock.appendChild(ui.player.user.fleet[index]);
    });

    ui.board.cells.forEach((cell) => (cell.style.zIndex = "initial"));

    const masks = document.querySelectorAll(".mask");
    masks.forEach((mask) => mask.remove());

    const icons = document.querySelectorAll(".play-indicators");
    icons.forEach((icon) => icon.remove());

    ui.score.shieldBars.forEach((bar) => bar.classList.remove("deduct-bar"));
    ui.score.points.forEach(
      (point) => (point.style.backgroundColor = "transparent")
    );

    ui.player.computer.fleet.forEach((ship) =>
      ship.classList.remove("reveal-ship")
    );

    const cpuAside = document.querySelector(".computer-aside");
    cpuAside.style.zIndex = 0;

    const cpuDocks = document.querySelectorAll(".dock-cpu");
    cpuDocks.forEach((dock, index) => {
      ui.player.computer.fleet[index].style.transform = "rotate(0deg)";
      ui.player.computer.fleet[index].style.left = 0;
      ui.player.computer.fleet[index].style.top = 0;

      dock.classList.remove("deploy-cpu");
      dock.appendChild(ui.player.computer.fleet[index]);
    });

    available = ui.board.grid.index;
    modal.close();
  });

  function popOff(number, source) {
    for (let i = 0; i !== number; i++) {
      source.pop();
    }
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

  return { startGame };
})();

const commenceGame = document.querySelector(".js-button-start");
commenceGame.addEventListener("click", Battleship.startGame);

const sidebrBtn = document.querySelector(".js-sidebar-btn");
const sidebar = document.querySelector(".sidebar");

sidebrBtn.addEventListener("click", (e) => {
  sidebar.classList.toggle("show");
});
