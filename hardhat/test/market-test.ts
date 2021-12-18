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

    const nft1 = await nft.createBoredHera("QmfYpPex3TMPdiHtyme7nuXH7RRgaza14ofuQJBzALgX1S"); // Hera Wink
    await nft1.wait();
    const nft2 = await nft.createBoredHera("QmNsRGx867xX9hPze2MhUjyb3jQp21LCatfpa6ax4C3zXR"); // Hera Explore
    await nft2.wait();

    await market.createMarketItem(nftAddress, 1, price, { value: listingCommision });
    await market.createMarketItem(nftAddress, 2, price, { value: listingCommision });

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftAddress, 1, { value: price });

    const items = await market.getAllMarketItems();
    expect(items.length).to.equal(1);
  });
});
