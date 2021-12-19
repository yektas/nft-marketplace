import { expect } from "chai";
import { ethers } from "hardhat";

describe("Marketplace", function () {
  it("Should create and sell NFTS", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();

    const marketAddress = market.address;

    const HeraCollectionNFT = await ethers.getContractFactory("HeraCollection");
    const nft = await HeraCollectionNFT.deploy(marketAddress);
    await nft.deployed();
    const nftAddress = nft.address;

    let listingCommision = await market.getListingCommision();

    const price = ethers.utils.parseUnits("1", "ether");

    const nft1 = await nft.createBoredHera("QmR9iasTahv1HZRP4DsZySxn1m3qzvBKXsGhkKyWcfFuHV"); // Hera Wink
    await nft1.wait();
    const nft2 = await nft.createBoredHera("QmYqb3cCkRQazJPqp29BoQGVP118ikA7e1hEsWSB4pZmnk"); // Hera Explore
    await nft2.wait();

    await market.createMarketItem(nftAddress, 1, price, { value: listingCommision });
    await market.createMarketItem(nftAddress, 2, price, { value: listingCommision });

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftAddress, 1, { value: price });

    const items = await market.getAllMarketItems();
    expect(items.length).to.equal(1);
  });
});
