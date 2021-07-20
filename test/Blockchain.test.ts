import { expect } from "chai";
import Blockchain from "../src/Blockchain";

describe("Blockchain test suite", function () {
  it("should be a valid blockchain", function () {
    const blockchain = new Blockchain();

    blockchain.addNewBlock({
      sender: "Test 1",
      receiver: "Test 2",
      amount: 50,
    });
    blockchain.addNewBlock({
      sender: "Test 2",
      receiver: "Test 3",
      amount: 20,
    });

    expect(blockchain.checkChainValidity()).to.be.true;
  });

  it("should be an invalid blockchain", function () {
    const blockchain = new Blockchain();

    blockchain.addNewBlock({
      sender: "Test 1",
      receiver: "Test 2",
      amount: 50,
    });
    blockchain.addNewBlock({
      sender: "Test 2",
      receiver: "Test 3",
      amount: 20,
    });

    // Hacking blockchain
    blockchain.blockchain[1].data.amount = 9999;

    expect(blockchain.checkChainValidity()).to.be.false;
  });

  it("should add a new block in blockchain", function () {
    const blockchain = new Blockchain();
    expect(blockchain.blockchain.length).to.equals(1);

    blockchain.addNewBlock({
      sender: "Test 1",
      receiver: "Test 2",
      amount: 50,
    });
    expect(blockchain.blockchain.length).to.equals(2);
  });

  it("should return latest block of blockchain", function () {
    const blockchain = new Blockchain();
    let latestBlock = blockchain.obtainLatestBlock();
    expect(latestBlock.data.sender).to.equals("Leonardson");
    expect(latestBlock.data.receiver).to.equals("Leonardson");
  });
});
