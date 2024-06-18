import React,{useEffect, useState, useRef} from 'react'

function Component_cart(props) {
    const [counter, setcounter]=useState(props.quantity)
    const counterRef = useRef(counter);

    const increment = () => {
        setcounter(counter + 1);
    };

    const decrement = () => {
        if(counter==0){

        }
        if(counter>0)
            setcounter(counter - 1);
    };
    

    useEffect(() => {
        if (counterRef.current !== counter) {
            const product={
                email: props.email,
                item: props.name,
                quantity: counter,
                price: props.price
            }


            const changevalue = async () =>{

                try {
                    const response=await fetch(`http://localhost:3000/change`, {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify(product)
                    });

                    const data = await response.text();
                    console.log(data);

                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            }
            changevalue();
        }

    }, [counter, setcounter]);

    useEffect(() => {
        setcounter(props.quantity);
    }, [props.quantity]);

    useEffect(() => {
        counterRef.current = counter;
    }, [counter]);


    return <>
        <div className='relative my-8 border border-black shadow-xl rounded-xl w-3/4 h-auto mx-auto hover:bg-[#F9F9F9]'>
            <div className='py-4'>
                <div className='flex'>
                    <img src={props.imgSrc} className='py-1 px-20 h-40 items-center'/>
                    <h1 className='relative font-raleway font-black text-xl my-8 text-center mx-40'>{props.name}</h1>
                </div>
                <div className='flex justify-end -mt-8'>
                    <p className='mx-16 text-xl font-bold'>₹{props.price}</p>
                    <div className='mx-40 flex flex-row items-center border border-black bg-white text-black shadow rounded'>
                        <button className='w-8 text-2xl hover:bg-[#EFEFEF]' onClick={decrement}>-</button>
                        <p className='w-8 text-center'>{counter}</p>
                        <button className='w-8 text-2xl hover:bg-[#EFEFEF]' onClick={increment}>+</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Component_cart
