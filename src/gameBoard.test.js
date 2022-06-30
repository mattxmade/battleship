const gameBoard = require("./gameBoard");

describe("Gameboard: Initialiser", () => {
  test("input is empty", () => {
    expect(gameBoard()).toBe(undefined);
  });
});

describe("Gameboard: Game Component", () => {
  const board = gameBoard("player1");

  test("validate object stats", () => {
    expect(board.stats).toMatchObject({
      missed: 0,
      available: 5,
      belongsTo: "player1",
    });
  });

  test("validate object fleet", () => {
    expect(Object.keys(board.fleet).length).toEqual(5);
  });

  test("validate object methods", () => {
    expect(board.methods).toMatchObject({
      receiveAttack: expect.any(Function),
      addShipToBoard: expect.any(Function),
    });
  });
});
