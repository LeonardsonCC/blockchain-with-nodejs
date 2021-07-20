import CryptoBlockchain from "./Blockchain";

let coin = new CryptoBlockchain();
coin.addNewBlock({
  sender: "Iris Ljesnjanin",
  receiver: "Cosima Mielke",
  amount: 50,
});
coin.addNewBlock({
  sender: "Vitaly Friedman",
  receiver: "Ricardo Gimenes",
  amount: 100,
});

coin.blockchain[0].data.amount = 999;
console.log(coin.debug());
console.log("Chain is valid: " + coin.checkChainValidity());
