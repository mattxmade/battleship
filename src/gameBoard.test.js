import gameBoard from "./gameBoard";

describe("Gameboard: Initialiser", () => {
  test("input is empty", () => {
    expect(gameBoard()).toBe(undefined);
  });
});

describe("Gameboard: Game Component", () => {
  const board = gameBoard("player1");

  test("validate object stats", () => {
    expect(board.stats).toMatchObject({
      misses: [],
      available: 5,
      belongsTo: "player1",
    });
  });

  test("validate object methods", () => {
    expect(board.actions).toMatchObject({
      receiveAttack: expect.any(Function),
      addShipToBoard: expect.any(Function),
      clearPositions: expect.any(Function),
    });
  });
});
