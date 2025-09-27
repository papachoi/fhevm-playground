const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialAdder (Day 24)", function () {
  it("should deploy and call add()", async function () {
    const C = await ethers.getContractFactory("ConfidentialAdder");
    const c = await C.deploy();
    await c.waitForDeployment();

    // Using plain numbers as stand-in for euint64
    const tx = await c.addEncrypted(5n, 7n);
    const rc = await tx.wait();
    expect(rc.status).to.equal(1);

    console.log("✓ ConfidentialAdder.addEncrypted(5,7) mined at", rc.hash);
  });
});
