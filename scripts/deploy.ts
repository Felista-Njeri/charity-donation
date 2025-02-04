const hre = require("hardhat");

async function main() {
    await hre.run('compile');

    const CharityDonation = await hre.ethers.getContractFactory("CharityDonation");
    const charityDonation = await CharityDonation.deploy();
    await charityDonation.waitForDeployment();

    console.log("Charity Donation Contract Address", await charityDonation.getAddress())
}

main().then( () => process.exit(0))
.catch( (error) => {
    console.error(error);
    process.exit(1);
});