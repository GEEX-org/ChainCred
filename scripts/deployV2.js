const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Configuration constants
const CONFIG = {
  MIN_BALANCE: "0.01", // Minimum ETH balance required
  INITIAL_MINT: "10000", // Initial OSS tokens to mint
  GAS_LIMITS: {
    TOKEN: 2000000,
    REWARDS: 3000000,
    DAO: 2500000
  },
  RETRY: {
    MAX_ATTEMPTS: 10,
    DELAY: 10000 // 10 seconds
  }
};

class DeploymentManager {
  constructor() {
    this.deploymentInfo = {};
    this.deployer = null;
    this.network = null;
  }

  // Initialize deployment environment
  async initialize() {
    console.log("🚀 Starting OSS DAO V2 Deployment...\n");
    
    [this.deployer] = await ethers.getSigners();
    this.network = await ethers.provider.getNetwork();
    const balance = await ethers.provider.getBalance(this.deployer.address);

    this.logDeploymentInfo(balance);
    this.validateBalance(balance);
    this.initializeDeploymentInfo();
  }

  logDeploymentInfo(balance) {
    console.log("📋 Deployment Configuration:");
    console.log(`Network: ${this.network.name} (Chain ID: ${this.network.chainId})`);
    console.log(`Deployer: ${this.deployer.address}`);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH\n`);
  }

  validateBalance(balance) {
    if (balance < ethers.parseEther(CONFIG.MIN_BALANCE)) {
      throw new Error(`❌ Insufficient balance. Need at least ${CONFIG.MIN_BALANCE} ETH`);
    }
  }

  initializeDeploymentInfo() {
    this.deploymentInfo = {
      network: this.network.name,
      chainId: Number(this.network.chainId),
      deployer: this.deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {}
    };
  }

  // Enhanced transaction waiting with proper error handling
  async waitForTransaction(txHash, maxRetries = CONFIG.RETRY.MAX_ATTEMPTS) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`⏳ Waiting for transaction ${txHash} (${attempt}/${maxRetries})...`);
        
        const receipt = await ethers.provider.getTransactionReceipt(txHash);
        if (receipt) {
          console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
          return receipt;
        }

        if (attempt < maxRetries) {
          console.log(`⏳ Transaction pending, waiting ${CONFIG.RETRY.DELAY/1000}s...`);
          await this.sleep(CONFIG.RETRY.DELAY);
        }
      } catch (error) {
        console.log(`⚠️ Error checking transaction (${attempt}/${maxRetries}): ${error.message}`);
        if (attempt === maxRetries) throw error;
        await this.sleep(CONFIG.RETRY.DELAY);
      }
    }
    throw new Error("Transaction confirmation timeout");
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Deploy a contract with proper error handling
  async deployContract(contractName, constructorArgs = [], gasLimit) {
    console.log(`📦 Deploying ${contractName}...`);
    
    const ContractFactory = await ethers.getContractFactory(contractName);
    const deployTx = await ContractFactory.getDeployTransaction(...constructorArgs);
    
    const tx = await this.deployer.sendTransaction({
      ...deployTx,
      gasLimit
    });

    console.log(`📤 ${contractName} deployment transaction: ${tx.hash}`);
    const receipt = await this.waitForTransaction(tx.hash);
    
    console.log(`✅ ${contractName} deployed to: ${receipt.contractAddress}\n`);
    
    return {
      address: receipt.contractAddress,
      txHash: tx.hash,
      receipt
    };
  }

  // Deploy all contracts
  async deployContracts() {
    // Deploy OSS Token
    const tokenDeployment = await this.deployContract(
      "OSSToken", 
      [], 
      CONFIG.GAS_LIMITS.TOKEN
    );

    // Deploy OSS Rewards V2
    const rewardsDeployment = await this.deployContract(
      "OSSRewardsV2", 
      [tokenDeployment.address], 
      CONFIG.GAS_LIMITS.REWARDS
    );

    // Deploy DAO
    const daoDeployment = await this.deployContract(
      "OSSDAO", 
      [tokenDeployment.address], 
      CONFIG.GAS_LIMITS.DAO
    );

    // Store contract information
    this.deploymentInfo.contracts = {
      OSSToken: {
        address: tokenDeployment.address,
        txHash: tokenDeployment.txHash,
        blockNumber: tokenDeployment.receipt.blockNumber,
        gasUsed: tokenDeployment.receipt.gasUsed.toString()
      },
      OSSRewardsV2: {
        address: rewardsDeployment.address,
        txHash: rewardsDeployment.txHash,
        blockNumber: rewardsDeployment.receipt.blockNumber,
        gasUsed: rewardsDeployment.receipt.gasUsed.toString()
      },
      OSSDAO: {
        address: daoDeployment.address,
        txHash: daoDeployment.txHash,
        blockNumber: daoDeployment.receipt.blockNumber,
        gasUsed: daoDeployment.receipt.gasUsed.toString()
      }
    };

    return {
      token: tokenDeployment.address,
      rewards: rewardsDeployment.address,
      dao: daoDeployment.address
    };
  }

  // Setup contract permissions and initial configuration
  async setupContracts(addresses) {
    console.log("⚙️ Setting up permissions...");
    
    const ossToken = await ethers.getContractAt("OSSToken", addresses.token);
    
    // Add minter role to Rewards V2 contract
    console.log("🔐 Adding minter role to Rewards V2...");
    const addMinterTx = await ossToken.addMinter(addresses.rewards);
    console.log(`📤 Add minter transaction: ${addMinterTx.hash}`);
    await this.waitForTransaction(addMinterTx.hash);
    console.log("✅ Minter role added\n");

    // Initial token distribution
    await this.mintInitialTokens(ossToken);
  }

  async mintInitialTokens(ossToken) {
    console.log("💰 Minting initial tokens...");
    
    const mintAmount = ethers.parseEther(CONFIG.INITIAL_MINT);
    console.log(`🪙 Minting ${CONFIG.INITIAL_MINT} OSS tokens to deployer...`);
    
    const mintTx = await ossToken.mint(this.deployer.address, mintAmount);
    console.log(`📤 Mint transaction: ${mintTx.hash}`);
    await this.waitForTransaction(mintTx.hash);
    console.log("✅ Initial tokens minted\n");
  }

  // Save deployment information to files
  async saveDeploymentInfo() {
    console.log("💾 Saving deployment information...");
    
    await this.saveDeploymentFile();
    await this.updateFrontendConfig();
    
    console.log("✅ Deployment information saved\n");
  }

  async saveDeploymentFile() {
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `${this.network.name}-v2.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(this.deploymentInfo, null, 2));
    console.log(`📄 Deployment info: ${deploymentFile}`);
  }

  async updateFrontendConfig() {
    const contracts = this.deploymentInfo.contracts;
    const frontendConfigPath = path.join(__dirname, "..", "src", "utils", "contracts.js");
    
    const frontendConfig = this.generateFrontendConfig(contracts);
    fs.writeFileSync(frontendConfigPath, frontendConfig);
    console.log(`🔄 Frontend config: ${frontendConfigPath}`);
  }

  generateFrontendConfig(contracts) {
    return `// Auto-generated contract addresses - DO NOT EDIT MANUALLY
// Generated on: ${this.deploymentInfo.timestamp}

export const CONTRACT_ADDRESSES = {
  TOKEN: "${contracts.OSSToken.address}",
  REWARDS: "${contracts.OSSRewardsV2.address}",
  DAO: "${contracts.OSSDAO.address}",
};

export const DEPLOYMENT_INFO = {
  network: "${this.network.name}",
  chainId: ${Number(this.network.chainId)},
  deployedAt: "${this.deploymentInfo.timestamp}",
  deployer: "${this.deployer.address}",
  version: "v2",
  gasUsed: {
    token: ${contracts.OSSToken.gasUsed},
    rewards: ${contracts.OSSRewardsV2.gasUsed},
    dao: ${contracts.OSSDAO.gasUsed},
  },
};
`;
  }

  // Display deployment summary
  displaySummary() {
    const contracts = this.deploymentInfo.contracts;
    
    console.log("\n🎉 OSS DAO V2 Deployment Complete!");
    console.log("=".repeat(60));
    console.log(`📋 Network: ${this.network.name} (${this.network.chainId})`);
    console.log(`👤 Deployer: ${this.deployer.address}`);
    console.log(`⏰ Timestamp: ${this.deploymentInfo.timestamp}\n`);
    
    console.log("📄 Contract Addresses:");
    console.log(`🪙 Token: ${contracts.OSSToken.address}`);
    console.log(`🏆 Rewards V2: ${contracts.OSSRewardsV2.address}`);
    console.log(`🗳️  DAO: ${contracts.OSSDAO.address}\n`);
    
    this.displayVerificationCommands(contracts);
    this.displayBlockExplorerLinks(contracts);
    this.displayNextSteps();
  }

  displayVerificationCommands(contracts) {
    console.log("🔗 Verification Commands:");
    console.log(`npx hardhat verify --network ${this.network.name} ${contracts.OSSToken.address}`);
    console.log(`npx hardhat verify --network ${this.network.name} ${contracts.OSSRewardsV2.address} ${contracts.OSSToken.address}`);
    console.log(`npx hardhat verify --network ${this.network.name} ${contracts.OSSDAO.address} ${contracts.OSSToken.address}\n`);
  }

  displayBlockExplorerLinks(contracts) {
    const baseUrl = this.getBlockExplorerUrl();
    if (baseUrl) {
      console.log("🌐 Block Explorer:");
      console.log(`Token: ${baseUrl}/address/${contracts.OSSToken.address}`);
      console.log(`Rewards V2: ${baseUrl}/address/${contracts.OSSRewardsV2.address}`);
      console.log(`DAO: ${baseUrl}/address/${contracts.OSSDAO.address}\n`);
    }
  }

  getBlockExplorerUrl() {
    const explorers = {
      'holesky': 'https://holesky.etherscan.io',
      'sepolia': 'https://sepolia.etherscan.io',
      'mainnet': 'https://etherscan.io',
      'polygon': 'https://polygonscan.com',
      'mumbai': 'https://mumbai.polygonscan.com'
    };
    return explorers[this.network.name.toLowerCase()];
  }

  displayNextSteps() {
    console.log("💡 Next Steps:");
    console.log("1. Start the React app: npm start");
    console.log("2. Connect your wallet to the app");
    console.log("3. The OSS token will be automatically added to MetaMask");
    console.log("4. Become a validator by staking 1,000 OSS tokens");
    console.log("5. Submit contributions and start earning rewards!");
    console.log("\n🚀 Your OSS DAO platform is now live!");
  }

  // Main deployment orchestration
  async deploy() {
    try {
      await this.initialize();
      const addresses = await this.deployContracts();
      await this.setupContracts(addresses);
      await this.saveDeploymentInfo();
      this.displaySummary();
    } catch (error) {
      console.error("\n❌ Deployment failed:", error.message);
      if (process.env.DEBUG) {
        console.error("Stack trace:", error.stack);
      }
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const deploymentManager = new DeploymentManager();
  await deploymentManager.deploy();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  });