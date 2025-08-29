// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ---- Minimal local stub for demos (NOT real FHE). ----
type euint64 is uint64;
type ebool  is bool;

library FHE {
    function add(euint64 a, euint64 b) internal pure returns (euint64) {
        return euint64.wrap(euint64.unwrap(a) + euint64.unwrap(b));
    }
    function select(ebool cond, euint64 a, euint64 b) internal pure returns (euint64) {
        return ebool.unwrap(cond) ? a : b;
    }
    // Compare (a > b) -> encrypted bool (stubbed)
    function gt(euint64 a, euint64 b) internal pure returns (ebool) {
        return ebool.wrap(euint64.unwrap(a) > euint64.unwrap(b));
    }
}
