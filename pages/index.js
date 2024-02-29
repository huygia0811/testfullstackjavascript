import React, { useState, useEffect } from 'react';
import ProductList from '../components/Productlist';
import ShoppingCart from '../components/ShoppingCart';
import Nike from '../public/asset/nike.png';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [cartData, setCartData] = useState([]);
  const [cartTotal, setCartTotal] = useState([]);

  const updateCartData = async () => {
    try {
      const response = await axios.get('/api/cart');
      const cartItems = response.data.cart_items;
      const cartTotal = response.data.total_price;
      setCartData(cartItems);
      setCartTotal(cartTotal);
    } catch (error) {
      console.error('Error updating cart data:', error);
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get('/api/cart');
        const cartItems = response.data.cart_items;
      const cartTotal = response.data.total_price;
      setCartData(cartItems);
      setCartTotal(cartTotal);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  return (
    <div className="md:flex justify-center items-center h-screen">
      <div className="w-1/2 overflow-y-auto rounded-lg shadow-md md:mr-5 ml-5 mb-6" style={{ width: '360px', height: '600px' }}>
        <div className="p-4 text-[#303841] sticky top-0 z-50 bg-white">
          <Image src={Nike} alt="Logo" className="w-12 h-auto inline-block align-middle" />
          <span className="block text-3xl font-bold mt-3">Our Products</span>
        </div>
        {/* Truyền hàm updateCartData xuống ProductList */}
        <ProductList updateCartData={updateCartData} />
      </div>

      <div className="w-1/2 overflow-y-auto rounded-lg shadow-md md:ml-5 ml-5" style={{ width: '360px', height: '600px' }}>
        <div className="p-4 text-[#303841] sticky top-0 z-50 bg-white">
          <Image src={Nike} alt="Logo" className="w-12 h-auto inline-block align-middle" />

          <div className='flex'>
            <span className="block text-3xl font-bold mt-3">Your Cart</span>
            <span className='ml-14 text-2xl font-bold '>${cartTotal}</span>
          </div>
        </div>
        <ShoppingCart cartData={cartData} updateCartData={updateCartData} />
      </div>
    </div>
  )
}
