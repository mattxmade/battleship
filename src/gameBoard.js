import ship from "./ship";

function gameBoard(belongsTo) {
  if (belongsTo === undefined || belongsTo === null) return;

  const stats = {
    missed: 0,
    available: 5,
    belongsTo: belongsTo,
  };

  const fleet = {
    carrier: ship(5),
    cruiser: ship(3),
    destroyer: ship(2),
    submarine: ship(3),
    battleship: ship(4),
  };

  const methods = {
    receiveAttack: () => {},
    addShipToBoard: () => {},
  };

  return { stats, fleet, methods };
}

module.exports = gameBoard;
