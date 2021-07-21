import Wallet from "../src/Wallet";
import Blockchain from "../src/Blockchain";

describe("Wallet suite case", () => {
  it("should instantiate new wallet", () => {
    const newWallet = new Wallet("super secret key");

    expect(newWallet.secret).not.toBe("");
  });

  it("should make an transaction", () => {
    const ledger = new Blockchain();
    const newWallet = new Wallet("super secret key");
    const newWalletTwo = new Wallet("another secret key");
  });
});
