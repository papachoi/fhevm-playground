// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./fhevm/lib/FHE.sol";

/**
 * @title ConfidentialPipeline (stub demo)
 * @notice Demonstrates (x + y) * z pipeline using stubbed FHE library.
 *         In real FHEVM, each step is on encrypted data.
 */
contract ConfidentialPipeline {
    function compute(euint64 x, euint64 y, euint64 z) external pure returns (euint64) {
        euint64 sum = FHE.add(x, y);
        return euint64.wrap(euint64.unwrap(sum) * euint64.unwrap(z));
    }
}
