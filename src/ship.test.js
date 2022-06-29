const ship = require("./ship");

describe("Game Logic Component: Ship", () => {
  test("should return correct properties", () => {
    const carrier = ship(5);

    expect(carrier).toMatchObject({
      hits: 0,
      length: 5,
      hit: expect.any(Function),
      isSunk: expect.any(Function),
    });
  });
});
