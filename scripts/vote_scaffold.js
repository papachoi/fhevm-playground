/**
 * Day 13 scaffold:
 * - Reads contract address from CLI env/arg
 * - Prepares call shape for vote(ebool, euint64)
 * - NOTE: Real call requires encrypting inputs with fhEVM client SDK
 */

const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = process.env.CONTRACT || process.argv[2];
  if (!address) {
    console.error("Usage: CONTRACT=0x... npx hardhat run scripts/vote_scaffold.js --network localhost");
    process.exit(1);
  }

  const abi = [
    "function vote(ebool voteForA, euint64 inc) external",
    "function getAVotes() external view returns (euint64)",
    "function getBVotes() external view returns (euint64)"
  ];
  const c = new hre.ethers.Contract(address, abi, signer);

  // PLACEHOLDERS — will be replaced by encrypted values from client SDK:
  // In Solidity ABI, user-defined value types encode as their underlying types.
  // Here: ebool -> bool, euint64 -> uint64. This is NOT real encryption.
  const voteForA_placeholder = true;       // TODO: replace with encrypted ebool
  const inc_placeholder = 1n;              // TODO: replace with encrypted euint64

  console.log("Calling vote(...) with placeholder values (no real encryption)...");
  try {
    const tx = await c.vote(voteForA_placeholder, inc_placeholder);
    await tx.wait();
    console.log("tx mined:", tx.hash);
  } catch (e) {
    console.warn("Expected to revert if contract enforces encryption:", e.message);
  }

  // Reading back encrypted tallies will return ciphertext handles in the real flow.
  try {
    const a = await c.getAVotes();
    const b = await c.getBVotes();
    console.log("Raw getAVotes():", a);
    console.log("Raw getBVotes():", b);
  } catch (e) {
    console.warn("Reads may require decryption flow:", e.message);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
