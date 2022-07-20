import Ship from "./ship";

describe("Ship: Initialiser", () => {
  const cruiser = Ship(3);

  test("valid object properties", () => {
    expect(cruiser).toMatchObject({
      shields: expect.any(Object),
      position: [],
      orientation: "east",
      hit: expect.any(Function),
      isSunk: expect.any(Function),
    });
  });
});

describe("Ship: Functions", () => {
  const destroyer = Ship(2);
  destroyer.position.push(["D7", "E7"]);
  const position = destroyer.position.flat();

  test("takes a string, confirm miss", () => {
    expect(destroyer.hit("D3", position)).toBe("miss");
  });

  test("takes a string, confirm hit", () => {
    expect(destroyer.hit("D7", position)).toBe("hit");
  });

  test("takes a string, confirm hit", () => {
    expect(destroyer.hit("E7", position)).toBe("hit");
  });

  test("ship sinks when shields at 0", () => {
    expect(destroyer.isSunk()).toBeTruthy();
  });
});
