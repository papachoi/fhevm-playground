// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract ConfidentialPipeline {
    function compute(euint64 x, euint64 y, euint64 z) external returns (euint64) {
        euint64 sum = TFHE.add(x, y);
        return TFHE.mul(sum, z);
    }
}
