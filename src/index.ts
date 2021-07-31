import Blockchain from "./Blockchain";
import Node, { NodeConnection } from "./Node";
import dotenv from "dotenv";

dotenv.config();
const PORT = Number(process.env.PORT);
if (!PORT) throw new Error("Not specified port");

let coin = new Blockchain(true);
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
coin.addNewBlock({
  sender: "Nice",
  receiver: "Show de bola",
  amount: 1,
});

let node: Node;
if (process.argv.length > 3) {
  node = new Node(coin, Number(process.argv[2]));
  process.argv.slice(3).forEach((otherPeerAddress) => {
    node.connect(otherPeerAddress).then((connection) => {
      node.connections.forEach((connection) => {
        console.log(connection.ip);
        node.discoverPeers(connection.socket);
        node.compareLedger(connection.socket);
      })
    });
  });
} else {
  node = new Node(coin, PORT);
  process.argv.slice(2).forEach((otherPeerAddress) => {
    node.connect(otherPeerAddress).then((connection) => {
      node.connections.forEach((connection) => {
        console.log(connection.ip);
        node.discoverPeers(connection.socket);
        node.compareLedger(connection.socket);
      })
    });
  });
}

