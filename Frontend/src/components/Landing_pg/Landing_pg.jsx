import React from 'react'
import {Link} from 'react-router-dom'

function Landing_pg() {
    return <>
        <Link to='/login'>
        <button className="absolute top-0 right-0 mx-20 my-1 px-3 py-1 border border-[#5C75CF] bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]">Login</button>
        </Link>
        <div className="flex">
            <img src="http://res.cloudinary.com/do6otllrf/image/upload/v1718473466/yfgvfib9rhnw9fkyalp8.jpg" className='h-50 mx-10 '/>
            <div className='ml-40 text-center font-raleway'>
                <div className='mt-16 font-black text-5xl'>
                    <h1 className='mb-4'>SHOP</h1>
                    <h1 className='mb-12'>SPHERE</h1>
                </div>
                <p>
                    Experience the joy of shopping from the comfort
                    <br/>of your home - endless choices, unbeatable deals,
                    <br/>and seamless service.
                </p>
            </div>
        </div>
    </>
}

export default Landing_pg
