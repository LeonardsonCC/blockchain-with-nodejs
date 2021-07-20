import SHA256 from "crypto-js/sha256";

export interface BlockData {
  sender: string;
  receiver: string;
  amount: number;
}

class CryptoBlock {
  private index: number;
  public timestamp: number;
  public data: BlockData;
  public precedingHash: string;
  public hash: string;
  private nonce: number;

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
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
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

export default CryptoBlock;
