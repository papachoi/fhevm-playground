const { expect } = require("chai");

describe("ConfidentialPipeline2 (stub)", function () {
  it("computes (x+y)*(z+w)", async function () {
    const C = await ethers.getContractFactory("ConfidentialPipeline2");
    const c = await C.deploy();
    await c.waitForDeployment();
    expect(await c.compute(2, 3, 4, 5)).to.equal(45n); // (2+3)*(4+5)
  });
});
