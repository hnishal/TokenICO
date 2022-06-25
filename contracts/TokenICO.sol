// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenICO is Ownable, ERC20, ReentrancyGuard {
    IERC721Enumerable NFT;
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant tokensPerNFT = 10 * 10**18;
    uint256 public constant maxTotalSupply = 10000 * 10**18;

    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _nftAddress) ERC20("Coin Offering", "CT") {
        NFT = IERC721Enumerable(_nftAddress);
    }

    function mint(uint256 amount) public payable {
        require(msg.value == amount * tokenPrice, "Invalid amount sent!");
        uint256 amountWithDecimal = amount * 10**18;
        //to keep total supply under the maxlimit
        require(
            (totalSupply() + amountWithDecimal) <= maxTotalSupply,
            "Exceeds the max total supply available."
        );
        _mint(msg.sender, amountWithDecimal);
    }

    function claim() public nonReentrant {
        address sender = msg.sender;
        uint256 balance = NFT.balanceOf(sender);
        require(balance > 0, "No nfts owned");
        uint256 amount = 0;
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = NFT.tokenOfOwnerByIndex(sender, i);
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }
        require(amount > 0, "You have already claimed the tokens");
        _mint(sender, amount * tokensPerNFT);
    }

    receive() external payable {}

    fallback() external payable {}
}
