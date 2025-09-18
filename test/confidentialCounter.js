const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialCounter (Day 25)", function () {
  it("increments with plaintext (contract encrypts under the hood)", async function () {
    const C = await ethers.getContractFactory("ConfidentialCounter");
    const c = await C.deploy();
    await c.waitForDeployment();

    // Increment 3 times using plaintext helper
    await (await c.incPlain(5)).wait();
    await (await c.incPlain(7)).wait();
    await (await c.incPlain(11)).wait();

    const handle = await c.getCounterHandle();
    expect(handle).to.match(/^0x[0-9a-fA-F]{64}$/);

    console.log("✓ Encrypted counter handle:", handle);
    console.log("  (Use this handle for user/public decryption flows in your app)");
  });

  it("increments with an encrypted-style parameter (demo)", async function () {
    const C = await ethers.getContractFactory("ConfidentialCounter");
    const c = await C.deploy();
    await c.waitForDeployment();

    // For a full external-input flow you would pass an external handle + attestation.
    // In local dev we simulate by creating an encrypted value inside the contract:
    //   - We can't call FHE.asEuint64 from JavaScript, so use incPlain first
    await (await c.incPlain(42)).wait();

    const handle = await c.getCounterHandle();
    expect(handle).to.match(/^0x[0-9a-fA-F]{64}$/);
    console.log("✓ After incPlain(42), handle:", handle);
  });
});
