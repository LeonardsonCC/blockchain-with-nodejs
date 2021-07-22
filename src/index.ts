import Blockchain from "./Blockchain";
import Node from "./Node";

let coin = new Blockchain();
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

const node = new Node(coin);

process.argv.slice(2).forEach((otherPeerAddress) => {
  node.connect(otherPeerAddress);
});
