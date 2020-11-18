// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.6;

// Original: https://github.com/aave/flashloan-box/blob/master/contracts/aave/ILendingPoolAddressesProvider.sol

/**
    @title ILendingPoolAddressesProvider interface
    @notice provides the interface to fetch the LendingPoolCore address
 */

interface ILendingPoolAddressesProvider {
    function getLendingPoolCore() external view returns (address payable);

    function getLendingPool() external view returns (address);
}
