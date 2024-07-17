import React, {useState, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Component_cart from '../Component_cart/Component_cart';
import './Cart.css'

function Cart() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    console.log("currentuser", currentUser);
    
    const [emptycart, setemptycart]=useState("Cart is empty");

    const navigate = useNavigate();

    const [userdetails, setuserdetails]= useState([{
        item: "",
        price: "",
        img: "",
        quantity: "",
    }]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/cart?email=${encodeURIComponent(currentUser.email)}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    }
                });
                
                const data = await response.json();
                if(data.rows.length===0){
                    setemptycart("Cart is empty")
                }
                else{
                    setemptycart(false);
                    setuserdetails(data.rows.map(user => ({
                        item: user.item,
                        price: user.price,
                        img: "",
                        quantity: user.quantity,
                    }))); 
                }               
            } 
            catch (error) {
                console.error('Error fetching data: ', error);
            }

            try {
                const response = await fetch(`http://localhost:3000/home`, {
                    method: "GET"
                });

                const data = await response.json();

                const update = (newdata)=>{
                    setuserdetails(currentDetails=> currentDetails.map(prod=>{
                        const match=newdata.find(thing=> thing.name===prod.item);
                        return match ? {...prod, img: match.img} : prod;
                    }))
                }

                update(data.products.rows);
                    

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData();

    }, []);

    const goToHome = () => {
        navigate('/home', { state: { currentUser } });
    };

    const goToCheckout = () => {
        navigate('/checkout', { state: { currentUser } });
    };


    return <>
        <button className="absolute top-0 right-0 mx-20 my-12 bg-white rounded hover:bg-[#E1E1E1] font-raleway flex flex-col items-center justify-center" onClick={goToHome}>
            <img src="http://res.cloudinary.com/do6otllrf/image/upload/v1718537913/ki7teuo85ioeltbtrwhb.png" className='h-8'/> Home
        </button>  
        {emptycart==="Cart is empty"?(
            <div className='flex flex-col items-center min-h-screen'>
                <h1 className='font-raleway font-black text-3xl mt-40'>{emptycart}</h1>
            </div>
        ):(
        <>
        <div className="flex-container">
            {userdetails.map(product => <Component_cart imgSrc={product.img} name={product.item} price={product.price} quantity={Number(product.quantity)} email={currentUser.email}/>)}
        </div>
        <div className='flex justify-end'>
        <button className="mx-20 my-8 px-3 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]" onClick={goToCheckout}>Proceed to checkout</button>
        </div>
        </>
        )}
    </>
}

export default Cart
