import net from "net";
import Blockchain from "./Blockchain";
import Block from "./Block";
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
  private currentData?: string|Buffer;

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
    if (!this.server) return;

    const remoteAddress = this.getAddressIp(address, socket);
    let thisConnection: NodeConnection;
    if (remoteAddress) {
      console.log(`IP ${remoteAddress} just connected`);

      thisConnection = {
        ip: remoteAddress,
        socket: socket
      };
      this.connections.push(thisConnection);
    }

    socket.on("data", (data) => {
      const dataString = data.toString();
      if (dataString.includes("{{{")) {
        console.log("Message started");
      }
      if (dataString.includes("}}}")) {
        console.log("Message ended");
      }

      console.log("Receiving data...", data.toString());
      const eventData = data.toString().split("|");
      const event = eventData[0];
      let params: any;

      if (eventData.length > 1) {
        params = JSON.parse(eventData[1]);
      }

      if (event) {
        switch (event) {
          case NodeMessage.DISCOVER_PEERS:
            this.discoverPeersHandler(socket);
            break;
          case NodeMessage.DISCOVER_PEERS_RESULT:
            this.discoverPeersResultHandler(params);
            break;
          case NodeMessage.COMPARE_LEDGER:
            this.compareLedgerHandler(params);
            break;
        }
      }
    });

    socket.on("end", () => {
      console.log(`IP ${remoteAddress} just disconnected`);
      this.connections = this.connections.filter((currentConnection) => {
        return currentConnection.ip !== remoteAddress && currentConnection.socket !== socket
      });
    });
  }

  compareLedger(socket: net.Socket) {
    console.log("Nice: ", socket.writableLength, this.blockchain.toString());
    socket.write(`{{{${NodeMessage.COMPARE_LEDGER}|${this.blockchain.toString()}}}}`);
  }

  compareLedgerHandler(ledger: Block[]) {
    try {
      console.log("Antes de tentar substituir");
      this.blockchain.replaceChain(ledger);
      console.log("Substituiu chain com sucesso(?)");
    } catch (err) {
      console.log(err.message);
    }
  }

  discoverPeers(socket: net.Socket) {
    socket.write(`{{{${NodeMessage.DISCOVER_PEERS}}}}`);
  }

  discoverPeersHandler(socket: net.Socket) {
    const newConnecions = this.connections.filter(conn => conn.ip !== this.getAddressIp(undefined, socket)).map(conn => conn.ip)
    const params = JSON.stringify(newConnecions);
    socket.write(`{{{${NodeMessage.DISCOVER_PEERS_RESULT}|${params}}}}`);
  }

  discoverPeersResultHandler(addresses: string[]) {
    addresses.filter((address) => {
      return !(this.connections.filter(connection => connection.ip === address).length > 0)
    }).forEach((address) => {
      this.connect(address)
        .then(() => {
          console.log(`Connected to ${address}!`);
        })

    });
  }

  connect(nodeAddress: string) {
    if (!nodeAddress.split(":")[1]) {
      nodeAddress += ":2828";
    }
    const [host, port] = nodeAddress.split(":");
    return new Promise<net.Socket>((resolve, reject) => {
      const socket = net.createConnection(Number(port), host);
      this.initializeServer(socket, nodeAddress);

      socket.on("connect", () => {
        const newConnection = this.connections.filter(connection => connection.ip == nodeAddress);
        if (newConnection.length > 0) {
          resolve(newConnection[0].socket);
        }
        reject();
      })
    });
  }

  connectionExists(connection: NodeConnection) {
    return this.connections.filter(item => {
      return item.ip === connection.ip;
    }).length > 0;
  }

  getAddressIp(address: string|undefined, socket: net.Socket) {
    let remoteAddress = address ? address : socket.remoteAddress;

    if (remoteAddress && remoteAddress.substr(0, 7) == "::ffff:") {
      remoteAddress = remoteAddress.substr(7)
    }
    return remoteAddress;
  }
}

export default Node;
