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
    blockchain.blockchain[0].data.amount = 999;

    expect(blockchain.checkChainValidity()).to.be.false;
  });
});
