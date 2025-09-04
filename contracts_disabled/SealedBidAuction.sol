// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

/**
 * @title SealedBidAuction (stub demo)
 * @notice Stores "encrypted" bids (as euint64 in our stub). Winner is highest bidder.
 *         Real FHEVM would use encrypted handles + proofs via the gateway/coprocessor.
 */
contract SealedBidAuction {
    mapping(address => euint64) private bids;
    euint64 private highest;
    address private winner;
    bool private closed;

    event BidPlaced(address indexed bidder);
    event Closed(address indexed by, address winner, uint64 highest);

    modifier notClosed() {
        require(!closed, "auction closed");
        _;
    }

    function bid(euint64 amount) external notClosed {
        bids[msg.sender] = amount;

        // if amount > highest: update highest and winner
        ebool isGreater = TFHE.gt(amount, highest);
        highest = TFHE.cmux(isGreater, amount, highest);
        if (ebool.unwrap(isGreater)) {
            winner = msg.sender;
        }
        emit BidPlaced(msg.sender);
    }

    function close() external notClosed {
        closed = true;
        emit Closed(msg.sender, winner, euint64.unwrap(highest));
    }

    // ---- demo getters (plaintext in stub) ----
    function getMyBid() external view returns (uint64) { return euint64.unwrap(bids[msg.sender]); }
    function getHighest() external view returns (uint64) { return euint64.unwrap(highest); }
    function getWinner() external view returns (address) { return winner; }
    function isClosed() external view returns (bool) { return closed; }
}
