function ship(length) {
  const hits = 0;

  const _updateHitCount = () => hits++;

  const hit = (position) => {
    console.log("method called");
  };

  const isSunk = () => {
    console.log("method called");
  };

  return { hits, length, hit, isSunk };
}

module.exports = ship;
