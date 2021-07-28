import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Block, { BlockData } from "./Block";

let filePath = join(__dirname, "../tmp/chain");
export const setFilePath = (newPath: string) => (filePath = newPath);

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
          const newBlock = Object.create(
            Block.prototype,
            Object.getOwnPropertyDescriptors(block)
          );
          return newBlock;
        });
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

  checkChainValidity(newLedger: Block[] = this.ledger) {
    const ledger = newLedger;
    for (let i = 1; i < ledger.length; i++) {
      const currentBlock = ledger[i];
      const precedingBlock = ledger[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        console.log("COMPARING: ", currentBlock, precedingBlock);
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }

  saveChain() {
    if (this.useStoredLedger) {
      writeFileSync(filePath, this.toString());
    }
  }

  isChainLonger(newLedger: Block[]) {
    return newLedger.length > this.ledger.length;
  }

  replaceChain(newLedger: Block[]) {
    if (!this.checkChainValidity(newLedger)) throw new Error("Error: Invalid chain");
    if (!this.isChainLonger(newLedger)) throw new Error("Error: Chain is not longer")

    this.ledger = newLedger;
    this.saveChain();
  }

  toString() {
    return JSON.stringify(
      Object.assign({}, this, { useStoredLedger: undefined }),
      null,
      4
    );
  }
}

export default Blockchain;
