// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NftDrop is Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter _tokenIdTracker;

    string public uri;
    uint256 public price = 0.01 ether;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri
    ) ERC721(_name, _symbol) {
        uri = _uri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(tokenId < _tokenIdTracker.current(), "invalid tokenid!!!");

        return uri;
    }

    function mint() public payable {
        require(msg.value == price, "not enough eth!!");
        uint256 tokenid = _tokenIdTracker.current();
        _mint(_msgSender(), tokenid);
        _tokenIdTracker.increment();
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
