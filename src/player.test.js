const Player = require("./player");
// import { v4 as uuidv4 } from "uuid";

describe("Player: Test Suite", () => {
  const player1 = Player();

  test("new instance returns valid properties", () => {
    expect(player1).toMatchObject({
      score: 0,
      id: expect.any(String),
      board: expect.any(Object),
    });
  });

  test("unique player IDs", () => {
    const player2 = Player();
    expect(player1.id).not.toEqual(player2.id);
  });
});
