import React from 'react'
import ReactDOM from 'react-dom/client'
import Landing_pg from './components/Landing_pg/Landing_pg'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup.jsx'
import Home from './components/Home/Home.jsx'
import Cart from './components/Cart/Cart.jsx'
import Checkout from './components/Checkout/Checkout.jsx'
import Layout from './Layout.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
        <Route path='' element={<Landing_pg/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='home' element={<Home/>}/>
        <Route path='cart' element={<Cart/>}/>
        <Route path='checkout' element={<Checkout/>}/>
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
