const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Helper: wait for transaction confirmation with retries
async function waitForTransactionWithRetries(provider, txHash, maxRetries = 10, delay = 10000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`⏳ [${i + 1}/${maxRetries}] Waiting for tx: ${txHash}`);
      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt) {
        console.log(`   ✅ Confirmed in block ${receipt.blockNumber}`);
        return receipt;
      }

      console.log(`   ⏳ Still pending... retry in ${delay / 1000}s`);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.log(`   ⚠️ Error (attempt ${i + 1}): ${error.message}`);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Transaction ${txHash} not confirmed after ${maxRetries} attempts`);
}

// Helper: deploy contract with manual confirmation
async function deployContractRobust(contractFactory, args = [], contractName = "Contract") {
  console.log(`\n🚀 Deploying: ${contractName}`);

  const contract = await contractFactory.deploy(...args);
  console.log(`   ↳ Tx Hash : ${contract.deploymentTransaction().hash}`);

  const receipt = await waitForTransactionWithRetries(
    contract.runner.provider,
    contract.deploymentTransaction().hash
  );

  const address = await contract.getAddress();
  console.log(`   ✅ Address: ${address}`);

  return { contract, address, receipt };
}

async function main() {
  console.log("🌐 Starting deployment →", network.name);

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Balance :", ethers.formatEther(balance), "ETH");

  let deploymentResults = {};

  try {
    // Deploy OSS Token
    const OSSToken = await ethers.getContractFactory("OSSToken");
    const tokenResult = await deployContractRobust(OSSToken, [], "OSS Token");
    deploymentResults.token = tokenResult;

    // Deploy OSS Rewards
    const OSSRewards = await ethers.getContractFactory("OSSRewards");
    const rewardsResult = await deployContractRobust(OSSRewards, [tokenResult.address], "OSS Rewards");
    deploymentResults.rewards = rewardsResult;

    // Deploy OSS DAO
    const OSSDAO = await ethers.getContractFactory("OSSDAO");
    const daoResult = await deployContractRobust(OSSDAO, [tokenResult.address], "OSS DAO");
    deploymentResults.dao = daoResult;

    // Setup permissions
    console.log("\n🔧 Configuring permissions...");

    console.log("   ➕ Granting minter role → OSS Rewards");
    const addMinterTx = await tokenResult.contract.addMinter(rewardsResult.address);
    console.log(`   ↳ Tx Hash : ${addMinterTx.hash}`);
    await waitForTransactionWithRetries(deployer.provider, addMinterTx.hash);
    console.log("   ✅ Minter role granted");

    console.log("   💸 Transferring 1M tokens → DAO Treasury");
    const transferAmount = ethers.parseEther("1000000");
    const transferTx = await tokenResult.contract.transfer(daoResult.address, transferAmount);
    console.log(`   ↳ Tx Hash : ${transferTx.hash}`);
    await waitForTransactionWithRetries(deployer.provider, transferTx.hash);
    console.log("   ✅ Transfer complete");

    // Save deployment info
    const deploymentInfo = {
      network: network.name,
      chainId: network.config.chainId,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        OSSToken: {
          address: tokenResult.address,
          name: "Open Source Rewards",
          symbol: "OSS",
          deploymentBlock: tokenResult.receipt.blockNumber
        },
        OSSRewards: {
          address: rewardsResult.address,
          deploymentBlock: rewardsResult.receipt.blockNumber
        },
        OSSDAO: {
          address: daoResult.address,
          deploymentBlock: daoResult.receipt.blockNumber
        }
      },
      transactions: {
        tokenDeploy: tokenResult.receipt.hash,
        rewardsDeploy: rewardsResult.receipt.hash,
        daoDeploy: daoResult.receipt.hash,
        addMinter: addMinterTx.hash,
        transferToDAO: transferTx.hash
      }
    };

    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("📄 Deployment info saved →", deploymentFile);

    // Update frontend config
    const frontendConfigPath = path.join(__dirname, "..", "src", "utils", "contracts.js");
    const frontendConfig = `// Auto-generated contract addresses - DO NOT EDIT
// Updated by deployment script

export const CONTRACT_ADDRESSES = {
  TOKEN: "${tokenResult.address}",
  REWARDS: "${rewardsResult.address}",
  DAO: "${daoResult.address}",
};

export const DEPLOYMENT_INFO = {
  network: "${network.name}",
  chainId: ${network.config.chainId},
  deployedAt: "${deploymentInfo.timestamp}",
  deployer: "${deployer.address}",
  gasUsed: {
    token: ${tokenResult.receipt.gasUsed.toString()},
    rewards: ${rewardsResult.receipt.gasUsed.toString()},
    dao: ${daoResult.receipt.gasUsed.toString()},
  },
};
`;
    fs.writeFileSync(frontendConfigPath, frontendConfig);
    console.log("🎨 Frontend config updated →", frontendConfigPath);

    // Summary
    console.log("\n📋 Deployment Summary");
    console.log("─────────────────────────────");
    console.log(`🪙 Token   : ${tokenResult.address}`);
    console.log(`🎁 Rewards : ${rewardsResult.address}`);
    console.log(`🏛️ DAO     : ${daoResult.address}`);
    console.log("─────────────────────────────");

    if (["holesky", "holesky2", "holesky3"].includes(network.name)) {
      console.log("\n🔍 Verify contracts on Etherscan:");
      console.log(`   npx hardhat verify --network ${network.name} ${tokenResult.address}`);
      console.log(`   npx hardhat verify --network ${network.name} ${rewardsResult.address} ${tokenResult.address}`);
      console.log(`   npx hardhat verify --network ${network.name} ${daoResult.address} ${tokenResult.address}`);
    }

    console.log("\n💡 Next Steps:");
    console.log("   1️⃣ Frontend already updated");
    console.log("   2️⃣ Start app → npm start");
    console.log("   3️⃣ Connect MetaMask → Holesky testnet");
    console.log("   4️⃣ Test the full platform 🎯");

    console.log("\n✅ Deployment completed successfully!");

  } catch (error) {
    console.error(`\n❌ Deployment Error: ${error.message}`);

    if (Object.keys(deploymentResults).length > 0) {
      console.log("💾 Saving partial deployment info...");
      const partialInfo = {
        network: network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        status: "PARTIAL_FAILURE",
        deployedContracts: deploymentResults,
        error: error.message
      };

      const deploymentsDir = path.join(__dirname, "..", "deployments");
      if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
      }

      const partialFile = path.join(deploymentsDir, `${network.name}-partial.json`);
      fs.writeFileSync(partialFile, JSON.stringify(partialInfo, null, 2));
      console.log("📄 Partial deployment saved →", partialFile);
    }

    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
