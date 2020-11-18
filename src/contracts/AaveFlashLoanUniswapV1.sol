// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../on-chain/aave/contracts/FlashLoanReceiverBase.sol";
import "../on-chain/aave/contracts/ILendingPoolAddressesProvider.sol";
import "../on-chain/aave/contracts/ILendingPool.sol";
import "../on-chain/uniswap-v1/contracts/IUniswapExchange.sol";
import "../on-chain/uniswap-v1/contracts/IUniswapFactory.sol";

contract AaveFlashLoanUniswapV1 is FlashLoanReceiverBase {
    struct Context {
        address uniswapFactoryA;
        address uniswapFactoryB;
    }

    struct Params {
        address uniswapFactoryA;
        address uniswapFactoryB;
        address assetA;
        address assetB;
    }

    constructor(address _addressProvider)
        public
        FlashLoanReceiverBase(_addressProvider)
    {} // solhint-disable-line no-empty-blocks

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

        IUniswapExchange exA =
            IUniswapExchange(
                IUniswapFactory(params.uniswapFactoryA).getExchange(
                    params.assetA
                )
            );
        IUniswapExchange exB =
            IUniswapExchange(
                IUniswapFactory(params.uniswapFactoryB).getExchange(
                    params.assetB
                )
            );

        ERC20 assetA = ERC20(params.assetA);
        ERC20 assetB = ERC20(params.assetB);

        uint256 deadline = now + 3000; // solhint-disable-line not-rely-on-time

        // Buy Asset B with Asset A at Exchange A
        require(
            assetA.approve(address(exA), _amount),
            "Cound not approve Asset A sell..."
        );
        // solhint-disable-next-line var-name-mixedcase
        uint256 BAmount =
            exA.tokenToTokenSwapInput(_amount, 1, 1, deadline, params.assetB);

        // Sell Asset B for Asset A at Exchange B
        require(
            assetB.approve(address(exB), BAmount),
            "Could not approve Asset B sell..."
        );
        // solhint-disable-next-line var-name-mixedcase
        uint256 AAmount =
            exB.tokenToTokenSwapInput(BAmount, 1, 1, deadline, params.assetA);

        // Calculate and pay back debt
        uint256 totalDebt = _amount.add(_fee);
        require(AAmount > totalDebt, "There is no profit! Reverting...");
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
            abi.encode(
                Params(ctx.uniswapFactoryA, ctx.uniswapFactoryB, assetA, assetB)
            );

        // Perform the Flash Loan (calls the `executeOperation` function as a callback)
        lendingPool.flashLoan(address(this), assetA, amount, params);

        // Transfer the remaining profit to the caller
        ERC20 loan = ERC20(assetA);
        uint256 profit = loan.balanceOf(address(this));
        require(
            loan.transfer(msg.sender, profit),
            "Could not transfer profit..."
        );
    }
}
