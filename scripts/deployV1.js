const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Main deployment function for OSS platform contracts
 * Deploys OSSToken, OSSRewards, and contracts with proper setup.
 */
async function main() {
  // Initialize deployment
  console.log("🚀 Starting deployment to", network.name);
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy contracts
  const contracts = await deployContracts();
  
  // Setup contract permissions and initial state
  await setupContracts(contracts);
  
  // Save deployment information
  const deploymentInfo = createDeploymentInfo(deployer, contracts);
  await saveDeploymentInfo(deploymentInfo);
  
  // Update frontend configuration
  await updateFrontendConfig(deploymentInfo);
  
  // Display deployment summary
  displaySummary(contracts);
}

/**
 * Deploy all platform contracts
 * @returns {Object} Deployed contract instances and addresses
 */
async function deployContracts() {
  const contracts = {};

  // Deploy OSS Token
  console.log("\n📦 Deploying OSS Token...");
  const OSSToken = await ethers.getContractFactory("OSSToken");
  contracts.ossToken = await OSSToken.deploy();
  await contracts.ossToken.waitForDeployment();
  contracts.ossTokenAddress = await contracts.ossToken.getAddress();
  console.log("✅ OSS Token deployed to:", contracts.ossTokenAddress);

  // Deploy OSS Rewards
  console.log("\n📦 Deploying OSS Rewards...");
  const OSSRewards = await ethers.getContractFactory("OSSRewards");
  contracts.ossRewards = await OSSRewards.deploy(contracts.ossTokenAddress);
  await contracts.ossRewards.waitForDeployment();
  contracts.ossRewardsAddress = await contracts.ossRewards.getAddress();
  console.log("✅ OSS Rewards deployed to:", contracts.ossRewardsAddress);

  // Deploy DAO
  console.log("\n📦 Deploying DAO...");
  const OSSDAO = await ethers.getContractFactory("OSSDAO");
  contracts.ossDAO = await OSSDAO.deploy(contracts.ossTokenAddress);
  await contracts.ossDAO.waitForDeployment();
  contracts.ossDAOAddress = await contracts.ossDAO.getAddress();
  console.log("✅ DAO deployed to:", contracts.ossDAOAddress);

  return contracts;
}

/**
 * Setup contract permissions and initial configuration
 * @param {Object} contracts - Deployed contract instances and addresses
 */
async function setupContracts(contracts) {
  console.log("\n🔧 Setting up permissions...");
  
  // Add OSS Rewards as a minter for the token
  const addMinterTx = await contracts.ossToken.addMinter(contracts.ossRewardsAddress);
  await addMinterTx.wait();
  console.log("✅ Added OSS Rewards as token minter");

  // Transfer tokens to the DAO for governance
  const transferAmount = ethers.parseEther("1000000"); // 1M tokens
  const transferTx = await contracts.ossToken.transfer(contracts.ossDAOAddress, transferAmount);
  await transferTx.wait();
  console.log("✅ Transferred 1M tokens to DAO treasury");

  // Store transaction hashes for record keeping
  contracts.addMinterTx = addMinterTx.hash;
  contracts.transferTx = transferTx.hash;
}

/**
 * Create deployment information object
 * @param {Object} deployer - Deployer signer
 * @param {Object} contracts - Contract addresses and transaction hashes
 * @returns {Object} Deployment information
 */
function createDeploymentInfo(deployer, contracts) {
  return {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      OSSToken: {
        address: contracts.ossTokenAddress,
        name: "Open Source Rewards",
        symbol: "OSS"
      },
      OSSRewards: {
        address: contracts.ossRewardsAddress
      },
      OSSDAO: {
        address: contracts.ossDAOAddress
      }
    },
    transactions: {
      addMinter: contracts.addMinterTx,
      transferToDAO: contracts.transferTx
    }
  };
}

/**
 * Save deployment information to JSON file
 * @param {Object} deploymentInfo - Deployment information object
 */
async function saveDeploymentInfo(deploymentInfo) {
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  
  // Ensure deployments directory exists
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);
}

/**
 * Update frontend configuration with new contract addresses
 * @param {Object} deploymentInfo - Deployment information object
 */
async function updateFrontendConfig(deploymentInfo) {
  const frontendConfigPath = path.join(__dirname, "..", "src", "utils", "contracts.js");
  
  const frontendConfig = `// Auto-generated contract addresses - DO NOT EDIT MANUALLY
// This file is updated by the deployment script

export const CONTRACT_ADDRESSES = {
  TOKEN: "${deploymentInfo.contracts.OSSToken.address}",
  REWARDS: "${deploymentInfo.contracts.OSSRewards.address}",
  DAO: "${deploymentInfo.contracts.OSSDAO.address}",
};

export const DEPLOYMENT_INFO = {
  network: "${deploymentInfo.network}",
  chainId: ${deploymentInfo.chainId},
  deployedAt: "${deploymentInfo.timestamp}",
  deployer: "${deploymentInfo.deployer}",
  gasUsed: {
    token: 0, // Will be updated with actual gas usage
    rewards: 0,
    dao: 0,
  },
};
`;

  fs.writeFileSync(frontendConfigPath, frontendConfig);
  console.log("🎨 Frontend config updated:", frontendConfigPath);
}

/**
 * Display deployment summary and next steps
 * @param {Object} contracts - Contract addresses
 */
function displaySummary(contracts) {
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Summary:");
  console.log("═══════════════════════════════════");
  console.log("🪙 OSS Token:", contracts.ossTokenAddress);
  console.log("🎁 OSS Rewards:", contracts.ossRewardsAddress);
  console.log("🏛️  DAO:", contracts.ossDAOAddress);
  console.log("═══════════════════════════════════");
  
  // Network-specific verification commands
  if (network.name === "holesky") {
    console.log("\n🔍 Verify contracts on Etherscan:");
    console.log(`npx hardhat verify --network holesky ${contracts.ossTokenAddress}`);
    console.log(`npx hardhat verify --network holesky ${contracts.ossRewardsAddress} ${contracts.ossTokenAddress}`);
    console.log(`npx hardhat verify --network holesky ${contracts.ossDAOAddress} ${contracts.ossTokenAddress}`);
  }

  console.log("\n💡 Next steps:");
  console.log("1. Update your frontend to use the new contract addresses");
  console.log("2. Test the contracts on the network");
  console.log("3. Add initial contributions and proposals");
  console.log("4. Distribute initial tokens to early contributors");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });