const Cells = (number) => {
  if (typeof number !== "number") return;

  let setChar = 1;
  let counter = 1;

  const cells = [];
  const group = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  for (let i = 1; i <= number; i++) {
    if (counter === 11) {
      counter = 1;
      setChar++;
    }

    const cell = {
      type: "div",
      class: "cell",
      id: group[setChar] + counter,
    };

    cells.push(cell);
    counter++;
  }

  return cells;
};

export default Cells;
