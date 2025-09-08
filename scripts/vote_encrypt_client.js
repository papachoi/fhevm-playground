/**
 * Day 15 — Client encryption prototype.
 *
 * Modes:
 *   MODE=MOCK  -> calls vote(true, 1) so you can see the flow on localhost today.
 *   MODE=REAL  -> attempts to encrypt with @zama-fhevm/sdk (if configured), else falls back to MOCK with a warning.
 *
 * Usage:
 *   CONTRACT=0x... MODE=MOCK  npx hardhat run scripts/vote_encrypt_client.js --network localhost
 *   CONTRACT=0x... MODE=REAL  npx hardhat run scripts/vote_encrypt_client.js --network sepolia   (later)
 */

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const contractAddr = process.env.CONTRACT || process.argv[2];
  const MODE = (process.env.MODE || "MOCK").toUpperCase();

  if (!contractAddr) {
    console.error("Usage: CONTRACT=0x... MODE=MOCK|REAL  npx hardhat run scripts/vote_encrypt_client.js --network <net>");
    process.exit(1);
  }

  const [signer] = await hre.ethers.getSigners();

  const abi = [
    "function vote(ebool voteForA, euint64 inc) external",
    "function getAVotes() external view returns (euint64)",
    "function getBVotes() external view returns (euint64)",
  ];
  const voting = new hre.ethers.Contract(contractAddr, abi, signer);

  let voteForA, inc;

  if (MODE === "REAL") {
    try {
      // Lazy-load the SDK; install later with:
      //   npm install @zama-fhevm/sdk
      const sdk = require("@zama-fhevm/sdk");

      const gatewayUrl = process.env.GATEWAY_URL;
      const pubKey = process.env.FHE_NETWORK_PUBKEY;

      if (!gatewayUrl || !pubKey) {
        console.warn("[REAL] Missing GATEWAY_URL or FHE_NETWORK_PUBKEY – falling back to MOCK inputs.");
        throw new Error("Missing REAL settings");
      }

      // NOTE: The exact API names can vary by SDK version.
      // Replace the next 2 lines with the real encrypt calls from the SDK you install.
      // Examples to adapt:
      //   const voteForA_ct = await sdk.encryptBool(true, pubKey);
      //   const one_ct      = await sdk.encryptUint64(1n, pubKey);
      //   voteForA = voteForA_ct;
      //   inc      = one_ct;

      throw new Error("Replace with actual @zama-fhevm/sdk encrypt calls.");

    } catch (e) {
      console.warn(`[REAL] Encryption not configured/available: ${e.message}`);
      console.warn("[REAL] Using MOCK placeholders so you can test the call shape today.");
      voteForA = true;   // placeholder; real flow will pass ciphertext
      inc      = 1n;     // placeholder; real flow will pass ciphertext
    }
  } else {
    // MODE=MOCK (default): immediate, works on localhost
    voteForA = true;
    inc      = 1n;
  }

  console.log(`→ vote(voteForA=${voteForA}, inc=${inc}) [MODE=${MODE}] …`);
  try {
    const tx = await voting.vote(voteForA, inc);
    const receipt = await tx.wait();
    console.log("✓ tx mined:", receipt.hash);
  } catch (err) {
    console.warn("! vote() reverted (expected if contract enforces ciphertext checks):", err.message);
  }

  try {
    const a = await voting.getAVotes();
    const b = await voting.getBVotes();
    console.log("getAVotes():", a.toString ? a.toString() : a);
    console.log("getBVotes():", b.toString ? b.toString() : b);
  } catch (err) {
    console.warn("! reading tallies may require decryption pipeline:", err.message);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
