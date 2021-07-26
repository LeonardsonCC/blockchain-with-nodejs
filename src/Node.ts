import net from "net";
import Blockchain from "./Blockchain";
import NodeMessage from "./NodeMessages";

export interface NodeConnection {
  ip: string;
  socket: net.Socket;
}

class Node {
  public connections: NodeConnection[];
  public blockchain: Blockchain;
  public port: number;
  public isRunning: boolean;
  public server?: net.Server;

  constructor(blockchain: Blockchain, port: number) {
    this.blockchain = blockchain;
    this.connections = [];
    this.port = port;
    this.isRunning = false;
    this.startServer();
  }

  startServer() {
    this.server = net.createServer((socket) => this.initializeServer(socket));

    this.isRunning = true;
    this.server.listen(this.port, () => { });
  }

  initializeServer(socket: net.Socket, address?: string) {
    let remoteAddress = address ? address : socket.remoteAddress;
  
    if (remoteAddress && remoteAddress.substr(0, 7) == "::ffff:") {
      remoteAddress = remoteAddress.substr(7)
    }
    if (remoteAddress) {
      console.log(`IP ${remoteAddress} just connected`);

      this.connections.push({
        ip: remoteAddress,
        socket: socket
      });
    }

    //console.log("Connections: ", this.connections);

    socket.on(NodeMessage.DISCOVER_PEERS, () => {
      socket.emit(NodeMessage.DISCOVER_PEERS_RESULT, this.connections.map(connection => connection.ip));
    });

    socket.on(NodeMessage.DISCOVER_PEERS_RESULT, (newPeers: string[]) => {
      console.log("Discovered: ", newPeers);
      newPeers = newPeers.filter((peer) => {
        for (const connection of this.connections) {
          if (peer === connection.ip) return false;
        }
        return true;
      });

      newPeers.forEach((peer) => {
        this.connect(peer)
          .then((data) => {
            console.log("Discovered with success: ", data);
          })
      })
    });

    socket.on("end", () => {
      console.log(`IP ${remoteAddress} just disconnected`);
      this.connections = this.connections.filter((currentConnection) => {
        return currentConnection.ip !== remoteAddress && currentConnection.socket !== socket
      });
    });
  }

  discoverPeers(connection: NodeConnection) {
    console.log("Tryinh to discover :)", connection.ip);
    if (this.connectionExists(connection)) {
      const { socket } = connection;
      socket.emit(NodeMessage.DISCOVER_PEERS);
    }
  }

  connect(nodeAddress: string) {
    if (!nodeAddress.split(":")[1]) {
      nodeAddress += ":2828";
    }
    const [host, port] = nodeAddress.split(":");
    return new Promise<NodeConnection>((resolve, reject) => {
      const socket = net.createConnection(Number(port), host);
      this.initializeServer(socket, nodeAddress);
    });
  }

  connectionExists(connection: NodeConnection) {
    return this.connections.filter(item => {
      return item.ip === connection.ip;
    }).length > 0;
  }
}

export default Node;
