// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ---- Minimal local stub for compiling demos (NOT real FHE). ----
type euint64 is uint64;
type ebool  is bool;

library FHE {
    function add(euint64 a, euint64 b) internal pure returns (euint64) {
        return euint64.wrap(euint64.unwrap(a) + euint64.unwrap(b));
    }

    // Use ebool.unwrap(cond) to convert to plain bool for branching
    function select(ebool cond, euint64 a, euint64 b) internal pure returns (euint64) {
        return ebool.unwrap(cond) ? a : b;
    }
}
