// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CharityDonation {

    struct Campaign{
        uint256 id;
        string title; 
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        address payable owner;
        bool isCompleted;
    }

    struct Donor {
        address donorAddress;
        uint256 amount;
    }

    uint public campaignCount;

    mapping(uint => Campaign) public campaigns;
    mapping(uint => Donor[]) public donors;


    event CampaignCreated(uint id, string title, string description, uint targetAmount, address owner);
    event DonationReceived(uint id, address donor, uint amount);
    event FundsWithdrawn(uint id, address owner, uint amount);


    function createCampaign(string memory _title, string memory _description, uint256 _targetAmount) public {
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            owner: payable(msg.sender),
            isCompleted: false
        });

        emit CampaignCreated(campaignCount, _title, _description, _targetAmount, msg.sender);
  
    }

    function donateToCampaign(uint _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(!campaign.isCompleted, "Campaign already completed");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.raisedAmount += msg.value;
        donors[_id].push(Donor({donorAddress: msg.sender, amount: msg.value}));

        emit DonationReceived(_id, msg.sender, msg.value);

        if (campaign.raisedAmount >= campaign.targetAmount) {
            campaign.isCompleted = true;
        }
    }

    function withdrawFunds(uint _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only owner can withdraw funds");
        require(campaign.raisedAmount > 0, "No funds to withdraw");

        uint amount = campaign.raisedAmount;
        campaign.raisedAmount = 0;

        campaign.owner.transfer(amount);

        emit FundsWithdrawn(_id, msg.sender, amount);
    }
}
//https://github.com/Felista-Njeri/trustfund-collective.git
