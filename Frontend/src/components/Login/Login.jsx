import React, { useState } from 'react'
import Landing_pg from '../Landing_pg/Landing_pg'
import {Link, useNavigate} from 'react-router-dom'

function Login() {
    const [responseMessage, setResponseMessage] = useState("");
    const [user, setuser] = useState({
        email: "",
        password: "",
    });
    const navigate=useNavigate();
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        console.log(user);

        try{
            const response=await fetch(`http://localhost:3000/login`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(user)
            });

            const responseData = await response.text();
            
            if(responseData==="Incorrect password" || responseData==="User not found" || responseData==="Email is required"){
                setResponseMessage(responseData);
            }
            else if(response.ok){
                const currentUser = { email: user.email };
                setuser({
                    email: "",
                    name: "",
                    password: "",            
                });
                console.log("currentuser: ", currentUser);
                navigate("/home", { state: { currentUser } });
            }
        }
        catch(err){
            console.log("error in registration", err);
        }
    }
      

    return <>
        <form onSubmit={handleSubmit}>
            <div className='font-raleway fixed inset-0 w-full h-screen bg-black bg-opacity-60 z-10'>
            <div className='flex justify-center items-center h-screen'>
                <div className='bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col'> 
                    <label htmlFor="email" className="font-semibold text-gray-800">Email</label>
                    <input type="email" name="email" id="email" value={user.email} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, email: e.target.value })}/>
                    <label htmlFor="password" className="mt-4 font-semibold text-gray-800">Password</label>
                    <input type="password" name="password" id="password" value={user.password} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, password: e.target.value })}/>
                    <p className='text-red-700'>{responseMessage}</p>
                    <button type='submit' className='w-1/3 mx-auto px-3 py-1 my-4 bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]'>Login</button>
                    <div className='border-t border-gray-300 my-4'></div>
                    <p className='mx-auto'>Dont have an account?</p>
                    <Link to='/signup' className='flex justify-center'>
                        <button className='w-1/4 mx-auto px-3 py-1 bg-[#FFAC30] text-white rounded shadow hover:bg-[#D08D2A]'>Sign up</button>
                    </Link>
                </div>
            </div>
            </div>
        </form>
        <Landing_pg/>
    </>
}

export default Login
