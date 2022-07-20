import Player from "./player";

describe("Player: Test Suite", () => {
  const player1 = Player();

  test("new instance returns valid properties", () => {
    expect(player1).toMatchObject({
      score: 0,
      id: expect.any(String),
      board: expect.any(Object),
      ships: expect.any(Object),
      fleet: expect.any(Array),
    });
  });

  test("validate array length", () => {
    expect(player1.fleet.length).toEqual(5);
  });

  test("validate object length", () => {
    expect(Object.keys(player1.ships).length).toEqual(5);
  });

  test("unique player IDs", () => {
    const player2 = Player();
    expect(player1.id).not.toEqual(player2.id);
  });
});
