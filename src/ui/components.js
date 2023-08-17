import createGrid from "../createGrid";
import webpVictory from "../victory.webp";

const uiComponents = () => {
  // game board UI elements
  const gameZone = document.querySelector(".game-zone");
  const gridContainer = document.querySelector(".grid");
  const grid = createGrid(gridContainer);
  const cells = document.querySelectorAll(".cell");
  const gridBlocker = document.querySelector(".grid-blocker");

  // game objects
  const board = {
    gameZone,
    gridContainer,
    grid,
    cells,
    gridBlocker,
  };

  // score system UI elements
  const score = {
    points: document.querySelectorAll(".point"), // reset
    shieldBars: document.querySelectorAll(".bar"), // reset
    actionTextGrp: document.querySelectorAll(".action-text"),
  };

  // player UI elements
  const player = {
    user: {
      fleet: document.querySelectorAll(".fleet"),
      docks: document.querySelectorAll(".dock"),
      shields: [],
    },
    computer: {
      fleet: document.querySelectorAll(".cpu-ship"),
      shields: [],
    },
  };

  score.shieldBars.forEach((bar) => {
    if (bar.classList[0].length > 14) player.computer.shields.push(bar);
    if (bar.classList[0].length === 14) player.user.shields.push(bar);
  });

  // game result UI elements
  const result = {
    img: document.querySelector("img"),
  };

  result.img.src = webpVictory;

  Object.freeze(board);
  Object.freeze(player);
  Object.freeze(score);
  Object.freeze(result);

  return {
    board,
    player,
    score,
  };
};

export default uiComponents;
