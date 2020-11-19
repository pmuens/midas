// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../on-chain/dydx/contracts/ICallee.sol";
import "../on-chain/dydx/contracts/DyDxFlashLoanBase.sol";
import "../on-chain/uniswap-v2/contracts/IUniswapV2Router02.sol";
import "../on-chain/kyber/contracts/IKyberNetworkProxy.sol";
import "../on-chain/kyber/contracts/ISimpleKyberProxy.sol";

// solhint-disable-next-line no-empty-blocks
abstract contract KyberNetworkProxy is IKyberNetworkProxy, ISimpleKyberProxy {

}

contract DyDxFlashLoan is ICallee, DyDxFlashLoanBase {
    enum Direction { KyberToUniswapV2, UniswapV2ToKyber }

    struct Context {
        address beneficiar;
        Direction direction;
    }

    struct Params {
        address beneficiar;
        Direction direction;
        address assetA;
        address assetB;
        uint256 amount;
        uint256 repayAmount;
    }

    address private _soloMargin;
    address private _kyber;
    address private _uniswapV2;

    constructor(
        address soloMargin,
        address kyber,
        address uniswapV2
    ) public {
        _soloMargin = soloMargin;
        _kyber = kyber;
        _uniswapV2 = uniswapV2;
    }

    // External function which kick-starts the Flash Loan process
    function initFlashLoan(
        bytes calldata context,
        address assetA, // The asset we're about to borrow
        address assetB,
        uint256 amount
    ) external {
        ISoloMargin soloMargin = ISoloMargin(_soloMargin);

        uint256 marketId = _getMarketIdFromTokenAddress(_soloMargin, assetA);

        uint256 repayAmount = _getRepaymentAmountInternal(amount);
        ERC20(assetA).approve(_soloMargin, repayAmount);

        // Create params for callback function
        Context memory ctx = abi.decode(context, (Context));
        bytes memory params =
            abi.encode(
                Params(
                    ctx.beneficiar,
                    ctx.direction,
                    assetA,
                    assetB,
                    amount,
                    repayAmount
                )
            );
        // 1. Withdraw
        // 2. Call `callFunction` (the callback function)
        // 3. Deposit
        Actions.ActionArgs[] memory operations = new Actions.ActionArgs[](3);
        operations[0] = _getWithdrawAction(marketId, amount);
        operations[1] = _getCallAction(params);
        operations[2] = _getDepositAction(marketId, repayAmount);
        Account.Info[] memory accountInfos = new Account.Info[](1);
        accountInfos[0] = _getAccountInfo();
        soloMargin.operate(accountInfos, operations);
    }

    function callFunction(
        address,
        Account.Info memory,
        bytes memory _params
    ) public override {
        Params memory params = abi.decode(_params, (Params));

        ERC20 assetA = ERC20(params.assetA);
        ERC20 assetB = ERC20(params.assetB);

        KyberNetworkProxy kyber = KyberNetworkProxy(_kyber);
        IUniswapV2Router02 uniswapV2 = IUniswapV2Router02(_uniswapV2);

        if (params.direction == Direction.KyberToUniswapV2) {
            // Buy Asset B via Asset A on Kyber
            require(
                assetA.approve(address(kyber), params.amount),
                "Could not approve Asset A sell on Kyber..."
            );
            (uint256 x, ) =
                kyber.getExpectedRate(assetA, assetB, params.amount);
            kyber.swapTokenToToken(assetA, params.amount, assetB, x);
            uint256 assetBBalance = assetB.balanceOf(address(this));

            // Sell Asset B on Uniswap v2 for Asset A
            require(
                assetB.approve(address(uniswapV2), assetBBalance),
                "Could not approve Asset B sell on Uniswap V2..."
            );
            address[] memory path = new address[](2);
            path[0] = address(assetB);
            path[1] = address(assetA);
            uint256[] memory minOuts =
                uniswapV2.getAmountsOut(assetBBalance, path);
            uniswapV2.swapExactTokensForTokens(
                assetBBalance,
                minOuts[1],
                path,
                address(this),
                now + 3000 // solhint-disable-line not-rely-on-time
            );
        } else {
            // Buy Asset B via Asset A on Uniswap v2
            require(
                assetA.approve(address(uniswapV2), params.amount),
                "Could not approve Asset A sell on Uniswap V2..."
            );
            address[] memory path = new address[](2);
            path[0] = address(assetA);
            path[1] = address(assetB);
            uint256[] memory minOuts =
                uniswapV2.getAmountsOut(params.amount, path);
            uniswapV2.swapExactTokensForTokens(
                params.amount,
                minOuts[1],
                path,
                address(this),
                now + 3000 // solhint-disable-line not-rely-on-time
            );
            uint256 assetBBalance = assetB.balanceOf(address(this));

            // Sell Asset B on Kyber for Asset A
            require(
                assetB.approve(address(kyber), assetBBalance),
                "Could not approve Asset B sell on Kyber..."
            );
            (uint256 x, ) =
                kyber.getExpectedRate(assetB, assetA, assetBBalance);
            kyber.swapTokenToToken(assetB, assetBBalance, assetA, x);
        }

        require(
            assetA.balanceOf(address(this)) >= params.repayAmount,
            "Not enough funds to repay dYdX loan!"
        );

        uint256 profit = assetA.balanceOf(address(this)) - params.repayAmount;

        require(
            assetA.transfer(params.beneficiar, profit),
            "Could not transfer profit..."
        );
    }
}
