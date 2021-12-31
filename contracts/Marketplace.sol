//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; //Starts from 1
    Counters.Counter private _itemsSold; //Starts from 1

    address payable owner;
    uint256 listingCommision = 0.02 ether;

    mapping(uint256 => MarketItem) private marketItems;

    constructor() {
        owner = payable(msg.sender);
    }

    function getListingCommision() public view returns (uint256) {
        return listingCommision;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(
            msg.value == listingCommision,
            "Listing commision is insufficient"
        );
        require(
            price > 0.05 ether,
            "Listing price should be at least 0.05 ETH"
        );

        _itemIds.increment();
        uint256 newItemId = _itemIds.current();

        marketItems[newItemId] = MarketItem(
            newItemId,
            tokenId,
            price,
            false,
            payable(msg.sender),
            payable(address(0)),
            nftContract
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            price,
            newItemId,
            tokenId,
            nftContract,
            msg.sender,
            address(0)
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        MarketItem storage marketItem = marketItems[itemId];
        require(
            msg.value == marketItem.price,
            "Price should be equal to item price"
        );
        require(marketItem.itemId == itemId, "This item does not exist");
        //Transfer the NTF value to seller
        marketItem.seller.transfer(msg.value);

        //Transfer the ownership of NFT to buyer
        IERC721(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            marketItem.tokenId
        );

        marketItem.isSold = true;
        marketItem.owner = payable(msg.sender);

        _itemsSold.increment();

        //Pay the commision
        payable(owner).transfer(listingCommision);

        emit MarketItemSold(
            marketItem.price,
            itemId,
            marketItem.tokenId,
            nftContract,
            marketItem.seller,
            msg.sender
        );
    }

    //Return market items
    function getAllMarketItems() public view returns (MarketItem[] memory) {
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        MarketItem[] memory unsoldItems = new MarketItem[](unsoldItemCount);

        uint256 index = 0;

        for (uint256 i = 0; i < unsoldItemCount; i++) {
            if (marketItems[i + 1].owner == address(0)) {
                unsoldItems[index] = marketItems[marketItems[i + 1].itemId];
                index += 1;
            }
        }
        return unsoldItems;
    }

    //Return NFTs of caller
    function getMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 index = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory nfts = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                nfts[index] = marketItems[currentId];
                index += 1;
            }
        }
        return nfts;
    }

    //Return the items created by a specific user
    function getNFTsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 index = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory nfts = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                nfts[index] = marketItems[currentId];
                index += 1;
            }
        }
        return nfts;
    }

    //Return nft by itemId
    function getNFT(uint256 itemId) public view returns (MarketItem memory) {
        uint256 totalItemCount = _itemIds.current();
        MarketItem memory item;
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (marketItems[i + 1].itemId == itemId) {
                item = marketItems[i + 1];
            }
        }
        return item;
    }

    //Structs
    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        bool isSold;
        address payable seller;
        address payable owner;
        address nftContract;
    }

    //Events

    event MarketItemCreated(
        uint256 price,
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address seller,
        address owner
    );

    event MarketItemSold(
        uint256 price,
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address seller,
        address buyer
    );
}
