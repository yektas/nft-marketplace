import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { HeraCollection, Marketplace } from "../typechain-types";

let market: Marketplace;
let nft: HeraCollection;
let owner: SignerWithAddress;
let addr1: SignerWithAddress;
let addrs: SignerWithAddress[];
const price = ethers.utils.parseUnits("5", "ether");

describe("Marketplace", function () {
  beforeEach(async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    [owner, addr1, ...addrs] = await ethers.getSigners();
    market = (await Market.deploy()) as Marketplace;
    await market.deployed();
    const marketAddress = market.address;

    const HeraCollectionNFT = await ethers.getContractFactory("HeraCollection");
    nft = (await HeraCollectionNFT.deploy(marketAddress)) as HeraCollection;
    await nft.deployed();
  });

  it("Should create 4 NFTs", async function () {
    await createNFTs();
    expect(4).equal(await (await nft.balanceOf(addr1.address)).toNumber());
  });

  it("Put NFT for sale", async function () {
    await createNFTs();
    await createMarketItems();

    const nftAddress = nft.address;

    const buyer = addrs[0];
    const tx = await market.connect(buyer).createMarketSale(nftAddress, 2, { value: price });
    await tx.wait();

    const buyerNfts = await market.connect(buyer).getMyNFTs();
    expect(buyerNfts.length).equal(1);
    expect(buyerNfts[0].itemId.toNumber()).equal(2);
  });

  /* it("Sell NFT for sale", async function () {
    await createNFTs();
    await createMarketItems();

    const nftAddress = nft.address;
    let listingCommision = await market.getListingCommision();

    const buyer = addrs[0];
    const tx = await market.connect(buyer).createMarketSale(nftAddress, 2, { value: price });
    await tx.wait();

    const buyerNfts = await market.connect(buyer).getMyNFTs();

    const owner = await nft.ownerOf(2);
    console.log("owner", owner);
    console.log("buyer ", buyer.address);
    const newPrice = ethers.utils.parseUnits("13", "ether");
    const s = await market
      .connect(buyer)
      .createMarketItem(nftAddress, 2, newPrice, { value: listingCommision });
    await s.wait();
  }); */
});

async function createNFTs() {
  const nft1 = await nft
    .connect(addr1)
    .createBoredHera("QmR9iasTahv1HZRP4DsZySxn1m3qzvBKXsGhkKyWcfFuHV"); // Hera Wink
  await nft1.wait();

  const nft2 = await nft
    .connect(addr1)
    .createBoredHera("QmYqb3cCkRQazJPqp29BoQGVP118ikA7e1hEsWSB4pZmnk"); // Hera Explore
  await nft2.wait();

  const nft3 = await nft
    .connect(addr1)
    .createBoredHera("QmSFPaccQynUMALMLLJZk6LDEQY6XUFosv7BhCwiELVRHV"); // Hera Careful
  await nft3.wait();

  const nft4 = await nft
    .connect(addr1)
    .createBoredHera("QmQxHJVSoudZBDmvfXAXAHGTCHPmxvyFepATTh98YdForS"); // Hera TEST
  await nft4.wait();
}

async function createMarketItems() {
  const nftAddress = nft.address;
  let listingCommision = await market.getListingCommision();

  const s = await market
    .connect(addr1)
    .createMarketItem(nftAddress, 1, price, { value: listingCommision });
  const s2 = await market
    .connect(addr1)
    .createMarketItem(nftAddress, 2, price, { value: listingCommision });
  const s3 = await market
    .connect(addr1)
    .createMarketItem(nftAddress, 3, price, { value: listingCommision });
  const s4 = await market
    .connect(addr1)
    .createMarketItem(nftAddress, 4, price, { value: listingCommision });
  await s.wait();
  await s2.wait();
  await s3.wait();
  await s4.wait();
}
