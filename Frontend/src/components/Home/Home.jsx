import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Component_home from '../Component_home/Component_home'
import './Home.css'

function Home() {
    const location = useLocation();
    const { currentUser } = location.state || {};

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
                const response = await fetch(`http://localhost:3000/home`, {
                    method: "GET"
                });

                const data = await response.json();
                setuserdetails(data.products.rows.map(user => ({
                    item: user.name,
                    price: user.price,
                    img: user.img,
                    quantity: 0,
                })));

            } catch (error) {
                console.error('Error fetching data: ', error);
            }


            try {
                const response = await fetch(`http://localhost:3000/cart?email=${encodeURIComponent(currentUser.email)}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': "application/json",
                    }
                });
                
                const data = await response.json();
                console.log("cart data: ", data.rows);
                
                const update = (newdata)=>{
                    setuserdetails(currentDetails=> currentDetails.map(prod=>{
                        const match=newdata.find(thing=> thing.item===prod.item);
                        return match ? {...prod, quantity: match.quantity} : prod;
                    }))
                }

                update(data.rows);
                
            } 
            catch (error) {
                console.error('Error fetching data: ', error);
            }
        }



        fetchData();

    }, []);


    const goToCart = () => {
        navigate('/cart', { state: { currentUser } });
    };
    

    return <>
        <Link to='/'>
            <button className="absolute top-0 right-0 mx-20 my-1 px-3 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]">Logout</button>
        </Link>
        <button className="absolute top-0 right-0 mx-20 my-12 bg-white rounded hover:bg-[#E1E1E1] font-raleway flex flex-col items-center justify-center" onClick={goToCart}>
            <img src="http://res.cloudinary.com/do6otllrf/image/upload/v1718536899/in86goriqafzu2nzemp3.png" className='h-8'/> Cart
        </button>
        <div className="flex-container">
            {userdetails.map(product => <Component_home imgSrc={product.img} name={product.item} price={product.price} quantity={Number(product.quantity)} email={currentUser.email}/>)}
        </div>
    </>
}

export default Home
