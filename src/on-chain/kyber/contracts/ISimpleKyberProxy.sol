// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.12;

// Original: https://github.com/KyberNetwork/smart-contracts/blob/master/contracts/sol6/ISimpleKyberProxy.sol

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
 * @title simple Kyber Network proxy interface
 * add convenient functions to help with kyber proxy API
 */
interface ISimpleKyberProxy {
    function swapTokenToEther(
        IERC20 token,
        uint256 srcAmount,
        uint256 minConversionRate
    ) external returns (uint256 destAmount);

    function swapEtherToToken(IERC20 token, uint256 minConversionRate)
        external
        payable
        returns (uint256 destAmount);

    function swapTokenToToken(
        IERC20 src,
        uint256 srcAmount,
        IERC20 dest,
        uint256 minConversionRate
    ) external returns (uint256 destAmount);
}
