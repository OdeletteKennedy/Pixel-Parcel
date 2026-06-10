// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PixelParcel {
    mapping(address => uint256) public userPacks;
    mapping(address => uint256) public userSeals;
    mapping(address => uint256) public userSends;

    uint256 public totalPacks;
    uint256 public totalSeals;
    uint256 public totalSends;

    event BoxPacked(address indexed user, uint256 userPacks, uint256 totalPacks);
    event LabelSealed(address indexed user, uint256 userSeals, uint256 totalSeals);
    event ParcelSent(address indexed user, uint256 userSends, uint256 totalSends);

    function packBox() external {
        unchecked {
            userPacks[msg.sender] += 1;
            totalPacks += 1;
        }

        emit BoxPacked(msg.sender, userPacks[msg.sender], totalPacks);
    }

    function sealLabel() external {
        unchecked {
            userSeals[msg.sender] += 1;
            totalSeals += 1;
        }

        emit LabelSealed(msg.sender, userSeals[msg.sender], totalSeals);
    }

    function sendParcel() external {
        unchecked {
            userSends[msg.sender] += 1;
            totalSends += 1;
        }

        emit ParcelSent(msg.sender, userSends[msg.sender], totalSends);
    }
}
