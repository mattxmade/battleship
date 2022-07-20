function Ship(length, name) {
  let shield = length;

  const shields = {
    get: () => shield,
    hit: () => shield--,
    reset: () => (shield = length),
  };

  let position = [];
  let orientation = "east";

  const hit = (coordinate, position) => {
    if (position.includes(coordinate)) {
      shields.hit();
      return "hit";
    }

    return "miss";
  };

  const isSunk = () => {
    return shields.get() === 0 ? true : false;
  };

  return {
    name,
    shields,
    position,
    orientation,
    hit,
    isSunk,
  };
}

export default Ship;
