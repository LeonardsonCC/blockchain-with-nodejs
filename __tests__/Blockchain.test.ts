import Blockchain from "../src/Blockchain";

describe("Blockchain test suite", function () {
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
  });
});
