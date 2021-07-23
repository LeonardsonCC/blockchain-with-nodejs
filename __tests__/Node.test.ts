import Blockchain from "../src/Blockchain";
import Node from "../src/Node";

describe("Node tests", () => {
  it("should instantiate node", () => {
    const newBlockchain = new Blockchain();
    const newNode = new Node(newBlockchain, 26260);

    expect(newNode.isRunning).toBe(true);
  });
});
