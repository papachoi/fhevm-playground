const { expect } = require("chai");

describe("ConfidentialMultiplier (stub)", function () {
  it("multiplies two numbers", async function () {
    const Contract = await ethers.getContractFactory("ConfidentialMultiplier");
    const cm = await Contract.deploy();
    await cm.waitForDeployment();

    // In stub, pass plain numbers as euint64
    const result = await cm.multiply(3, 4);
    expect(result).to.equal(12n);
  });
});
