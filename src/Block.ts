import crypto from "crypto";

export interface BlockData {
  sender: string;
  receiver: string;
  amount: number;
}

class Block {
  public index: number;
  public timestamp: number;
  public data: BlockData;
  public precedingHash: string;
  public hash: string;
  public nonce: number;

  constructor(
    index: number,
    timestamp: number,
    data: BlockData,
    precedingHash: string = ""
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.nonce = 0;
    this.hash = this.computeHash();
  }

  computeHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          this.precedingHash +
          JSON.stringify(this.data) +
          this.nonce
      )
      .digest("hex");
  }

  proofOfWork(difficulty: number) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

export default Block;
