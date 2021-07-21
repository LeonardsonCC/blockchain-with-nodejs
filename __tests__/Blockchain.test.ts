import { join } from "path";
import Blockchain, { setFilePath } from "../src/Blockchain";

describe("Blockchain test suite", function () {
  describe("Blockchain store in file", () => {
    beforeAll(() => {
      setFilePath(join(__dirname, "../tmp/chain.dev"));
    });
    it("should restore a valid chain from file", () => {
      const ledger = new Blockchain(true);

      expect(ledger.checkChainValidity()).toBe(true);
    });
  });
  describe("Blockchain functionalities", () => {
    it("should be a valid ledger", function () {
      const ledger = new Blockchain();

      ledger.addNewBlock({
        sender: "Test 1",
        receiver: "Test 2",
        amount: 50,
      });
      ledger.addNewBlock({
        sender: "Test 2",
        receiver: "Test 3",
        amount: 20,
      });

      expect(ledger.checkChainValidity()).toBe(true);
    });

    it("should be an invalid ledger", function () {
      const ledger = new Blockchain();

      ledger.addNewBlock({
        sender: "Test 1",
        receiver: "Test 2",
        amount: 50,
      });
      ledger.addNewBlock({
        sender: "Test 2",
        receiver: "Test 3",
        amount: 20,
      });

      // Hacking ledger
      ledger.ledger[1].data.amount = 9999;

      expect(ledger.checkChainValidity()).toBe(false);
    });

    it("should add a new block in ledger", function () {
      const ledger = new Blockchain();
      expect(ledger.ledger.length).toBe(1);

      ledger.addNewBlock({
        sender: "Test 1",
        receiver: "Test 2",
        amount: 50,
      });
      expect(ledger.ledger.length).toBe(2);
    });

    it("should return latest block of ledger", function () {
      const ledger = new Blockchain();
      let latestBlock = ledger.obtainLatestBlock();
      expect(latestBlock.data.sender).toBe("Leonardson");
      expect(latestBlock.data.receiver).toBe("Leonardson");

      const newBlock = {
        sender: "Test 1",
        receiver: "Test 2",
        amount: 100,
      };
      ledger.addNewBlock(newBlock);
      latestBlock = ledger.obtainLatestBlock();
      expect(latestBlock.data.sender).toBe("Test 1");
      expect(latestBlock.data.receiver).toBe("Test 2");
    });
  });
});
