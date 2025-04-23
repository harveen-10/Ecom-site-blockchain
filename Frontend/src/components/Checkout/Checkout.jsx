import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import { ethers } from 'ethers';
import './Checkout.css'
import PaymentWithLoyalty from "D:/harveen/Harveen/E-com site - Blockchain/Frontend/src/PaymentWithLoyalty.json";
import LoyaltyToken from 'D:/harveen/Harveen/E-com site - Blockchain/Frontend/src/LoyaltyToken.json';

const CONTRACT_ADDRESS = "0x29cE5d63f0d206A46d406D84eaF9780105e36dd3";
const LOYALTY_TOKEN_ADDRESS = "0x3581b2E2F73087809Bfd53F36E5A8187311DbdA2";

function Checkout() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    console.log("currentuser", currentUser);

    const [finalvalue, setfinalvalue] = useState(0);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [discountInINR, setDiscountInINR] = useState(0);
    const [finalAmountINR, setFinalAmountINR] = useState(finalvalue);
    const [pointsToBeEarned, setPointsToBeEarned] = useState(0);
    const [pointsToBeUsed, setPointsToBeUsed] = useState(0);
    const [showLoyaltyDiscount, setShowLoyaltyDiscount] = useState(false);

    // Constants for conversion
    const INR_PER_POINT_REDEEM = 20;  // Value when redeeming points (20 INR discount per point)
    const INR_PER_POINT_EARN = 125;   // Value when earning points (1 point per 125 INR)
    const INR_TO_ETH = 0.0000042;     // 1 INR = 0.0000042 ETH

    const [userdetails, setuserdetails] = useState([{
        item: "",
        price: "",
        quantity: ""
    }]);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState("0");

    const navigate = useNavigate();

    useEffect(() => {
        const getdata = async () => {
            try {
                const response = await fetch(`http://localhost:3000/cart?email=${encodeURIComponent(currentUser.email)}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    }
                });
                
                const data = await response.json();
                console.log("data in checkout: ", data.rows);
                setuserdetails(data.rows.map(user => ({
                    item: user.item,
                    price: user.price,
                    quantity: user.quantity
                })));

                const total = data.rows.reduce((acc, user) => acc + (user.price * user.quantity), 0);
                setfinalvalue(total);
                setFinalAmountINR(total);
                // Calculate how many points will be earned from this purchase
                setPointsToBeEarned(Math.floor(total / INR_PER_POINT_EARN));
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        getdata();
    }, []);

    const connectWallet = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const instance = new ethers.Contract(CONTRACT_ADDRESS, PaymentWithLoyalty.abi, signer);
        setContract(instance);
        console.log("instance: ", instance);
        return instance;
    };

    const getBalance = async (instance) => {
        if (!instance) return;
        const bal = await instance.getBalance();
        setBalance(ethers.formatEther(bal));
    };

    const loadLoyaltyDiscount = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const userAddress = await signer.getAddress();
        
            const loyaltyContract = new ethers.Contract(
                LOYALTY_TOKEN_ADDRESS,
                LoyaltyToken.abi,
                signer
            );
        
            const points = await loyaltyContract.balanceOf(userAddress);
            console.log("Available loyalty points: ", points.toString());
            const usablePoints = Math.floor(Number(points)); // use full points only
            setLoyaltyPoints(usablePoints);
        
            // Calculate maximum discount (20 INR per point)
            const maxDiscount = usablePoints * INR_PER_POINT_REDEEM;
            
            // Don't apply more discount than the total amount
            const applicableDiscount = Math.min(maxDiscount, finalvalue);
            
            setDiscountInINR(applicableDiscount);
            console.log("Discount amount (INR): ", applicableDiscount);
            
            // Calculate final amount after applying discount
            const finalAmount = finalvalue - applicableDiscount;
            console.log("Final amount after discount (INR): ", finalAmount);

            // Calculate points that will be used
            const pointsUsed = Math.ceil(applicableDiscount / INR_PER_POINT_REDEEM);
            console.log("Points that will be used: ", pointsUsed);
            setPointsToBeUsed(pointsUsed);
            
            // Calculate points that will be earned from the remaining amount
            const pointsEarned = Math.floor(finalAmount / INR_PER_POINT_EARN);
            setPointsToBeEarned(pointsEarned);
            
            console.log("Points that will be earned: ", pointsEarned);
            
        } catch (err) {
            console.error("Error loading loyalty discount:", err);
        }
    };

    useEffect(() => {
        // Load initial loyalty points info
        const loadInitialPoints = async () => {
            try {
                await loadLoyaltyDiscount();
            } catch (err) {
                console.error("Error loading initial loyalty points:", err);
            }
        };
        
        loadInitialPoints();
    }, [finalvalue]);

    // Normal payment without using loyalty points
    const payNormal = async () => {
        try {
            const instance = await connectWallet();
            console.log("connected");

            // Calculate the ETH amount to pay (full amount, no discount)
            const ethAmountToPay = (finalvalue * INR_TO_ETH).toFixed(6);
            console.log("ETH amount to pay (normal): ", ethAmountToPay);
            const valueToSend = ethers.parseEther(ethAmountToPay);
            console.log("Value to send (wei): ", valueToSend.toString());

            // Calculate normal points to be earned
            const pointsToEarn = Math.floor(finalvalue / INR_PER_POINT_EARN);

            // Execute the payment transaction
            console.log("Calling contract.payNormal");
            const tx = await instance.payNormal({ value: valueToSend });
            console.log("Transaction initiated:", tx.hash);
            
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);

            await getBalance(instance);
            console.log("Payment successful!");
            
            // Show confirmation message with points earned
            alert(`Payment successful! You earned ${pointsToEarn} loyalty points.`);
            
            await goToHome();

        } catch (err) {
            console.error("Payment failed: ", err);
            if (err.code === 'ACTION_REJECTED') {
                console.log("User rejected the transaction");
                alert("Transaction was rejected. Please try again.");
            } else {
                console.log("Detailed error:", err);
                alert("Payment failed. Please check your wallet and try again.");
            }
        }
    };

    // Payment using loyalty points
    const payWithLoyaltyPoints = async () => {
        try {
            const instance = await connectWallet();
            console.log("connected");

            // Calculate how many loyalty points to use (rounding up to ensure full coverage)
            const usePoints = Math.ceil(discountInINR / INR_PER_POINT_REDEEM);
            console.log("Points to use: ", usePoints);

            // Calculate the ETH amount to pay (already discounted)
            const discountedAmount = finalvalue - discountInINR;
            const ethAmountToPay = (discountedAmount * INR_TO_ETH).toFixed(6);
            console.log("ETH amount to pay (with loyalty discount): ", ethAmountToPay);
            const valueToSend = ethers.parseEther(ethAmountToPay);
            console.log("Value to send (wei): ", valueToSend.toString());

            // Execute the payment transaction
            console.log("Calling contract.payWithPoints with usePoints:", usePoints);
            const tx = await instance.payWithPoints(usePoints, { value: valueToSend });
            console.log("Transaction initiated:", tx.hash);
            
            // Wait for transaction to be mined
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);

            await getBalance(instance);
            console.log("Payment successful!");
            
            // Show confirmation message with points used and earned
            alert(`Payment successful! Used ${usePoints} points for discount and earned ${pointsToBeEarned} new points.`);
            
            await goToHome();

        } catch (err) {
            console.error("Payment failed: ", err);
            if (err.code === 'ACTION_REJECTED') {
                console.log("User rejected the transaction");
                alert("Transaction was rejected. Please try again.");
            } else {
                console.log("Detailed error:", err);
                alert("Payment failed. Please check your wallet and try again.");
            }
        }
    };

    const toggleLoyaltyDiscount = () => {
        setShowLoyaltyDiscount(!showLoyaltyDiscount);
    };

    const goToHome = async () => {
        try {
            const response = await fetch(`http://localhost:3000/checkout`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(currentUser)
            });

            const data = await response.text();
            console.log(data);  

        } catch (error) {
            console.error('Error fetching data: ', error);
        } 

        navigate('/home', { state: { currentUser } });
    };

    // Calculate points that will be earned for normal payment
    const normalPaymentPointsToEarn = Math.floor(finalvalue / INR_PER_POINT_EARN);

    return <>
        <div className='my-8 border border-black rounded-xl w-1/2 h-auto mx-auto font-raleway'>
            <div className='py-8'>
                <div className='flex justify-center mb-4 font-bold'>
                    PRODUCT DETAILS
                </div>
                <div className='flex justify-center'>
                    <hr className='w-5/6 m-2 border-b border-black'/>
                </div>
                <div className="product-container">
                        <div className="product-item">
                            <p id='item'>Item</p>
                            <p>Quantity</p>
                            <p>Price (₹)</p>
                        </div>
                </div>
                <div className='flex justify-center'>
                    <hr className='w-5/6 mt-2 mb-4 border-b border-dotted border-gray-400'/>
                </div>
                <div className="product-container">
                    {userdetails.map((product, index) => (
                        <div className="product-item" key={index}>
                            <p id='item'>{product.item}</p>
                            <p>{Number(product.quantity)}</p>
                            <p>{Number(product.quantity) * Number(product.price)}</p>
                        </div>
                    ))}
                </div>
                <div className='flex justify-center'>
                    <hr className='w-5/6 mb-2 mt-4 border-b border-dotted border-gray-400'/>
                </div>
                <div className='product-container'>
                    <div className="product-item">
                        <p id='item' className='font-bold'>Total cost</p>
                        <p></p>
                        <p className='font-bold'>₹{finalvalue}</p>
                    </div>
                </div>
                <div className='product-container'>
                    <div className="product-item">
                        <p id='item' className='text-blue-600'>Points you'll earn</p>
                        <p></p>
                        <p className='text-blue-600'>{normalPaymentPointsToEarn}</p>
                    </div>
                </div>
            </div>
            
            {/* Normal Payment Button */}
            <div className='flex justify-center'>
                <button
                    className="mx-12 my-4 px-8 py-2 border border-[#5C75CF] bg-[#5C75CF] text-white rounded-lg shadow hover:bg-[#1C3068] text-lg"
                    onClick={payNormal}
                >
                    Pay
                </button>
            </div>
            <div className='flex justify-center text-blue-600 cursor-pointer mt-2 mb-4' onClick={toggleLoyaltyDiscount}>
                {showLoyaltyDiscount ? "Hide loyalty discount options" : "Show loyalty discount options"}
            </div>
            
            {/* Loyalty Payment Details */}
            {showLoyaltyDiscount && (
                <div className='px-8 py-4 bg-blue-50 mx-6 mb-4 rounded-lg'>
                    <div className='text-lg font-semibold mb-2 text-center'>Loyalty Discount Details</div>
                    
                    <div className='product-container'>
                        <div className="product-item">
                            <p id='item'>Total cost</p>
                            <p></p>
                            <p>₹{finalvalue}</p>
                        </div>
                    </div>
                    
                    <div className='product-container'>
                        <div className="product-item">
                            <p id='item' className='text-green-600'>Loyalty discount</p>
                            <p></p>
                            <p className='text-green-600'>- ₹{discountInINR}</p>
                        </div>
                    </div>
                    
                    <div className='product-container'>
                        <div className="product-item">
                            <p id='item' className='font-bold'>Final amount</p>
                            <p></p>
                            <p className='font-bold'>₹{finalvalue - discountInINR}</p>
                        </div>
                    </div>
                    
                    <div className='product-container'>
                        <div className="product-item">
                            <p id='item' className='text-blue-600'>Points being used</p>
                            <p></p>
                            <p className='text-blue-600'>{pointsToBeUsed}</p>
                        </div>
                    </div>
                    
                    <div className='product-container'>
                        <div className="product-item">
                            <p id='item' className='text-blue-600'>Points you'll earn</p>
                            <p></p>
                            <p className='text-blue-600'>{pointsToBeEarned}</p>
                        </div>
                    </div>
                    
                    <div className='flex justify-center mt-4'>
                        <button
                            className="px-8 py-2 border border-green-600 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 text-lg"
                            onClick={payWithLoyaltyPoints}
                            disabled={loyaltyPoints <= 0}
                        >
                            Pay with Loyalty Points
                        </button>
                    </div>
                </div>
            )}
        </div>
    </>
}

export default Checkout