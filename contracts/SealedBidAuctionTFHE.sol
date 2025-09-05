// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "fhevm/lib/TFHE.sol";

/**
 * @title SealedBidAuctionTFHE
 * @notice Keeps an encrypted "highest" bid without revealing values.
 *         Winner tracking without unwrap requires a more advanced pattern;
 *         for Day 12 we track the encrypted highest only.
 */
contract SealedBidAuctionTFHE {
    mapping(address => euint64) private bids;
    euint64 private highest;

    event BidPlaced(address indexed bidder);

    function bid(euint64 amount) external {
        bids[msg.sender] = amount;

        // highest' = select(amount > highest, amount, highest)
        ebool gt = TFHE.gt(amount, highest);
        highest = TFHE.select(gt, amount, highest);

        emit BidPlaced(msg.sender);
    }

    function getMyBid() external view returns (euint64) { return bids[msg.sender]; }
    function getHighest() external view returns (euint64) { return highest; }
}
