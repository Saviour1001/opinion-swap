// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

contract OpinionSwapOtherChain is OwnerIsCreator {
    using SafeERC20 for IERC20;

    uint64 public constant BASE_CHAIN_SELECTOR = 10344971235874465080;
    address public baseChainContract;
    IERC20 public usdcToken;
    IERC20 public linkToken;
    IRouterClient public router;

    event BetPlacedCrossChain(uint256 indexed proposalId, address indexed bettor, uint256 amount, uint256 option);

    constructor(address _router, address _usdcToken, address _linkToken, address _baseChainContract) {
        router = IRouterClient(_router);
        usdcToken = IERC20(_usdcToken);
        linkToken = IERC20(_linkToken);
        baseChainContract = _baseChainContract;
    }

    function placeBetCrossChain(uint256 _proposalId, uint256 _option, uint256 _amount) external {
        require(_option == 1 || _option == 2, "Invalid option");
        usdcToken.safeTransferFrom(msg.sender, address(this), _amount);
        usdcToken.approve(address(router), _amount);

        Client.EVM2AnyMessage memory message = _buildCCIPMessage(_proposalId, msg.sender, _amount, _option);
        uint256 fees = router.getFee(BASE_CHAIN_SELECTOR, message);

        require(fees <= linkToken.balanceOf(address(this)), "Insufficient LINK balance");
        linkToken.approve(address(router), fees);

        router.ccipSend(BASE_CHAIN_SELECTOR, message);

        emit BetPlacedCrossChain(_proposalId, msg.sender, _amount, _option);
    }

    function _buildCCIPMessage(uint256 _proposalId, address _bettor, uint256 _amount, uint256 _option)
        private
        view
        returns (Client.EVM2AnyMessage memory)
    {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: address(usdcToken), amount: _amount});

        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(baseChainContract),
                data: abi.encode(_proposalId, _bettor, _amount, _option),
                tokenAmounts: tokenAmounts,
                extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 200_000})),
                feeToken: address(linkToken)
            });
    }

    function withdraw(address _beneficiary) external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "NothingToWithdraw");
        (bool sent, ) = _beneficiary.call{value: amount}("");
        require(sent, "FailedToWithdrawEth");
    }

    function withdrawToken(address _beneficiary, address _token) external onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));
        require(amount > 0, "NothingToWithdraw");
        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}