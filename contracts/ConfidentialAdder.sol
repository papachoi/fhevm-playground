// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./fhevm/lib/FHE.sol";

contract ConfidentialAdder {
    // add two encrypted uint64 values and return handle
    function addEncrypted(
        euint64 x,
        euint64 y
    ) public returns (euint64) {
        return FHE.add(x, y);
    }
}

