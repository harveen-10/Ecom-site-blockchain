const LoyaltyToken = artifacts.require("LoyaltyToken");
const PaymentWithLoyalty = artifacts.require("PaymentWithLoyalty");

module.exports = async function (deployer) {
  const loyaltyInstance = await LoyaltyToken.deployed();
  const loyaltyTokenAddress = loyaltyInstance.address; 

  await deployer.deploy(PaymentWithLoyalty, loyaltyTokenAddress); 
};
