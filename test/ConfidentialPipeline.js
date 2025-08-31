const { expect } = require("chai");

describe("ConfidentialPipeline (stub)", function () {
  it("computes (x + y) * z", async function () {
    const Contract = await ethers.getContractFactory("ConfidentialPipeline");
    const cp = await Contract.deploy();
    await cp.waitForDeployment();

    const result = await cp.compute(2, 3, 4); // (2+3)*4 = 20
    expect(result).to.equal(20n);
  });
});
