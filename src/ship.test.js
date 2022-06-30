const ship = require("./ship");

describe("Ship: Initialiser", () => {
  const cruiser = ship(3);

  test("valid object properties", () => {
    expect(cruiser).toMatchObject({
      position: [],
      hit: expect.any(Function),
      isSunk: expect.any(Function),
    });
  });
});

describe("Ship: Functions", () => {
  const destroyer = ship(2);
  destroyer.position.push("D7", "E7");

  test("takes a string, confirm miss", () => {
    expect(destroyer.hit("D3")).toBe("miss");
  });

  test("takes a string, confirm hit", () => {
    expect(destroyer.hit("D7")).toBe("hit");
  });

  test("takes a string, confirm hit", () => {
    expect(destroyer.hit("E7")).toBe("hit");
  });

  test("ship sinks when shields at 0", () => {
    expect(destroyer.isSunk()).toBeTruthy();
  });
});
