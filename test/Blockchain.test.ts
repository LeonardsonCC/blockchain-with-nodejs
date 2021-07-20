import { expect } from "chai";
import Blockchain from "../src/Blockchain";
import Block from "../src/Block";

describe("Blockchain test suite", function () {
  it("should be a valid blockchain", function () {
    const coin = new Blockchain();

    coin.addNewBlock({
      sender: "Test 1",
      receiver: "Test 2",
      amount: 50,
    });
    coin.addNewBlock({
      sender: "Test 2",
      receiver: "Test 3",
      amount: 20,
    });

    expect(coin.checkChainValidity()).to.be.true;
  });

  it("should be an invalid blockchain", function () {
    const coin = new Blockchain();

    coin.addNewBlock({
      sender: "Test 1",
      receiver: "Test 2",
      amount: 50,
    });
    coin.addNewBlock({
      sender: "Test 2",
      receiver: "Test 3",
      amount: 20,
    });

    // Hacking blockchain
    coin.blockchain[0].data.amount = 999;

    expect(coin.checkChainValidity()).to.be.false;
  });
});
