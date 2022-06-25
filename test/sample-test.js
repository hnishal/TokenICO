const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const should = require("chai").should();

describe("Token ICO", function () {
  var deployer, addr1, addr2, addrs;
  var nftContract, tokenICO;

  before(async function () {
    [deployer, addr1, addr2, ...addrs] = await ethers.getSigners();
    const nftContractFactory = await ethers.getContractFactory("NftDrop");
    const tokenICOFactory = await ethers.getContractFactory("TokenICO");
    nftContract = await nftContractFactory.deploy("My Token", "TokenICO", "https://gateway.pinata.cloud/ipfs/QmbfBtNKJgtUfe5TAto7eEQWXURKSvN32hk8CTK5W5Y8VF");
    nftContract.deployed();
    console.log("NFT Contract Deployed Successfully: ", nftContract.address);
    tokenICO = await tokenICOFactory.deploy(nftContract.address);
    tokenICO.deployed();
    console.log("tokenICO deployed successfully: ", tokenICO.address);
  })

  it("should mint an nft", async () => {
    await nftContract.mint({ value: ethers.utils.parseEther("0.01") });
    await nftContract.connect(addr1).mint({ value: ethers.utils.parseEther("0.01") });
    await nftContract.connect(addr1).mint({ value: ethers.utils.parseEther("0.01") });
    await nftContract.connect(addr2).mint({ value: ethers.utils.parseEther("0.01") });

    expect(await nftContract.balanceOf(deployer.address)).to.equal(1);
    expect(await nftContract.balanceOf(addr1.address)).to.equal(2);
    expect(await nftContract.balanceOf(addr2.address)).to.equal(1);

  })

  it("should mint some ico tokens", async () => {
    await tokenICO.mint(3, { value: ethers.utils.parseEther("0.003") });

    expect(await tokenICO.balanceOf(deployer.address)).to.equal(ethers.utils.parseEther("3"));
  })

  it("should claim ICO tokens", async () => {
    await tokenICO.connect(addr1).claim();

    expect(await tokenICO.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("20"));
  })

  it("should revert if claim is called again", async () => {
    await expect(tokenICO.connect(addr1).claim()).to.be.revertedWith("You have already claimed the tokens");
  })

  it("should allow to claim on minting more nfts", async () => {
    await nftContract.connect(addr1).mint({ value: ethers.utils.parseEther("0.01") });
    await tokenICO.connect(addr1).claim();
    expect(await tokenICO.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("30"));
  })

});
