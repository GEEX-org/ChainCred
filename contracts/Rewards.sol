// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./Tokens.sol";


contract OSSRewardsV2 is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable ossToken;
    
    // Platform revenue sources
    uint256 public constant PLATFORM_FEE = 500; // 5% platform fee
    uint256 public constant VALIDATOR_STAKE = 1000 * 10**18; // 1000 OSS to become validator(eligibility)
    uint256 public constant MIN_CONTRIBUTION_STAKE = 100 * 10**18; // 100 OSS to submit
    
    // Contribution validation requirements
    uint256 public constant MIN_VALIDATORS_REQUIRED = 3;
    uint256 public constant VALIDATION_PERIOD = 7 days;
    uint256 public constant APPROVAL_THRESHOLD = 60; // 60% approval needed
    
    // Revenue sharing
    uint256 public constant VALIDATOR_REWARD_SHARE = 20; // 20% of platform fees to validators
    uint256 public constant TREASURY_SHARE = 30; // 30% to treasury for sustainability
    uint256 public constant BURN_SHARE = 10; // 10% burned for deflation
    
    enum ContributionStatus { Pending, UnderReview, Approved, Rejected, Claimed }
    enum ContributionCategory { BugFix, Feature, Security, Documentation, Performance, Research }
    
    struct Contribution {
        uint256 id;
        address contributor;
        string title;
        string description;
        string projectUrl;
        string githubPR; // GitHub PR link for verification
        ContributionCategory category;
        uint256 submissionTime;
        uint256 stakeAmount; // Contributor's stake
        uint256 validationDeadline;
        uint256 approvalVotes;
        uint256 rejectionVotes;
        uint256 totalValidators;
        ContributionStatus status;
        uint256 rewardAmount;
        bool claimed;
        mapping(address => bool) hasValidated;
        mapping(address => bool) validatorVotes; // true = approve, false = reject
    }
    
    struct Validator {
        bool isActive;
        uint256 stakedAmount;
        uint256 validationsCount;
        uint256 accuracyScore; // Out of 100
        uint256 rewardsEarned;
        uint256 registrationTime;
    }
    
    // State variables
    mapping(uint256 => Contribution) public contributions;
    mapping(address => Validator) public validators;
    mapping(address => uint256[]) public userContributions;
    mapping(ContributionCategory => uint256) public categoryRewards;
    
    address[] public activeValidators;
    uint256 public nextContributionId = 1;
    uint256 public totalStaked;
    uint256 public platformTreasury;
    uint256 public validatorRewardPool;
    
    // Events
    event ContributionSubmitted(uint256 indexed contributionId, address indexed contributor, ContributionCategory category, uint256 stakeAmount);
    event ValidationSubmitted(uint256 indexed contributionId, address indexed validator, bool approved);
    event ContributionFinalized(uint256 indexed contributionId, ContributionStatus status, uint256 rewardAmount);
    event ValidatorRegistered(address indexed validator, uint256 stakedAmount);
    event ValidatorSlashed(address indexed validator, uint256 slashedAmount);
    event RewardClaimed(uint256 indexed contributionId, address indexed contributor, uint256 amount);
    event PlatformFeeCollected(uint256 amount);
    
    constructor(address _ossToken) Ownable(msg.sender) {
        ossToken = IERC20(_ossToken);
        
        // Initialize category rewards (in OSS tokens)
        categoryRewards[ContributionCategory.Security] = 1000 * 10**18; // 1000 tocken 
        categoryRewards[ContributionCategory.BugFix] = 500 * 10**18;    // 500 tocken
        categoryRewards[ContributionCategory.Feature] = 750 * 10**18;   // 750 token
        categoryRewards[ContributionCategory.Performance] = 600 * 10**18; // 600 tocken
        categoryRewards[ContributionCategory.Documentation] = 300 * 10**18; // 300 tocken
        categoryRewards[ContributionCategory.Research] = 800 * 10**18;  // 800 tocken
    }
    
    /**
     * @dev Register as a validator by staking OSS tokens
     */
    function registerValidator() external nonReentrant {
        require(!validators[msg.sender].isActive, "Already a validator");
        require(ossToken.transferFrom(msg.sender, address(this), VALIDATOR_STAKE), "Stake transfer failed");
        
        validators[msg.sender] = Validator({
            isActive: true,
            stakedAmount: VALIDATOR_STAKE,
            validationsCount: 0,
            accuracyScore: 100, // Start with perfect score
            rewardsEarned: 0,
            registrationTime: block.timestamp
        });
        
        activeValidators.push(msg.sender);
        totalStaked += VALIDATOR_STAKE;
        
        emit ValidatorRegistered(msg.sender, VALIDATOR_STAKE);
    }
    
    /**
     * @dev Submit a contribution with stake
     */
    function submitContribution(
        string memory _title,
        string memory _description,
        string memory _projectUrl,
        string memory _githubPR,
        ContributionCategory _category
    ) external nonReentrant whenNotPaused {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_githubPR).length > 0, "GitHub PR required");
        require(activeValidators.length >= MIN_VALIDATORS_REQUIRED, "Not enough validators");
        
        // Contributor must stake tokens
        require(ossToken.transferFrom(msg.sender, address(this), MIN_CONTRIBUTION_STAKE), "Stake transfer failed");
        
        uint256 contributionId = nextContributionId++;
        Contribution storage contribution = contributions[contributionId];
        
        contribution.id = contributionId;
        contribution.contributor = msg.sender;
        contribution.title = _title;
        contribution.description = _description;
        contribution.projectUrl = _projectUrl;
        contribution.githubPR = _githubPR;
        contribution.category = _category;
        contribution.submissionTime = block.timestamp;
        contribution.stakeAmount = MIN_CONTRIBUTION_STAKE;
        contribution.validationDeadline = block.timestamp + VALIDATION_PERIOD;
        contribution.status = ContributionStatus.UnderReview;
        
        userContributions[msg.sender].push(contributionId);
        totalStaked += MIN_CONTRIBUTION_STAKE;
        
        emit ContributionSubmitted(contributionId, msg.sender, _category, MIN_CONTRIBUTION_STAKE);
    }
    
    /**
     * @dev Validators vote on contributions
     */
    function validateContribution(uint256 _contributionId, bool _approve) external nonReentrant {
        require(validators[msg.sender].isActive, "Not an active validator");
        Contribution storage contribution = contributions[_contributionId];
        require(contribution.status == ContributionStatus.UnderReview, "Invalid status");
        require(block.timestamp <= contribution.validationDeadline, "Validation period ended");
        require(!contribution.hasValidated[msg.sender], "Already validated");
        
        contribution.hasValidated[msg.sender] = true;
        contribution.validatorVotes[msg.sender] = _approve;
        contribution.totalValidators++;
        
        if (_approve) {
            contribution.approvalVotes++;
        } else {
            contribution.rejectionVotes++;
        }
        
        validators[msg.sender].validationsCount++;
        
        emit ValidationSubmitted(_contributionId, msg.sender, _approve);
        
        // Check if we have enough validations
        if (contribution.totalValidators >= MIN_VALIDATORS_REQUIRED) {
            _finalizeContribution(_contributionId);
        }
    }
    
    /**
     * @dev Finalize contribution based on validation results
     */
    function _finalizeContribution(uint256 _contributionId) internal {
        Contribution storage contribution = contributions[_contributionId];
        uint256 approvalPercentage = (contribution.approvalVotes * 100) / contribution.totalValidators;
        
        if (approvalPercentage >= APPROVAL_THRESHOLD) {
            // Approved - calculate reward
            contribution.status = ContributionStatus.Approved;
            uint256 baseReward = categoryRewards[contribution.category];
            
            // Bonus based on approval percentage
            uint256 bonusMultiplier = approvalPercentage > 80 ? 120 : 100; // 20% bonus for >80% approval
            contribution.rewardAmount = (baseReward * bonusMultiplier) / 100;
            
            // Return stake to contributor
            totalStaked -= contribution.stakeAmount;
            
        } else {
            // Rejected - contributor loses stake
            contribution.status = ContributionStatus.Rejected;
            contribution.rewardAmount = 0;
            
            // Slash contributor's stake - distribute to validators and treasury
            uint256 slashedAmount = contribution.stakeAmount;
            totalStaked -= slashedAmount;
            
            // 50% to validators, 50% to treasury
            validatorRewardPool += slashedAmount / 2;
            platformTreasury += slashedAmount / 2;
        }
        
        // Reward validators for participation
        _distributeValidatorRewards(_contributionId);
        
        emit ContributionFinalized(_contributionId, contribution.status, contribution.rewardAmount);
    }
    
    /**
     * @dev Distribute rewards to validators
     */
    function _distributeValidatorRewards(uint256 _contributionId) internal {
        Contribution storage contribution = contributions[_contributionId];
        uint256 rewardPerValidator = 10 * 10**18; // 10 OSS per validation
        
        // Iterate through active validators who participated
        for (uint256 i = 0; i < activeValidators.length; i++) {
            address validator = activeValidators[i];
            if (contribution.hasValidated[validator]) {
                validators[validator].rewardsEarned += rewardPerValidator;
                validatorRewardPool -= rewardPerValidator;
            }
        }
    }
    
    /**
     * @dev Claim approved contribution reward
     */
    function claimReward(uint256 _contributionId) external nonReentrant {
        Contribution storage contribution = contributions[_contributionId];
        require(contribution.contributor == msg.sender, "Not your contribution");
        require(contribution.status == ContributionStatus.Approved, "Not approved");
        require(!contribution.claimed, "Already claimed");
        
        contribution.claimed = true;
        contribution.status = ContributionStatus.Claimed;
        
        // Transfer reward to contributor
        require(ossToken.transfer(msg.sender, contribution.rewardAmount), "Reward transfer failed");
        
        // Return original stake
        require(ossToken.transfer(msg.sender, contribution.stakeAmount), "Stake return failed");
        
        emit RewardClaimed(_contributionId, msg.sender, contribution.rewardAmount);
    }
    
    /**
     * @dev Validators claim their earned rewards
     */
    function claimValidatorRewards() external nonReentrant {
        require(validators[msg.sender].isActive, "Not an active validator");
        uint256 rewards = validators[msg.sender].rewardsEarned;
        require(rewards > 0, "No rewards to claim");
        
        validators[msg.sender].rewardsEarned = 0;
        require(ossToken.transfer(msg.sender, rewards), "Reward transfer failed");
    }
    
    /**
     * @dev Emergency finalize if validation period expired
     */
    function emergencyFinalize(uint256 _contributionId) external {
        Contribution storage contribution = contributions[_contributionId];
        require(contribution.status == ContributionStatus.UnderReview, "Invalid status");
        require(block.timestamp > contribution.validationDeadline, "Validation period not ended");
        
        if (contribution.totalValidators >= MIN_VALIDATORS_REQUIRED) {
            _finalizeContribution(_contributionId);
        } else {
            // Not enough validators - return stake, no reward
            contribution.status = ContributionStatus.Rejected;
            totalStaked -= contribution.stakeAmount;
            require(ossToken.transfer(contribution.contributor, contribution.stakeAmount), "Stake return failed");
        }
    }
    
    // View functions
    function getContribution(uint256 _contributionId) external view returns (
        uint256 id,
        address contributor,
        string memory title,
        string memory description,
        string memory projectUrl,
        string memory githubPR,
        ContributionCategory category,
        uint256 submissionTime,
        uint256 stakeAmount,
        uint256 approvalVotes,
        uint256 rejectionVotes,
        uint256 totalValidators,
        ContributionStatus status,
        uint256 rewardAmount,
        bool claimed
    ) {
        Contribution storage contribution = contributions[_contributionId];
        return (
            contribution.id,
            contribution.contributor,
            contribution.title,
            contribution.description,
            contribution.projectUrl,
            contribution.githubPR,
            contribution.category,
            contribution.submissionTime,
            contribution.stakeAmount,
            contribution.approvalVotes,
            contribution.rejectionVotes,
            contribution.totalValidators,
            contribution.status,
            contribution.rewardAmount,
            contribution.claimed
        );
    }
    
    function getUserContributions(address _user) external view returns (uint256[] memory) {
        return userContributions[_user];
    }
    
    function getActiveValidatorsCount() external view returns (uint256) {
        return activeValidators.length;
    }
    
    // Admin functions
    function updateCategoryReward(ContributionCategory _category, uint256 _newReward) external onlyOwner {
        categoryRewards[_category] = _newReward;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdrawTreasury(uint256 _amount) external onlyOwner {
        require(_amount <= platformTreasury, "Insufficient treasury");
        platformTreasury -= _amount;
        require(ossToken.transfer(owner(), _amount), "Transfer failed");
    }
} 


