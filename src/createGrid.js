import generateCellArray from "./cells";

const createGrid = (parent) => {
  const index = [];

  const cells = generateCellArray(100);

  cells.forEach((cell, indx) => {
    index.push(cell.id);
    const domCell = document.createElement(cell.type);

    domCell.id = cell.id;
    domCell.dataset.indx = indx;
    domCell.classList.add(cell.class);

    parent.appendChild(domCell);
  });

  return { index };
};

export default createGrid;
