import net from "net";
import Blockchain from "./Blockchain";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

class Node {
  public nodes: Node[];
  public blockchain: Blockchain;
  public server?: net.Server;
  public socket?: net.Socket;

  constructor(blockchain: Blockchain) {
    this.nodes = [];
    this.blockchain = blockchain;
    this.startServer();
  }

  startServer() {
    this.server = net.createServer((socket) => {
      console.log("Someone connected");
    });

    this.server.listen(PORT, () => {
      console.log(`Listening to ${PORT}`);
    });
  }

  connect(nodeAddress: string) {
    const [host, port] = nodeAddress.split(":");
    this.socket = net.createConnection(Number(port), host, () => {
      console.log(`Connect to ${host}:${port}`);
    });
  }
}

export default Node;