/**
 * @title OSSRewards
 * @dev Contract for managing open-source contribution submissions and rewards
 */
contract OSSRewards is ReentrancyGuard, Ownable, Pausable {
    OSSToken public immutable ossToken;
    
    //core comp - lifecycle & organisation
    enum ContributionStatus { Pending, Approved, Rejected, Claimed }
    enum Category { BugFix, Feature, Performance, Security, Documentation, Refactoring, Testing, Other }
    
    struct Contribution {
        uint256 id;
        address contributor;
        string title;
        string description;
        string projectUrl;
        Category category;
        uint256 submissionTime;
        uint256 upvotes;
        uint256 downvotes;
        uint256 rewardAmount;
        ContributionStatus status;
        bool claimed;
    }
    
    struct Vote {
        bool hasVoted;
        bool isUpvote;
    }
    
    uint256 public nextContributionId = 1;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTES_REQUIRED = 5;
    uint256 public constant APPROVAL_THRESHOLD = 60; // 60% approval required
    
    // Base reward amounts for different categories (in wei)
    mapping(Category => uint256) public baseRewards;
    
    // All contributions
    mapping(uint256 => Contribution) public contributions;
    
    // Voting tracking: contributionId => voter => Vote
    mapping(uint256 => mapping(address => Vote)) public votes;
    
    // User contribution history
    mapping(address => uint256[]) public userContributions;
    
    // Events
    event ContributionSubmitted(
        uint256 indexed contributionId,
        address indexed contributor,
        string title,
        Category category
    );
    
    event VoteCast(
        uint256 indexed contributionId,
        address indexed voter,
        bool isUpvote
    );
    
    event ContributionApproved(
        uint256 indexed contributionId,
        uint256 rewardAmount
    );
    
    event ContributionRejected(uint256 indexed contributionId);
    
    event RewardClaimed(
        uint256 indexed contributionId,
        address indexed contributor,
        uint256 amount
    );
    
    event BaseRewardUpdated(Category category, uint256 amount);
    
    constructor(address _ossToken) Ownable(msg.sender) {
        ossToken = OSSToken(_ossToken);
        
        // Set initial base rewards (in OSS tokens * 10^18)
        baseRewards[Category.BugFix] = 100 * 10**18;
        baseRewards[Category.Feature] = 200 * 10**18;
        baseRewards[Category.Performance] = 150 * 10**18;
        baseRewards[Category.Security] = 300 * 10**18;
        baseRewards[Category.Documentation] = 75 * 10**18;
        baseRewards[Category.Refactoring] = 125 * 10**18;
        baseRewards[Category.Testing] = 100 * 10**18;
        baseRewards[Category.Other] = 50 * 10**18;
    }
    
    /**
     * @dev Submit a new contribution for community review
     */
    function submitContribution(
        string memory title,
        string memory description,
        string memory projectUrl,
        Category category
    ) external whenNotPaused {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(projectUrl).length > 0, "Project URL cannot be empty");
        
        uint256 contributionId = nextContributionId++;
        
        contributions[contributionId] = Contribution({
            id: contributionId,
            contributor: msg.sender,
            title: title,
            description: description,
            projectUrl: projectUrl,
            category: category,
            submissionTime: block.timestamp,
            upvotes: 0,
            downvotes: 0,
            rewardAmount: 0,
            status: ContributionStatus.Pending,
            claimed: false
        });
        
        userContributions[msg.sender].push(contributionId);
        
        emit ContributionSubmitted(contributionId, msg.sender, title, category);
    }
    
    /**
     * @dev Vote on a contribution (upvote = true, downvote = false)
     */
    function voteOnContribution(uint256 contributionId, bool isUpvote) 
        external 
        whenNotPaused 
    {
        require(contributionId < nextContributionId, "Contribution does not exist");
        require(contributions[contributionId].status == ContributionStatus.Pending, "Voting period ended");
        require(contributions[contributionId].contributor != msg.sender, "Cannot vote on own contribution");
        require(!votes[contributionId][msg.sender].hasVoted, "Already voted");
        require(
            block.timestamp <= contributions[contributionId].submissionTime + VOTING_PERIOD,
            "Voting period has ended"
        );
        
        votes[contributionId][msg.sender] = Vote({
            hasVoted: true,
            isUpvote: isUpvote
        });
        
        if (isUpvote) {
            contributions[contributionId].upvotes++;
        } else {
            contributions[contributionId].downvotes++;
        }
        
        emit VoteCast(contributionId, msg.sender, isUpvote);
        
        // Auto-finalize if enough votes
        _tryFinalizeContribution(contributionId);
    }
    
    /**
     * @dev Finalize a contribution after voting period
     */
    function finalizeContribution(uint256 contributionId) external {
        require(contributionId < nextContributionId, "Contribution does not exist");
        require(contributions[contributionId].status == ContributionStatus.Pending, "Already finalized");
        require(
            block.timestamp > contributions[contributionId].submissionTime + VOTING_PERIOD,
            "Voting period still active"
        );
        
        _finalizeContribution(contributionId);
    }
    
    /**
     * @dev Internal function to try finalizing a contribution
     */
    function _tryFinalizeContribution(uint256 contributionId) internal {
        Contribution storage contribution = contributions[contributionId];
        uint256 totalVotes = contribution.upvotes + contribution.downvotes;
        
        if (totalVotes >= MIN_VOTES_REQUIRED) {
            _finalizeContribution(contributionId);
        }
    }
    
    /**
     * @dev Internal function to finalize a contribution
     */
    function _finalizeContribution(uint256 contributionId) internal {
        Contribution storage contribution = contributions[contributionId];
        uint256 totalVotes = contribution.upvotes + contribution.downvotes;
        
        if (totalVotes == 0) {
            contribution.status = ContributionStatus.Rejected;
            emit ContributionRejected(contributionId);
            return;
        }
        
        uint256 approvalPercentage = (contribution.upvotes * 100) / totalVotes;
        
        if (approvalPercentage >= APPROVAL_THRESHOLD) {
            // Calculate reward based on category and vote ratio
            uint256 baseReward = baseRewards[contribution.category];
            uint256 multiplier = 100 + ((approvalPercentage - APPROVAL_THRESHOLD) * 2); // Up to 180% of base
            contribution.rewardAmount = (baseReward * multiplier) / 100;
            contribution.status = ContributionStatus.Approved;
            
            emit ContributionApproved(contributionId, contribution.rewardAmount);
        } else {
            contribution.status = ContributionStatus.Rejected;
            emit ContributionRejected(contributionId);
        }
    }
    
    /**
     * @dev Claim reward for an approved contribution
     */
    function claimReward(uint256 contributionId) external nonReentrant whenNotPaused {
        require(contributionId < nextContributionId, "Contribution does not exist");
        
        Contribution storage contribution = contributions[contributionId];
        require(contribution.contributor == msg.sender, "Not the contributor");
        require(contribution.status == ContributionStatus.Approved, "Contribution not approved");
        require(!contribution.claimed, "Reward already claimed");
        
        contribution.claimed = true;
        contribution.status = ContributionStatus.Claimed;
        
        // Mint reward tokens to the contributor
        ossToken.mint(msg.sender, contribution.rewardAmount);
        
        emit RewardClaimed(contributionId, msg.sender, contribution.rewardAmount);
    }
    
    /**
     * @dev Get contribution details
     */
    function getContribution(uint256 contributionId) 
        external 
        view 
        returns (Contribution memory) 
    {
        require(contributionId < nextContributionId, "Contribution does not exist");
        return contributions[contributionId];
    }
    
    /**
     * @dev Get user's contribution IDs
     */
    function getUserContributions(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userContributions[user];
    }
    
    /**
     * @dev Get vote information for a contribution and voter
     */
    function getVote(uint256 contributionId, address voter) 
        external 
        view 
        returns (bool hasVoted, bool isUpvote) 
    {
        Vote memory vote = votes[contributionId][voter];
        return (vote.hasVoted, vote.isUpvote);
    }
    
    /**
     * @dev Update base reward for a category (only owner)
     */
    function updateBaseReward(Category category, uint256 amount) external onlyOwner {
        baseRewards[category] = amount;
        emit BaseRewardUpdated(category, amount);
    }
    
    /**
     * @dev Pause the contract (emergency use)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get total number of contributions
     */
    function getTotalContributions() external view returns (uint256) {
        return nextContributionId - 1;
    }
} 