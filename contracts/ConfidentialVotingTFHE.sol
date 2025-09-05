// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

/**
 * @title ConfidentialVotingTFHE
 * @notice A/B voting using fully-encrypted branching. No plaintext unwraps.
 *         NOTE: This is compile-only without a client that encrypts inputs.
 */
contract ConfidentialVotingTFHE {
    euint64 private aVotes;
    euint64 private bVotes;

    /**
     * @dev Record one encrypted vote.
     * @param voteForA  Encrypted boolean: true => vote A, false => vote B
     * @param inc       Encrypted increment (typically an encrypted 1)
     *
     * We cannot unwrap ebool, so we express branching via TFHE.select:
     *   a' = select(voteForA, a + inc, a)
     *   b' = select(voteForA, b,       b + inc)
     */
    function vote(ebool voteForA, euint64 inc) external {
        euint64 nextA = TFHE.select(voteForA, TFHE.add(aVotes, inc), aVotes);
        euint64 nextB = TFHE.select(voteForA, bVotes, TFHE.add(bVotes, inc));
        aVotes = nextA;
        bVotes = nextB;
    }

    // Expose encrypted tallies (client/gateway would handle decryption off-chain)
    function getAVotes() external view returns (euint64) { return aVotes; }
    function getBVotes() external view returns (euint64) { return bVotes; }
}
