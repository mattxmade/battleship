const cells = (number) => {
  if (typeof number !== "number") return;

  let counter = 1;
  const cells = [];

  for (let i = 1; i <= number; i++) {
    const cell = {};
    cell.type = "div";
    cell.class = "cell";

    if (counter === 11) counter = 1;

    if (i >= 1 && i <= 10) cell.id = `A${counter}`;
    if (i >= 11 && i <= 20) cell.id = `B${counter}`;
    if (i >= 21 && i <= 30) cell.id = `C${counter}`;
    if (i >= 31 && i <= 40) cell.id = `D${counter}`;
    if (i >= 41 && i <= 50) cell.id = `E${counter}`;
    if (i >= 51 && i <= 60) cell.id = `F${counter}`;
    if (i >= 61 && i <= 70) cell.id = `G${counter}`;
    if (i >= 71 && i <= 80) cell.id = `H${counter}`;
    if (i >= 81 && i <= 90) cell.id = `I${counter}`;
    if (i >= 91 && i <= 100) cell.id = `J${counter}`;

    cells.push(cell);
    counter++;
  }

  return cells;
};

module.exports = cells;
