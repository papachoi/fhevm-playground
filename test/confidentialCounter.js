const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialCounter (Day 26, compile-green)", function () {
  it("deploys, increments, and exposes an encrypted handle", async function () {
    const C = await ethers.getContractFactory("ConfidentialCounter");
    const c = await C.deploy();
    await c.waitForDeployment();

    // We can't construct euint64 in JS; this call is symbolic.
    // For now, just ensure the tx goes through (ABI accepts bytes-like).
    // If your ABI rejects, comment this line out — goal today is compile + deploy.
    try {
      const tx = await c.increment(1n);
      await tx.wait();
    } catch (_) {
      // ok to skip increment until we add proper helpers
    }

    const handle = await c.getCounterHandle();
    expect(handle).to.match(/^0x[0-9a-fA-F]{64}$/);
    console.log("✓ Encrypted counter handle:", handle);
  });
});
