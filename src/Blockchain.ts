import Block, { BlockData } from "./Block";

class Blockchain {
  public blockchain: Block[];
  public difficulty: number = 1;

  constructor() {
    this.blockchain = [this.startGenesisBlock()];
  }

  startGenesisBlock() {
    return new Block(1, new Date().getTime(), {
      sender: "Leonardson",
      receiver: "Leonardson",
      amount: 0,
    });
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1] as Block;
  }

  addNewBlock(data: BlockData) {
    const index = this.blockchain.length;
    const newBlock = new Block(index, new Date().getTime(), data);
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }

  debug() {
    return JSON.stringify(this, null, 4);
  }
}

export default Blockchain;
