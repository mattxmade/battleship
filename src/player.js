import Board from "./gameBoard";
import { v4 as uuidv4 } from "uuid";

function Player() {
  let score = 0;
  const id = uuidv4();
  const board = Board(id);

  return { score, id, board };
}

module.exports = Player;
