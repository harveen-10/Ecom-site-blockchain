const LoyaltyToken = artifacts.require("LoyaltyToken");

module.exports = async function (deployer) {
  await deployer.deploy(LoyaltyToken);
};
