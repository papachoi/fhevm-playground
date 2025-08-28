const { expect } = require("chai");

describe("ConfidentialVoting (stub)", function () {
  it("increments A/B using select-like branching", async function () {
    const Contract = await ethers.getContractFactory("ConfidentialVoting");
    const cv = await Contract.deploy();
    await cv.waitForDeployment();

    await (await cv.vote(true)).wait();   // A:1, B:0
    await (await cv.vote(false)).wait();  // A:1, B:1
    await (await cv.vote(true)).wait();   // A:2, B:1

    expect(await cv.getAVotes()).to.equal(2n);
    expect(await cv.getBVotes()).to.equal(1n);
  });
});
