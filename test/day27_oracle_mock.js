const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Day 27 — Mock oracle decrypt callback", function () {
  it("requests decryption and receives plaintext via callback", async function () {
    // Reuse your Day 26 counter (must already exist in contracts/)
    const Counter = await ethers.getContractFactory("ConfidentialCounter");
    const counter = await Counter.deploy();
    await counter.waitForDeployment();

    // Make counter non-zero using incPlain (added in Day 26; if missing, comment these two lines)
    try {
      await (await counter.incPlain(5)).wait();
      await (await counter.incPlain(7)).wait(); // total intended = 12
    } catch (_) {
      // If incPlain doesn't exist yet, it's fine; demo focuses on oracle callback.
    }

    // Deploy mock oracle
    const Mock = await ethers.getContractFactory("MockDecryptionOracle");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();

    // Deploy demo and set oracle
    const Demo = await ethers.getContractFactory("CounterDecryptDemo");
    const demo = await Demo.deploy(await counter.getAddress());
    await demo.waitForDeployment();
    await (await demo.setDecryptionOracle(await mock.getAddress())).wait();

    // Tell mock what plaintext to "return"
    await (await mock.setExpectedPlaintext(12)).wait();

    // Request decryption; mock instantly calls back
    await (await demo.requestCounterDecryption()).wait();

    // Verify stored plaintext
    const got = await demo.lastDecrypted();
    expect(got).to.equal(12n);
    console.log("✓ Day 27: decrypted counter =", got.toString());
  });
});
