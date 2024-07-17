import React,{useEffect, useState, useRef} from 'react'

function Component_home(props) {
    const [counter, setcounter]=useState(props.quantity)
    const counterRef = useRef(counter);

    const initialColor = props.liked ? 'red' : 'white';
    const [fillColour, setFillColour] = useState(initialColor);
    useEffect(() => {
        setFillColour(initialColor);
    }, [props.liked]);


    const [like, setLike] = useState(props.ratings);
    const likeRef = useRef(like);

    const increment = () => {
        setcounter(counter + 1);
    };

    const decrement = () => {
        if(counter>0)
            setcounter(counter - 1);
    };
    

    useEffect(() => {
        if (counterRef.current !== counter) {
            const product={
                email: props.email,
                item: props.name,
                quantity: counter,
                price: props.price,
                ratings: props.ratings
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

        counterRef.current = counter;
    }, [counter]);

    useEffect(() => {
        setcounter(props.quantity);
    }, [props.quantity]);

    const changeColour = () => {
        if(fillColour==='white')
            setLike(like+1);
        else   
            setLike(like-1);
        setFillColour(fillColour === 'white' ? 'red' : 'white');
    };


    useEffect(() => {
        if (likeRef.current !== like) {
            const curproduct={
                email: props.email,
                item: props.name,
                ratings: like
            }

            const changerating = async () =>{
                try {
                    const response=await fetch(`http://localhost:3000/ratings`, {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify(curproduct)
                    });

                    const data = await response.text();

                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            }
            changerating();
        }

        likeRef.current = like;

    }, [like]);

    useEffect(() => {
        setLike(props.ratings);
    }, [props.ratings]);


    return <>
        <div className='my-8 border border-black rounded-xl w-1/5 h-auto mx-auto hover:bg-[#F9F9F9]'>
            <div className='py-4'>
                <div className='flex flex-col justify-center items-center'>
                    <img src={props.imgSrc} className='h-48' />
                    <div className='absolute ml-44 bg-[#EFEFEF] py-0.25 px-2 rounded mb-60 flex items-center'>
                        <button className='mr-1' onClick={changeColour}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={fillColour} xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="red" stroke-width="1"/>
                            </svg>
                        </button>
                        <p className='text-xl'>{like}</p>
                    </div>
                    <h1 className='font-raleway font-black text-xl my-4'>{props.name}</h1>
                </div>
                <div className='flex justify-center items-center'>
                    <p className='mx-4 text-xl font-bold'>₹ {props.price}</p>
                    <div className='mx-4 flex flex-row items-center border border-black bg-white text-black shadow rounded'>
                        <button className='w-8 text-2xl hover:bg-[#EFEFEF]' onClick={decrement} >-</button>
                        <p className='w-8 text-center'>{counter}</p>
                        <button className='w-8 text-2xl hover:bg-[#EFEFEF]' onClick={increment}>+</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Component_home
