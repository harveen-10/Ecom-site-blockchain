import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Component_home from '../Component_home/Component_home'
import './Home.css'

function Home() {
    const location = useLocation();
    const { currentUser } = location.state || {};

    const [usersearch, setusersearch]=useState('');
    const [searchedItem, setSearchedItem]=useState('');

    const navigate = useNavigate();

    const [userdetails, setuserdetails]= useState([{
        item: "",
        price: "",
        img: "",
        quantity: "",
        ratings: "",
        liked: ""
    }]);

    const filters=['beauty', 'clothes', 'electronics', 'home', 'stationary', 'remove filters'];

    const getquantity = async () =>{
        try {
            const response = await fetch(`http://localhost:3000/cart?email=${encodeURIComponent(currentUser.email)}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                }
            });
            
            const data = await response.json();
            console.log(data);
            
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

    const getrating = async () =>{
        try {
            const response = await fetch(`http://localhost:3000/ratings?email=${encodeURIComponent(currentUser.email)}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                }
            });
            
            const data = await response.json();
            console.log("data in home: ", data.rows);
            
            const update = (newdata)=>{
                setuserdetails(currentDetails=> currentDetails.map(prod=>{
                    const match=newdata.find(thing=> thing.item===prod.item);
                    return match ? {...prod, liked: 1} : prod;
                }))
            }

            update(data.rows);
            
        } 
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

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
                    ratings: user.ratings,
                    liked: 0
                })));

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }



        fetchData();
        getquantity();
        getrating();

    }, []);
   

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/searchbar?item=${usersearch}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                }
            });

            const data = await response.json();
            if(data.rows.length===0){
                setSearchedItem("No such product avaliable");
            }
            else if(response.ok){
                setSearchedItem('');
                setuserdetails(data.rows.map(user => ({
                    item: user.name,
                    price: user.price,
                    img: user.img,
                    quantity: 0,
                    ratings: user.ratings,
                    liked: 0
                })));

                getquantity();
                getrating();
            }

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const handleChange = (event) => {
        setusersearch(event.target.value);
    }

    const handleFilter = async (e) =>{
        e.preventDefault();
        const currfilter=e.currentTarget.getAttribute('data-filter-name');
        try {
            const response = await fetch(`http://localhost:3000/filters?filter=${currfilter}`, {
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                }
            });

            const data = await response.json();
            setSearchedItem('');
            setuserdetails(data.rows.map(user => ({
                item: user.name,
                price: user.price,
                img: user.img,
                quantity: 0,
                ratings: user.ratings,
                liked: 0
            })));

            getquantity();
            getrating();
        
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const goToCart = () => {
        navigate('/cart', { state: { currentUser } });
    };

    

    return <>
        <form onSubmit={handleSubmit}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-0">
                <div className="flex items-center mt-1 h-9 rounded-lg bg-white border border-gray-400">
                    <input type="text" name="search" id="search" placeholder="search" value={usersearch} class="ml-4 h-8 w-80 bg-white text-gray-800 font-semibold focus:outline-none" onChange={handleChange}/>
                    <button type='submit' class="ml-2 py-2 px-4 h-9 rounded-lg bg-[#5C75CF] border border-gray-400 text-gray-800 font-semibold hover:bg-[#1C3068]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
                            <path d="M10 2a8 8 0 1 0 5.29 14.29l5.38 5.38a1 1 0 0 0 1.42-1.42l-5.38-5.38A8 8 0 0 0 10 2zm0 2a6 6 0 1 1-4.24 10.24A6 6 0 0 1 10 4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </form>
        <Link to='/'>
            <button className="absolute top-0 right-0 mx-12 my-1 px-3 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]">Logout</button>
        </Link>
        <button className="absolute top-0 right-0 mx-20 my-12 bg-white rounded hover:bg-[#E1E1E1] font-raleway flex flex-col items-center justify-center" onClick={goToCart}>
            <img src="http://res.cloudinary.com/do6otllrf/image/upload/v1718536899/in86goriqafzu2nzemp3.png" className='h-8'/> Cart
        </button>
            <div className='flex items-center justify-center'>
                {filters.map((filter, index) => (
                        <button
                            key={index}
                            data-filter-name={filter}
                            onClick={handleFilter}
                            className="mx-12 my-4 px-3 py-1 border-1 border-[#5C75CF] bg-white text-black rounded shadow hover:bg-[#EFEFEF]">
                            {filter}
                        </button>
                ))}
            </div>
        {searchedItem==="No such product avaliable"?(
            <div className='flex flex-col items-center min-h-screen'>
                <h1 className='font-raleway font-black text-3xl mt-40'>{searchedItem}</h1>
            </div>
        ):(
        <>
            <div className="flex-container">
                {userdetails.map(product => <Component_home imgSrc={product.img} name={product.item} price={product.price} quantity={Number(product.quantity)} ratings={Number(product.ratings)} liked={Number(product.liked)} email={currentUser.email}/>)}
            </div>
        </>
        )}
    </>
}

export default Home
