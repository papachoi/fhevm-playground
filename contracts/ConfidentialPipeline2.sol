// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract ConfidentialPipeline2 {
    function compute(euint64 x, euint64 y, euint64 z, euint64 w) external returns (euint64) {
        euint64 left  = TFHE.add(x, y);
        euint64 right = TFHE.add(z, w);
        return TFHE.mul(left, right);
    }
}
