// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  var nftContract, tokenICO;
  const nftContractFactory = await ethers.getContractFactory("NftDrop");
  const tokenICOFactory = await ethers.getContractFactory("TokenICO");
  nftContract = await nftContractFactory.deploy("My Token", "TokenICO", "https://gateway.pinata.cloud/ipfs/QmbfBtNKJgtUfe5TAto7eEQWXURKSvN32hk8CTK5W5Y8VF");
  nftContract.deployed();
  console.log("NFT Contract Deployed Successfully: ", nftContract.address);
  tokenICO = await tokenICOFactory.deploy(nftContract.address);
  tokenICO.deployed();
  console.log("tokenICO deployed successfully: ", tokenICO.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
