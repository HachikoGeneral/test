import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Chikoverse First NFT",
        "website":"https://chikoverse.com",
        "image":"https://gateway.pinata.cloud/ipfs/QmRtNitYpPXYsiKWhh3Dfioa2wzPeYYbyNRAqNBzfLmp2W",
        "price":"0.03CHK",
        "currentlySelling":"False",
        "address":"0xf5E4636000aBb8002d63ac228F82a67e18a4A4e7",
    },
    {
        "name": "NFT#2",
        "description": "Chikoverse Second NFT",
        "website":"https://chikoverse.com",
        "image":"https://gateway.pinata.cloud/ipfs/QmafL6zRUBumnw2AoGGH5wHPW2qoHrFEGsF8Ppng4NW5My",
        "price":"0.03ETH",
        "currentlySelling":"False",
        "address":"0xf5E4636000aBb8002d63ac228F82a67e18a4A4e7",
    },
    {
        "name": "NFT#3",
        "description": "Chikoverse Third NFT",
        "website":"https://chikoverse.com",
        "image":"https://gateway.pinata.cloud/ipfs/QmZjzBUTKeNxjXzD6YBMhbp67n3iixjshTGBEXbFPWPM4t",
        "price":"0.03ETH",
        "currentlySelling":"False",
        "address":"0xf5E4636000aBb8002d63ac228F82a67e18a4A4e7",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Latest NFTs
            </div>
            <div className="flex mt-8 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}