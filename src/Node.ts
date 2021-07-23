import net from "net";
import Blockchain from "./Blockchain";

class Node {
  public nodes: Node[];
  public blockchain: Blockchain;
  public port: number;
  public server?: net.Server;
  public socket?: net.Socket;

  constructor(blockchain: Blockchain, port: number) {
    this.nodes = [];
    this.blockchain = blockchain;
    this.port = port;
    this.startServer();
  }

  startServer() {
    this.server = net.createServer((socket) => {
      console.log("Someone connected");
    });

    this.server.listen(this.port, () => {
      console.log(`Listening to ${this.port}`);
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
