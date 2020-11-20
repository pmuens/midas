// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../on-chain/aave/contracts/FlashLoanReceiverBase.sol";
import "../on-chain/aave/contracts/ILendingPoolAddressesProvider.sol";
import "../on-chain/aave/contracts/ILendingPool.sol";
import "../on-chain/uniswap-v2/contracts/IUniswapV2Router02.sol";
import "../on-chain/kyber/contracts/IKyberNetworkProxy.sol";
import "../on-chain/kyber/contracts/ISimpleKyberProxy.sol";

// solhint-disable-next-line no-empty-blocks
abstract contract KyberNetworkProxy is IKyberNetworkProxy, ISimpleKyberProxy {

}

contract AaveFlashLoan is FlashLoanReceiverBase {
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
    }

    address private _kyber;
    address private _uniswapV2;

    constructor(
        address _addressProvider,
        address kyber,
        address uniswapV2
    ) public FlashLoanReceiverBase(_addressProvider) {
        _kyber = kyber;
        _uniswapV2 = uniswapV2;
    }

    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    ) external override {
        require(
            _amount <= getBalanceInternal(address(this), _reserve),
            "Invalid balance, was the Flash Loan successful?"
        );

        Params memory params = abi.decode(_params, (Params));

        ERC20 assetA = ERC20(params.assetA);
        ERC20 assetB = ERC20(params.assetB);

        KyberNetworkProxy kyber = KyberNetworkProxy(_kyber);
        IUniswapV2Router02 uniswapV2 = IUniswapV2Router02(_uniswapV2);

        if (params.direction == Direction.KyberToUniswapV2) {
            // Buy Asset B via Asset A on Kyber
            require(
                assetA.approve(address(kyber), _amount),
                "Could not approve Asset A sell on Kyber..."
            );
            (uint256 x, ) = kyber.getExpectedRate(assetA, assetB, _amount);
            kyber.swapTokenToToken(assetA, _amount, assetB, x);
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
                assetA.approve(address(uniswapV2), _amount),
                "Could not approve Asset A sell on Uniswap V2..."
            );
            address[] memory path = new address[](2);
            path[0] = address(assetA);
            path[1] = address(assetB);
            uint256[] memory minOuts = uniswapV2.getAmountsOut(_amount, path);
            uniswapV2.swapExactTokensForTokens(
                _amount,
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

        // Calculate and pay back debt
        uint256 totalDebt = _amount.add(_fee);
        require(
            assetA.balanceOf(address(this)) > totalDebt,
            "There is no profit! Reverting..."
        );
        transferFundsBackToPoolInternal(_reserve, totalDebt);
    }

    // External function which kick-starts the Flash Loan process
    function initFlashLoan(
        bytes calldata context,
        address assetA, // The asset we're about to borrow
        address assetB,
        uint256 amount
    ) external {
        ILendingPool lendingPool =
            ILendingPool(addressesProvider.getLendingPool());

        // Create params for callback function
        Context memory ctx = abi.decode(context, (Context));
        bytes memory params =
            abi.encode(Params(ctx.beneficiar, ctx.direction, assetA, assetB));

        // Perform the Flash Loan (calls the `executeOperation` function as a callback)
        lendingPool.flashLoan(address(this), assetA, amount, params);

        // Transfer the remaining profit to the caller
        ERC20 loan = ERC20(assetA);
        uint256 profit = loan.balanceOf(address(this));
        require(
            loan.transfer(ctx.beneficiar, profit),
            "Could not transfer profit..."
        );
    }
}
