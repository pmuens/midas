// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

// Original: https://github.com/studydefi/money-legos/blob/master/src/dydx/contracts/ICallee.sol

import { Account } from "./ISoloMargin.sol";

/**
 * @title ICallee
 * @author dYdX
 *
 * Interface that Callees for Solo must implement in order to ingest data.
 */
abstract contract ICallee {
    // ============ Public Functions ============

    /**
     * Allows users to send this contract arbitrary data.
     *
     * @param  sender       The msg.sender to Solo
     * @param  accountInfo  The account from which the data is being sent
     * @param  data         Arbitrary data given by the sender
     */
    function callFunction(
        address sender,
        Account.Info memory accountInfo,
        bytes memory data
    ) public virtual;
}
