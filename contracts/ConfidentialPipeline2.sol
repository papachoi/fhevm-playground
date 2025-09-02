// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./fhevm/lib/FHE.sol";

contract ConfidentialPipeline2 {
    function compute(euint64 x, euint64 y, euint64 z, euint64 w)
        external pure returns (euint64)
    {
        euint64 left  = FHE.add(x, y);
        euint64 right = FHE.add(z, w);
        return euint64.wrap(euint64.unwrap(left) * euint64.unwrap(right));
    }
}
