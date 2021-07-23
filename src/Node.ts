import net from "net";
import Blockchain from "./Blockchain";
import NodeMessage from "./NodeMessages";

class Node {
  public nodes: { host: string; port: number }[];
  public connections: net.Socket[];
  public blockchain: Blockchain;
  public port: number;
  public isRunning: boolean;
  public server?: net.Server;

  constructor(blockchain: Blockchain, port: number) {
    this.nodes = [];
    this.connections = [];
    this.blockchain = blockchain;
    this.port = port;
    this.isRunning = false;
    this.startServer();
  }

  startServer() {
    this.server = net.createServer((socket) => {
      console.log("Someone connected: ", socket.address());
      if (!this.connections.indexOf(socket)) {
        this.connections.push(socket);
      }

      socket.on(NodeMessage.DISCOVER_PEERS, (data) => {
        console.log("Discover peers: ", data);
      });

      socket.on("end", () => {
        console.log("Someone disconnected");
        // this.nodes = this.nodes.filter((current) => current !== socket);
      });
    });

    this.isRunning = true;
    this.server.listen(this.port, () => {});
  }

  connect(nodeAddress: string) {
    const [host, port] = nodeAddress.split(":");
    return new Promise((resolve, reject) => {
      const socket = net.createConnection(Number(port), host, () => {
        resolve(`Connected to ${host}:${port}`);
      });
      if (socket) this.connections.push(socket);
    });
  }
}

export default Node;
