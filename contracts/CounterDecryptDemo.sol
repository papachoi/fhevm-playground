// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IConfidentialCounter {
    function getCounterHandle() external view returns (bytes32);
}

interface IDecryptionOracle {
    function requestDecryption(
        bytes32[] calldata handles,
        address target,
        bytes4 callbackSelector
    ) external returns (uint256 requestId);
}

contract CounterDecryptDemo {
    IConfidentialCounter public counter;
    IDecryptionOracle public oracle;

    uint64 public lastDecrypted;

    event DecryptRequested(uint256 requestId, bytes32 handle);
    event DecryptFulfilled(uint256 requestId, uint64 plaintext);

    constructor(address counterAddr) {
        counter = IConfidentialCounter(counterAddr);
    }

    function setDecryptionOracle(address oracleAddr) external {
        oracle = IDecryptionOracle(oracleAddr);
    }

    function requestCounterDecryption() external returns (uint256) {
        bytes32 h = counter.getCounterHandle();
        bytes32;
        hs_[0] = h;

        uint256 reqId = oracle.requestDecryption(
            hs_,
            address(this),
            this.onDecryptedUint64.selector
        );

        emit DecryptRequested(reqId, h);
        return reqId;
    }

    function onDecryptedUint64(
        uint256 requestId,
        uint64 plaintext,
        bytes[] calldata /*signatures*/
    ) external {
        require(msg.sender == address(oracle), "not oracle");
        lastDecrypted = plaintext;
        emit DecryptFulfilled(requestId, plaintext);
    }
}
