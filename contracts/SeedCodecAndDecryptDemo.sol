// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { FHE, euint64 } from "@fhevm/solidity/lib/FHE.sol";

interface IDecryptionOracle {
    function requestDecryption(
        bytes32[] calldata handles,
        address target,
        bytes4 callbackSelector
    ) external returns (uint256 requestId);
}

contract SeedCodecAndDecryptDemo {
    IDecryptionOracle public oracle;
    uint64 public lastDecrypted; // for verification

    event DecryptRequested(uint256 requestId, bytes32 handle);
    event DecryptFulfilled(uint256 requestId, uint64 plaintext);

    function setDecryptionOracle(address oracleAddr) external {
        oracle = IDecryptionOracle(oracleAddr);
    }

    /// FHE "encode": cipher = plain + seed; "decode": plain2 = cipher - seed (all on euint64).
    /// Then request decryption of the decoded handle (mock oracle will call back).
    function encodeDecodeAndRequest(uint64 plain, uint64 seed) external returns (uint256) {
        euint64 p = FHE.asEuint64(plain);
        euint64 s = FHE.asEuint64(seed);

        euint64 cipher = FHE.add(p, s);     // encode
        euint64 plain2 = FHE.sub(cipher, s); // decode

        bytes32 h = FHE.toBytes32(plain2);
        bytes32;
        hs[0] = h;

        uint256 reqId = oracle.requestDecryption(
            hs,
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
