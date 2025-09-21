const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Day 28 — FHE seed encoder/decoder (mock decrypt)", function () {
  it("encodes, decodes, and receives original plaintext via callback", async function () {
    const Mock = await ethers.getContractFactory("MockDecryptionOracle");
    const mock = await Mock.deploy();
    await mock.waitForDeployment();

    const Demo = await ethers.getContractFactory("SeedCodecAndDecryptDemo");
    const demo = await Demo.deploy();
    await demo.waitForDeployment();
    await (await demo.setDecryptionOracle(await mock.getAddress())).wait();

    const plain = 42;
    const seed  = 1337;

    await (await mock.setExpectedPlaintext(plain)).wait(); // expect decoded == 42
    await (await demo.encodeDecodeAndRequest(plain, seed)).wait();

    const got = await demo.lastDecrypted();
    expect(got).to.equal(BigInt(plain));
    console.log("✓ Day 28: round-trip decrypted =", got.toString());
  });
});
