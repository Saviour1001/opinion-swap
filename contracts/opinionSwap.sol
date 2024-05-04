// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract OpinionTrading is Ownable, ReentrancyGuard {
    struct Proposal {
        string description;
        string option1;
        string option2;
        uint256 deadline;
        uint256 option1Votes;
        uint256 option2Votes;
        uint256 option1PoolUSDC;
        uint256 option2PoolUSDC;
        uint256 option1PoolETH;
        uint256 option2PoolETH;
        bool isFinalized;
        uint256 winningOption;
    }

    IERC20 public usdcToken;
    AggregatorV3Interface internal dataFeed;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public userVoted;
    mapping(uint256 => mapping(address => uint256)) public userStakesUSDC;
    mapping(uint256 => mapping(address => uint256)) public userStakesETH;

    event ProposalCreated(uint256 indexed proposalId, string description, string option1, string option2, uint256 deadline);
    event VotePlaced(uint256 indexed proposalId, address indexed user, uint256 option, uint256 amountUSDC, uint256 amountETH);
    event ProposalFinalized(uint256 indexed proposalId, uint256 winningOption);
    event RewardsDistributed(uint256 indexed proposalId, uint256 totalRewardsUSDC, uint256 totalRewardsETH);
    event RewardWithdrawn(address indexed user, uint256 amountUSDC, uint256 amountETH);

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        dataFeed = AggregatorV3Interface(0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1);
    }

    function createProposal(string memory _description, string memory _option1, string memory _option2, uint256 _deadline) external  {
        require(_deadline > block.timestamp, "Invalid deadline");
        proposalCount++;
        proposals[proposalCount] = Proposal(_description, _option1, _option2, _deadline, 0, 0, 0, 0, 0, 0, false, 0);
        emit ProposalCreated(proposalCount, _description, _option1, _option2, _deadline);
    }

    function vote(uint256 _proposalId, uint256 _option, uint256 _amountUSDC, uint256 _amountETH) external payable nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.deadline > block.timestamp, "Voting period has ended");
        require(_option == 1 || _option == 2, "Invalid option");
        require(!userVoted[_proposalId][msg.sender], "User has already voted");
        require(_amountUSDC > 0 || _amountETH > 0, "Invalid amount");
        require(msg.value == _amountETH, "ETH amount mismatch");

        userVoted[_proposalId][msg.sender] = true;
        userStakesUSDC[_proposalId][msg.sender] = _amountUSDC;
        userStakesETH[_proposalId][msg.sender] = _amountETH;

        if (_option == 1) {
            proposal.option1Votes++;
            proposal.option1PoolUSDC += _amountUSDC;
            proposal.option1PoolETH += _amountETH;
        } else {
            proposal.option2Votes++;
            proposal.option2PoolUSDC += _amountUSDC;
            proposal.option2PoolETH += _amountETH;
        }

        if (_amountUSDC > 0) {
            usdcToken.transferFrom(msg.sender, address(this), _amountUSDC);
        }

        emit VotePlaced(_proposalId, msg.sender, _option, _amountUSDC, _amountETH);
    }

    function increaseBet(uint256 _proposalId, uint256 _amountUSDC, uint256 _amountETH) external payable nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.deadline > block.timestamp, "Betting period has ended");
        require(_amountUSDC > 0 || _amountETH > 0, "Invalid amount");
        require(msg.value == _amountETH, "ETH amount mismatch");
        require(userVoted[_proposalId][msg.sender], "User has not voted");

        uint256 userOption = userStakesUSDC[_proposalId][msg.sender] > 0 ? 1 : 2;
        userStakesUSDC[_proposalId][msg.sender] += _amountUSDC;
        userStakesETH[_proposalId][msg.sender] += _amountETH;

        if (userOption == 1) {
            proposal.option1PoolUSDC += _amountUSDC;
            proposal.option1PoolETH += _amountETH;
        } else {
            proposal.option2PoolUSDC += _amountUSDC;
            proposal.option2PoolETH += _amountETH;
        }

        if (_amountUSDC > 0) {
            usdcToken.transferFrom(msg.sender, address(this), _amountUSDC);
        }

        emit VotePlaced(_proposalId, msg.sender, userOption, _amountUSDC, _amountETH);
    }

    function finalizeProposal(uint256 _proposalId, uint256 _winningOption) external onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.deadline <= block.timestamp, "Voting period has not ended");
        require(!proposal.isFinalized, "Proposal already finalized");
        require(_winningOption == 1 || _winningOption == 2, "Invalid winning option");

        proposal.isFinalized = true;
        proposal.winningOption = _winningOption;

        emit ProposalFinalized(_proposalId, _winningOption);
    }

    function distributeRewards(uint256 _proposalId) external onlyOwner nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isFinalized, "Proposal not finalized");

        uint256 totalPoolUSDC = proposal.option1PoolUSDC + proposal.option2PoolUSDC;
        uint256 totalPoolETH = proposal.option1PoolETH + proposal.option2PoolETH;
        uint256 totalRewardsUSDC = 0;
        uint256 totalRewardsETH = 0;

        for (uint256 i = 0; i < proposalCount; i++) {
            address user = address(uint160(i));
            uint256 userStakeUSDC = userStakesUSDC[_proposalId][user];
            uint256 userStakeETH = userStakesETH[_proposalId][user];

            if (userVoted[_proposalId][user] && (userStakeUSDC > 0 || userStakeETH > 0)) {
                uint256 userOption = userStakeUSDC > 0 ? 1 : 2;

                if (userOption == proposal.winningOption) {
                    uint256 userRewardUSDC = (userStakeUSDC * totalPoolUSDC) / (proposal.winningOption == 1 ? proposal.option1PoolUSDC : proposal.option2PoolUSDC);
                    uint256 userRewardETH = (userStakeETH * totalPoolETH) / (proposal.winningOption == 1 ? proposal.option1PoolETH : proposal.option2PoolETH);
                    totalRewardsUSDC += userRewardUSDC;
                    totalRewardsETH += userRewardETH;

                    userStakesUSDC[_proposalId][user] = 0;
                    userStakesETH[_proposalId][user] = 0;

                    if (userRewardUSDC > 0) {
                        usdcToken.transfer(user, userRewardUSDC);
                    }
                    if (userRewardETH > 0) {
                        payable(user).transfer(userRewardETH);
                    }

                    emit RewardWithdrawn(user, userRewardUSDC, userRewardETH);
                }
            }
        }

        emit RewardsDistributed(_proposalId, totalRewardsUSDC, totalRewardsETH);
    }

    function getTotalPoolUSDC(uint256 _proposalId) external view returns (uint256) {
        Proposal storage proposal = proposals[_proposalId];
        return proposal.option1PoolUSDC + proposal.option2PoolUSDC;
    }

    function getTotalPoolETH(uint256 _proposalId) external view returns (uint256) {
        Proposal storage proposal = proposals[_proposalId];
        return proposal.option1PoolETH + proposal.option2PoolETH;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        (, int answer, , , ) = dataFeed.latestRoundData();
        return answer;
    }

    function getUserVote(uint256 _proposalId, address _user) external view returns (bool) {
        return userVoted[_proposalId][_user];
    }

    function getUserStakeUSDC(uint256 _proposalId, address _user) external view returns (uint256) {
        return userStakesUSDC[_proposalId][_user];
    }

    function getUserStakeETH(uint256 _proposalId, address _user) external view returns (uint256) {
        return userStakesETH[_proposalId][_user];
    }
}