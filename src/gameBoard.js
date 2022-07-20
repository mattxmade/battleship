function gameBoard(belongsTo) {
  if (belongsTo === undefined || belongsTo === null) return;

  const stats = {
    misses: [],
    available: 5,
    belongsTo: belongsTo,
  };

  const heldPositions = [];

  const _positionFree = (position) => {
    for (const area of position) {
      for (const heldPosition of heldPositions.flat()) {
        if (heldPosition.includes(area)) return false;
      }
    }

    return true;
  };

  const actions = {
    receiveAttack: (coordinate, fleet) => {
      return fleet.find(
        (ship) => ship.hit(coordinate, ship.position.flat()) === "hit"
      );
    },
    addShipToBoard: (position) => {
      if (_positionFree(position)) heldPositions.push(position);
    },
    clearPositions: () => {
      while (heldPositions.length) {
        heldPositions.pop();
        if (heldPositions.length === 0) break;
      }
    },
  };

  return { stats, actions, heldPositions };
}

export default gameBoard;
