const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OSSToken", function () {
  // Contract instance and signers
  let ossToken;
  let owner, minter, user1, user2;

  // Test constants
  const INITIAL_SUPPLY = ethers.parseEther("10000000"); // 10 million tokens
  const MAX_SUPPLY = ethers.parseEther("100000000"); // 100 million tokens
  const TOKEN_NAME = "Open Source Rewards";
  const TOKEN_SYMBOL = "OSS";
  const TOKEN_DECIMALS = 18;

  /**
   * Deploy fresh contract instance before each test
   */
  beforeEach(async function () {
    // Get test signers
    [owner, minter, user1, user2] = await ethers.getSigners();

    // Deploy OSSToken contract
    const OSSToken = await ethers.getContractFactory("OSSToken");
    ossToken = await OSSToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct token name and symbol", async function () {
      expect(await ossToken.name()).to.equal(TOKEN_NAME);
      expect(await ossToken.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should mint initial supply to the contract deployer", async function () {
      const ownerBalance = await ossToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the correct number of decimals", async function () {
      expect(await ossToken.decimals()).to.equal(TOKEN_DECIMALS);
    });
  });

  describe("Minting Functionality", function () {
    it("Should allow owner to add authorized minters", async function () {
      // Add minter and verify authorization
      await ossToken.addMinter(minter.address);
      expect(await ossToken.minters(minter.address)).to.be.true;
    });

    it("Should allow authorized minters to mint tokens", async function () {
      // Setup: Add minter authorization
      await ossToken.addMinter(minter.address);
      const mintAmount = ethers.parseEther("1000");
      
      // Execute: Mint tokens to user1
      await ossToken.connect(minter).mint(user1.address, mintAmount);
      
      // Verify: Check user1's balance
      expect(await ossToken.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should reject minting attempts from unauthorized addresses", async function () {
      const mintAmount = ethers.parseEther("1000");
      
      // Attempt to mint without authorization should fail
      await expect(
        ossToken.connect(user1).mint(user2.address, mintAmount)
      ).to.be.revertedWith("Not authorized to mint");
    });

    it("Should enforce maximum supply limit during minting", async function () {
      // Setup: Add minter authorization
      await ossToken.addMinter(minter.address);
      
      // Calculate amount that would exceed max supply
      const currentSupply = await ossToken.totalSupply();
      const excessAmount = MAX_SUPPLY - currentSupply + ethers.parseEther("1");
      
      // Attempt to mint beyond max supply should fail
      await expect(
        ossToken.connect(minter).mint(user1.address, excessAmount)
      ).to.be.revertedWith("Would exceed max supply");
    });
  });

  describe("Token Burning", function () {
    it("Should allow token holders to burn their own tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await ossToken.balanceOf(owner.address);
      
      // Execute burn transaction
      await ossToken.burn(burnAmount);
      
      // Verify balance reduction
      const finalBalance = await ossToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance - burnAmount);
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause and unpause the contract", async function () {
      // Test pausing
      await ossToken.pause();
      expect(await ossToken.paused()).to.be.true;
      
      // Test unpausing
      await ossToken.unpause();
      expect(await ossToken.paused()).to.be.false;
    });

    it("Should block all token transfers when contract is paused", async function () {
      const transferAmount = ethers.parseEther("100");
      
      // Pause the contract
      await ossToken.pause();
      
      // Attempt transfer while paused should fail
      await expect(
        ossToken.transfer(user1.address, transferAmount)
      ).to.be.reverted;
    });
  });
});