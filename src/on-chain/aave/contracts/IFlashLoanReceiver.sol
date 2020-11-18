// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.6;

// Original: https://github.com/aave/flashloan-box/blob/master/contracts/aave/IFlashLoanReceiver.sol

/**
 * @title IFlashLoanReceiver interface
 * @notice Interface for the Aave fee IFlashLoanReceiver.
 * @author Aave
 * @dev implement this interface to develop a flashloan-compatible flashLoanReceiver contract
 **/
interface IFlashLoanReceiver {
    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    ) external;
}
