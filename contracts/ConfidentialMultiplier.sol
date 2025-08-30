// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./fhevm/lib/FHE.sol";

/**
 * @title ConfidentialMultiplier (stub demo)
 * @notice Multiplies two euint64 numbers. Real FHEVM would handle encrypted inputs.
 */
contract ConfidentialMultiplier {
    function multiply(euint64 x, euint64 y) external pure returns (euint64) {
        // stub: just multiply the unwrapped values
        return euint64.wrap(euint64.unwrap(x) * euint64.unwrap(y));
    }
}
