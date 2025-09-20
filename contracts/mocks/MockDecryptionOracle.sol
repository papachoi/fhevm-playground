// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockDecryptionOracle {
    uint256 private _nextId = 1;
    uint64 public expectedPlaintext;

    function setExpectedPlaintext(uint64 v) external { expectedPlaintext = v; }

    function requestDecryption(
        bytes32[] calldata /*handles*/,
        address target,
        bytes4 callbackSelector
    ) external returns (uint256 requestId) {
        requestId = _nextId++;
        bytes;
        (bool ok, ) = target.call(
            abi.encodeWithSelector(callbackSelector, requestId, expectedPlaintext, sigs)
        );
        require(ok, "callback failed");
    }
}
