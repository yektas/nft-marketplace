//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract HeraCollection is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;

  address marketplaceContractAddress;


  constructor(address _marketplaceContractAddress) ERC721("BoredHeraClub", "BHRC") {
    marketplaceContractAddress = _marketplaceContractAddress;
  }

  function createBoredHera(string memory tokenURI) public returns (uint) {
    tokenIds.increment();
    uint256 newItemId = tokenIds.current();

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);
    setApprovalForAll(marketplaceContractAddress, true);
    return newItemId;
    
  }
}