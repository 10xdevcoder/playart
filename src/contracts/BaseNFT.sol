// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    struct Details {
        string tokenurl;
        uint256 tokenid;
    }

    mapping(address => Details[]) ownerNFT;

    constructor() ERC721("Play Art", "PA") {}

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        ownerNFT[msg.sender].push(Details(tokenURI, newItemId));
        return newItemId;
    }

    function addressNFT(address _add) public view returns (Details[] memory) {
        return ownerNFT[_add];
    }
}
