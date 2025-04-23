// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILoyaltyToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

contract PaymentWithLoyalty {
    address public owner;
    uint256 public totalPayed;
    ILoyaltyToken public loyaltyToken;
    
    // Value of one loyalty point in Wei (1 point = 20 INR = 0.000084 ETH)
    uint256 public constant POINTS_VALUE_WEI = 0.000084 ether;
    
    // Points earning rate (1 point per 125 INR = 0.000525 ETH)
    uint256 public constant POINTS_EARNING_RATE_WEI = 0.000525 ether;

    constructor(address _loyaltyToken) {
        owner = msg.sender;
        loyaltyToken = ILoyaltyToken(_loyaltyToken);
    }

    event Payed(address indexed payer, uint256 amountPaid, uint256 pointsUsed, uint256 pointsEarned);
    event Withdrawn(address indexed by, uint256 amount);
    event LoyaltyPointsEarned(address indexed user, uint256 amount);

    // Normal payment without using loyalty points
    function payNormal() external payable {
        require(msg.value > 0, "No ETH sent");
        
        // Add the payment to total amount
        totalPayed += msg.value;
        
        // Issue new loyalty points (1 point per 0.000525 ETH spent, which is approximately 125 INR)
        uint256 newPoints = msg.value / POINTS_EARNING_RATE_WEI;
        
        if (newPoints > 0) {
            loyaltyToken.mint(msg.sender, newPoints);
            emit LoyaltyPointsEarned(msg.sender, newPoints);
        }
        
        emit Payed(msg.sender, msg.value, 0, newPoints);
    }

    // Payment using loyalty points
    function payWithPoints(uint256 usePoints) external payable {
        require(msg.value > 0 || usePoints > 0, "No ETH sent or points used");

        uint256 balance = loyaltyToken.balanceOf(msg.sender);
        uint256 pointsToUse = usePoints;
        
        // Make sure we don't try to use more points than the user has
        if (pointsToUse > balance) {
            pointsToUse = balance;
        }
        
        // If points are being used, burn them
        if (pointsToUse > 0) {
            loyaltyToken.burn(msg.sender, pointsToUse);
        }
        
        // Calculate total payment amount (msg.value represents the amount AFTER discount was applied in the frontend)
        uint256 totalPaymentAmount = msg.value;
        
        // Add the payment to total amount
        totalPayed += totalPaymentAmount;
        
        // Issue new loyalty points (1 point per 0.000525 ETH spent, which is approximately 125 INR)
        uint256 newPoints = totalPaymentAmount / POINTS_EARNING_RATE_WEI;
        
        if (newPoints > 0) {
            loyaltyToken.mint(msg.sender, newPoints);
            emit LoyaltyPointsEarned(msg.sender, newPoints);
        }
        
        emit Payed(msg.sender, totalPaymentAmount, pointsToUse, newPoints);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not the owner");
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance");
        payable(owner).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}