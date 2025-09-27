// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

contract EncryptedMax {
    function max2(euint64 a, euint64 b) public returns (euint64) {
        return TFHE.select(TFHE.gt(a, b), a, b);
    }

    function max4(euint64 a, euint64 b, euint64 c, euint64 d) external returns (euint64) {
        euint64 ab = max2(a, b);
        euint64 cd = max2(c, d);
        return max2(ab, cd);
    }
}
