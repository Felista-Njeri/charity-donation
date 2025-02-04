import { expect } from "chai";
import { ethers } from "hardhat";
import { CharityDonation } from "../typechain-types";

describe("CharityDonation", function () {
    let contract: CharityDonation;
    let owner: any;
    let donor1: any;
    let donor2: any;

    beforeEach(async function () {
        const CharityDonationFactory = await ethers.getContractFactory("CharityDonation");
        [owner, donor1, donor2] = await ethers.getSigners();
        
        // Deploy the contract
        const deployedContract = await CharityDonationFactory.deploy();
        await deployedContract.deployed();
        
        // Cast the deployed contract to the CharityDonation type
        contract = deployedContract as CharityDonation;
    });

    it("should create a campaign", async function () {
        await contract.createCampaign("Test Campaign", "Description", ethers.utils.parseEther("10"));
        const campaign = await contract.campaigns(1);
        expect(campaign.title).to.equal("Test Campaign");
    });

    it("should allow donations", async function () {
        await contract.createCampaign("Test Campaign", "Description", ethers.utils.parseEther("10"));
        await contract.connect(donor1).donateToCampaign(1, { value: ethers.utils.parseEther("1") });

        const campaign = await contract.campaigns(1);
        expect(campaign.raisedAmount.toString()).to.equal(ethers.utils.parseEther("1").toString());
    });

    it("should allow the owner to withdraw funds", async function () {
        await contract.createCampaign("Test Campaign", "Description", ethers.utils.parseEther("10"));
        await contract.connect(donor1).donateToCampaign(1, { value: ethers.utils.parseEther("1") });

        const balanceBefore = await ethers.provider.getBalance(owner.address);
        await contract.withdrawFunds(1);
        const balanceAfter = await ethers.provider.getBalance(owner.address);

        expect(balanceAfter).to.be.gt(balanceBefore);
    });
});
