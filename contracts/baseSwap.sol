// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";

contract OpinionSwapBase is CCIPReceiver, OwnerIsCreator {
    using SafeERC20 for IERC20;

    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
    error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
    error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.
    error SourceChainNotAllowed(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
    error SenderNotAllowed(address sender); // Used when the sender has not been allowlisted by the contract owner.
    error InvalidReceiverAddress(); // Used when the receiver address is 0.

    struct Proposal {
        string description;
        string option1;
        string option2;
        uint256 deadline;
        uint256 option1Votes;
        uint256 option2Votes;
        uint256 option1PoolUSDC;
        uint256 option2PoolUSDC;
        bool isFinalized;
        uint256 winningOption;
        mapping(address => uint256) bets;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    IERC20 public usdcToken;

    event ProposalCreated(
        uint256 indexed proposalId,
        string description,
        string option1,
        string option2,
        uint256 deadline
    );
    event BetPlaced(
        uint256 indexed proposalId,
        address indexed bettor,
        uint256 amount,
        uint256 option
    );
    event ResultDeclared(uint256 indexed proposalId, uint256 winningOption);
    event RewardsDistributed(uint256 indexed proposalId);

    // Event emitted when a message is received from another chain.
    event MessageReceived(
        bytes32 indexed messageId, // The unique ID of the CCIP message.
        uint64 indexed sourceChainSelector, // The chain selector of the source chain.
        address sender, // The address of the sender from the source chain.
        string text, // The text that was received.
        address token, // The token address that was transferred.
        uint256 tokenAmount // The token amount that was transferred.
    );

    constructor(address _router, address _usdcToken) CCIPReceiver(_router) {
        usdcToken = IERC20(_usdcToken);
    }

    function createProposal(
        string calldata _description,
        string calldata _option1,
        string calldata _option2,
        uint256 _deadline
    ) external onlyOwner {
        require(_deadline > block.timestamp, "Invalid deadline");
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.description = _description;
        newProposal.option1 = _option1;
        newProposal.option2 = _option2;
        newProposal.deadline = _deadline;
        emit ProposalCreated(
            proposalCount,
            _description,
            _option1,
            _option2,
            _deadline
        );
    }

    function placeBet(
        uint256 _proposalId,
        uint256 _option,
        uint256 _amount
    ) external {
        require(_option == 1 || _option == 2, "Invalid option");
        Proposal storage proposal = proposals[_proposalId];
        require(
            block.timestamp < proposal.deadline,
            "Betting period has ended"
        );
        require(!proposal.isFinalized, "Proposal is already finalized");
        usdcToken.safeTransferFrom(msg.sender, address(this), _amount);
        proposal.bets[msg.sender] += _amount;
        if (_option == 1) {
            proposal.option1Votes += _amount;
            proposal.option1PoolUSDC += _amount;
        } else {
            proposal.option2Votes += _amount;
            proposal.option2PoolUSDC += _amount;
        }
        emit BetPlaced(_proposalId, msg.sender, _amount, _option);
    }

    function declareResult(
        uint256 _proposalId,
        uint256 _winningOption
    ) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(
            block.timestamp >= proposal.deadline,
            "Betting period has not ended"
        );
        require(!proposal.isFinalized, "Proposal is already finalized");
        proposal.winningOption = _winningOption;
        proposal.isFinalized = true;
        emit ResultDeclared(_proposalId, proposal.winningOption);
    }

    function distributeRewards(uint256 _proposalId) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isFinalized, "Proposal is not finalized");
        uint256 losingPool;
        uint256 winningPool;
        if (proposal.winningOption == 1) {
            losingPool = proposal.option2PoolUSDC;
            winningPool = proposal.option1PoolUSDC;
        } else if (proposal.winningOption == 2) {
            losingPool = proposal.option1PoolUSDC;
            winningPool = proposal.option2PoolUSDC;
        } else {
            // Tie, return bets to respective bettors
            for (uint256 i = 0; i < proposalCount; i++) {
                address bettor = address(uint160(i));
                uint256 betAmount = proposal.bets[bettor];
                if (betAmount > 0) {
                    usdcToken.safeTransfer(bettor, betAmount);
                }
            }
            emit RewardsDistributed(_proposalId);
            return;
        }
        uint256 totalWinningPool = winningPool + losingPool;
        for (uint256 i = 0; i < proposalCount; i++) {
            address bettor = address(uint160(i));
            uint256 betAmount = proposal.bets[bettor];
            if (betAmount > 0) {
                uint256 reward = (betAmount * totalWinningPool) / winningPool;
                usdcToken.safeTransfer(bettor, reward);
            }
        }
        emit RewardsDistributed(_proposalId);
    }

    function getTotalBetAmount() external view returns (uint256) {
        uint256 totalAmount;
        for (uint256 i = 1; i <= proposalCount; i++) {
            totalAmount +=
                proposals[i].option1PoolUSDC +
                proposals[i].option2PoolUSDC;
        }
        return totalAmount;
    }

    // Mapping to keep track of allowlisted source chains.
    mapping(uint64 => bool) public allowlistedSourceChains;

    // Mapping to keep track of allowlisted senders.
    mapping(address => bool) public allowlistedSenders;

    /// @dev Updates the allowlist status of a source chain
    /// @notice This function can only be called by the owner.
    /// @param _sourceChainSelector The selector of the source chain to be updated.
    /// @param allowed The allowlist status to be set for the source chain.
    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external onlyOwner {
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a sender for transactions.
    /// @notice This function can only be called by the owner.
    /// @param _sender The address of the sender to be updated.
    /// @param allowed The allowlist status to be set for the sender.
    function allowlistSender(address _sender, bool allowed) external onlyOwner {
        allowlistedSenders[_sender] = allowed;
    }

    /// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted and if the sender is allowlisted.
    /// @param _sourceChainSelector The selector of the destination chain.
    /// @param _sender The address of the sender.
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert SourceChainNotAllowed(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert SenderNotAllowed(_sender);
        _;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory _message
    )
        internal
        override
        onlyAllowlisted(
            _message.sourceChainSelector,
            abi.decode(_message.sender, (address))
        )
    {
        (
            uint256 _proposalId,
            address _bettor,
            uint256 _amount,
            uint256 _option
        ) = abi.decode(_message.data, (uint256, address, uint256, uint256));
        Proposal storage proposal = proposals[_proposalId];
        proposal.bets[_bettor] += _amount;
        if (_option == 1) {
            proposal.option1Votes += _amount;
            proposal.option1PoolUSDC += _amount;
        } else {
            proposal.option2Votes += _amount;
            proposal.option2PoolUSDC += _amount;
        }
        emit BetPlaced(_proposalId, _bettor, _amount, _option);
    }
}
