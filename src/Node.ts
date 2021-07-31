import net from "net";
import Blockchain from "./Blockchain";
import NodeMessage from "./NodeMessages";
import Block from "./Block";

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
  private currentData: string;

  constructor(blockchain: Blockchain, port: number) {
    this.blockchain = blockchain;
    this.connections = [];
    this.port = port;
    this.isRunning = false;
    this.currentData = "";
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
      this.processData(data.toString(), socket);
    });

    socket.on("end", () => {
      console.log(`IP ${remoteAddress} just disconnected`);
      this.connections = this.connections.filter((currentConnection) => {
        return currentConnection.ip !== remoteAddress && currentConnection.socket !== socket
      });
    });
  }

  processData(data: string, socket: net.Socket) {
    this.currentData += data;
    if (!(this.currentData.includes("$$"))) {
      return;
    }
    const message = this.currentData.slice(0, this.currentData.indexOf("$$"));
    this.currentData = this.currentData.substr(this.currentData.indexOf("$$") + 2);

    const eventData = message.split("|");
    const event = eventData[0];
    console.log("New event: ", event);
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
          this.compareLedgerHandler(params, socket);
          break;
        case NodeMessage.COMPARE_LEDGER_RESULT:
          this.compareLedgerResultHandler(params, socket);
          break;
      }
    }

    if (this.currentData.includes("$$")) this.processData(data, socket);
  }

  compareLedger(socket: net.Socket) {
    socket.write(`${NodeMessage.COMPARE_LEDGER}|${this.blockchain.toString()}$$`);
  }

  compareLedgerHandler(ledger: Blockchain, socket: net.Socket) {
    try {
      const blockchain = new Blockchain();
      blockchain.ledger = blockchain.restoreBlocks(ledger.ledger);
      this.blockchain.replaceChain(blockchain.ledger);
      console.log("Substituiu chain com sucesso");
      this.compareLedgerResult(socket, { success: true });
    } catch (err) {
      console.log(err.message);
      this.compareLedgerResult(socket, { success: false, ledger: this.blockchain.ledger });
    }
  }

  compareLedgerResult(socket: net.Socket, param: {success: boolean, ledger?: Block[]}) {
    socket.write(`${NodeMessage.COMPARE_LEDGER_RESULT}|${JSON.stringify(param)}$$`);
  }
  
  compareLedgerResultHandler(result: {success: boolean, ledger?: Block[]}, socket: net.Socket) {
    if (result.success) {
      console.log("Ledger replaced");
    } else {
      console.log("replacing this ledger");
      if (result.ledger) {
        try {
          const blockchain = new Blockchain();
          blockchain.ledger = blockchain.restoreBlocks(result.ledger);
          this.blockchain.replaceChain(blockchain.ledger);
          this.connections
            .filter(connection => connection.socket !== socket)
            .forEach(connection => this.compareLedger(connection.socket));
        } catch(err) {
          console.log(err);
        }
      }
    }
  }

  discoverPeers(socket: net.Socket) {
    socket.write(`${NodeMessage.DISCOVER_PEERS}$$`);
  }

  discoverPeersHandler(socket: net.Socket) {
    const newConnecions = this.connections.filter(conn => conn.ip !== this.getAddressIp(undefined, socket)).map(conn => conn.ip)
    socket.write(`${NodeMessage.DISCOVER_PEERS_RESULT}|${JSON.stringify(newConnecions)}$$`);
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

  getAddressIp(address: string | undefined, socket: net.Socket) {
    let remoteAddress = address ? address : socket.remoteAddress;

    if (remoteAddress && remoteAddress.substr(0, 7) == "::ffff:") {
      remoteAddress = remoteAddress.substr(7)
    }
    return remoteAddress;
  }
}

export default Node;
