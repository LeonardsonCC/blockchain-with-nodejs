import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Block, { BlockData } from "./Block";

const filePath = join(__dirname, "../tmp/chain");

class Blockchain {
  public ledger: Block[];
  public difficulty: number = 1;
  private useStoredLedger: boolean = false;

  constructor(useStoredLedger: boolean = false) {
    this.useStoredLedger = useStoredLedger;
    try {
      if (!this.useStoredLedger) {
        this.ledger = [this.startGenesisBlock()];
      } else {
        const oldLedger = JSON.parse(readFileSync(filePath).toString());
        this.ledger = oldLedger.ledger.map((block: Block) => {
          const newBlock = new Block(
            block.index,
            block.timestamp,
            block.data,
            block.precedingHash
          );
          newBlock.nonce = block.nonce;
          return newBlock;
        });
        this.difficulty = this.difficulty;
      }
    } catch (error) {
      this.ledger = [this.startGenesisBlock()];
    }
    this.saveChain();
  }

  startGenesisBlock() {
    return new Block(0, new Date().getTime(), {
      sender: "Leonardson",
      receiver: "Leonardson",
      amount: 0,
    });
  }

  obtainLatestBlock() {
    return this.ledger[this.ledger.length - 1] as Block;
  }

  addNewBlock(data: BlockData) {
    const index = this.ledger.length;
    const newBlock = new Block(index, new Date().getTime(), data);
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    newBlock.proofOfWork(this.difficulty);
    this.ledger.push(newBlock);
    if (this.checkChainValidity()) this.saveChain();
  }

  checkChainValidity() {
    for (let i = 1; i < this.ledger.length; i++) {
      const currentBlock = this.ledger[i];
      const precedingBlock = this.ledger[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }

  saveChain() {
    if (this.useStoredLedger) {
      console.log("saving...");
      writeFileSync(filePath, this.toString());
    }
  }

  toString() {
    return JSON.stringify(this, null, 4);
  }
}

export default Blockchain;
