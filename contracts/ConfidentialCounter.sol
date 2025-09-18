// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// NOTE: This import path should match your repo setup.
// If your other contracts import the FHE lib via a different path,
// copy that same import here.
import {FHE, euint64, ebool} from "./FHE.sol";

contract ConfidentialCounter {
    // Encrypted counter state
    euint64 private _counter;

    // Simple event to show that an encrypted update happened
    event CounterUpdated(bytes32 counterHandle);

    constructor() {
        // Start at 0 (encrypted)
        _counter = FHE.asEuint64(0);
        // Persist access for this contract so we can reuse it next tx
        FHE.allow(_counter, address(this));
    }

    /// @notice Increment by an encrypted delta (preferred path).
    /// Caller must have transient/persistent access to `delta`.
    function inc(euint64 delta) external {
        // Ensure caller is actually allowed to pass this handle
        require(FHE.isSenderAllowed(delta), "no access to delta");

        // _counter = _counter + delta
        _counter = FHE.add(_counter, delta);

        // Keep contract access for future operations
        FHE.allow(_counter, address(this));
        // Let caller decrypt the updated value off-chain if they want
        FHE.allow(_counter, msg.sender);

        emit CounterUpdated(FHE.toBytes32(_counter));
    }

    /// @notice Convenience method for local dev: provide a plaintext number,
    /// we encrypt it inside and call the encrypted path.
    function incPlain(uint64 delta) external {
        euint64 d = FHE.asEuint64(delta);
        // Grant this contract transient access to use `d` in this tx
        FHE.allowTransient(d, address(this));
        inc(d);
    }

    /// @notice Return the handle (bytes32) of the encrypted counter.
    /// Useful so tests/frontends can request decryption off-chain.
    function getCounterHandle() external view returns (bytes32) {
        return FHE.toBytes32(_counter);
    }
}
