import React,{useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

function Checkout() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    console.log("currentuser", currentUser);

    const [finalvalue, setfinalvalue]=useState(0);

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

    return <>
        <div className='my-8 border border-black shadow-xl rounded-xl w-1/2 h-auto mx-auto hover:bg-[#F9F9F9]'>
            <div className='py-8'>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='font-raleway text-3xl my-4'>Your total amount is: </h1>
                    <p className='mx-12 text-3xl font-bold'>₹{finalvalue}</p>
                </div>
            </div>
            <div className='flex justify-end'>
                <button className="mx-12 my-8 px-4 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]" onClick={goToHome}>Go to Home</button>
            </div>
        </div>

    </>
}

export default Checkout
