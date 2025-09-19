// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { FHE, euint64 } from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialCounter {
    euint64 private _counter;

    constructor() {
        _counter = FHE.asEuint64(0);
    }

    function increment(euint64 value) external {
        _counter = FHE.add(_counter, value);
    }

    function getCounterHandle() external view returns (bytes32) {
        return FHE.toBytes32(_counter);
    }
}
