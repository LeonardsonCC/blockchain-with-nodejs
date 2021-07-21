import { generateKeyPair, KeyObject } from "crypto";
import { v4 } from "uuid";

class Wallet {
  public address: string;
  public secret: string;

  constructor(passphrase: string) {
    this.address = v4();
    this.secret = passphrase;
  }
}

export default Wallet;
