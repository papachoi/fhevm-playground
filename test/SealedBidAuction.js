const { expect } = require("chai");

describe("SealedBidAuction (stub)", function () {
  it("selects the highest bid and winner; blocks after close", async function () {
    const [a0, a1, a2] = await ethers.getSigners();

    const Auction = await ethers.getContractFactory("SealedBidAuction");
    const auc = await Auction.deploy();
    await auc.waitForDeployment();

    // Helper to encode our "encrypted" uint as euint64 (stub uses raw uint64)
    const toEnc = (n) => n; // in stub we just pass a JS number (Hardhat encodes to uint)

    // bids: a0=3, a1=5, a2=4  -> winner = a1, highest=5
    await (await auc.connect(a0).bid(toEnc(3))).wait();
    await (await auc.connect(a1).bid(toEnc(5))).wait();
    await (await auc.connect(a2).bid(toEnc(4))).wait();

    expect(await auc.getHighest()).to.equal(5n);
    expect(await auc.getWinner()).to.equal(a1.address);

    await (await auc.close()).wait();
    expect(await auc.isClosed()).to.equal(true);

    // further bids should fail
    await expect(auc.connect(a0).bid(toEnc(6))).to.be.revertedWith("auction closed");
  });
});
