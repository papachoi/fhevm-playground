const { expect } = require("chai");

describe("EncryptedMax (stub)", function () {
  it("returns max2 and max4 correctly", async function () {
    const C = await ethers.getContractFactory("EncryptedMax");
    const c = await C.deploy();
    await c.waitForDeployment();
    expect(await c.max2(7, 11)).to.equal(11n);
    expect(await c.max4(7, 11, 5, 9)).to.equal(11n);
    expect(await c.max4(1, 2, 20, 3)).to.equal(20n);
  });
});
