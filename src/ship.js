function ship(length) {
  const position = [];

  let shields = length;

  const hit = (coordinate) => {
    let confirm = "miss";

    position.forEach((area, index) => {
      if (area === coordinate) {
        confirm = "hit";
        position.splice(index, 1);
        shields = position.length;
      }
    });

    return confirm;
  };

  const isSunk = () => {
    return shields === 0 ? true : false;
  };

  return { position, hit, isSunk };
}

module.exports = ship;
