# Blockchain concept in TypeScript
I'm doing this project just to learn some concepts of BlockChain and Tests. So, don't expect anything brilliant from here :)

## Objectives
- [x] Blocks;
- [x] BlockChain;
- [ ] Make the protocol works;
- [ ] Nodes discover other nodes on connect;
- [ ] Nodes validate and replace ledgers;
- [ ] Mine blockchain to create new transaction;
- [ ] Wallets using public and secret keys;
- [ ] Maybe learn about proof of stake;

## Node's protocol
- The socket messages will need to start with "{{{" and end using "}}}";
- All socket messages have the Event and the Parameters splitted by "|";
- The parameters are JSON encoded;

## Flow of Nodes
- Connect to the first node;
- Send via socket, discover peers;
- Receive list of nodes connecteds;
- Try to connect to each one;

## Flow of Nodes ledger verification
- Connect to the first node;
- Send via socket, compare ledgers;
- The node will verify the ledger validity and if is longer;
- If the ledger is longer and valid, will replace itself by the new one;
- Will send the same compare ledgers event to the connecteds;
