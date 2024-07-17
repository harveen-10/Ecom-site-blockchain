import React,{useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import './Checkout.css'

function Checkout() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    console.log("currentuser", currentUser);

    const [finalvalue, setfinalvalue]=useState(0);

    const [userdetails, setuserdetails]= useState([{
        item: "",
        price: "",
        quantity: ""
    }]);

    const navigate = useNavigate();

    useEffect(() => {
        const getdata = async () =>{
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

             } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        getdata();

    }, []);


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

    console.log("userdetails: ", userdetails);

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
                    {userdetails.map(product => (
                        <div className="product-item">
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
                        <p id='item' className='font-bold'>Final cost</p>
                        <p></p>
                        <p className='font-bold'>₹{finalvalue}</p>
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <button className="mx-12 my-4 px-4 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]" onClick={goToHome}>Payment</button>
            </div>
        </div>

    </>
}

export default Checkout
