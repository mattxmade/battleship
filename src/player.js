import gameBoard from "./gameBoard";
import { v4 as uuidv4 } from "uuid";
import Ship from "./ship";

function Player() {
  let score = 0;
  const id = uuidv4();
  const board = gameBoard(id);

  const ships = {
    carrierrrr: Ship(5, "carrierrrr"),
    battleship: Ship(4, "battleship"),
    cruiserrrr: Ship(3, "cruiserrrr"),
    submarinee: Ship(3, "submarinee"),
    destroyerr: Ship(2, "destroyerr"),
  };

  const fleet = [
    ships.carrierrrr,
    ships.battleship,
    ships.cruiserrrr,
    ships.submarinee,
    ships.destroyerr,
  ];

  return { score, id, board, ships, fleet };
}

export default Player;
