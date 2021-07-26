import Blockchain from "./Blockchain";
import Node, { NodeConnection } from "./Node";
import dotenv from "dotenv";

dotenv.config();
const PORT = Number(process.env.PORT);
if (!PORT) throw new Error("Not specified port");

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

const node = new Node(coin, PORT);

process.argv.slice(2).forEach((otherPeerAddress) => {
  node.connect(otherPeerAddress).then((connection) => {
    node.discoverPeers(connection);
  });
});
