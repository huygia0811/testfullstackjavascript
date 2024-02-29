import React from 'react';
import axios from 'axios';
import CheckImage from '../public/asset/check.png'
import Image from 'next/image';

const Product = ({ id, image, name, description, price, color, isAddedToCart, updateCartData }) => {
    const overlayStyle = {
        backgroundColor: color,
        opacity: 0.5,
    };

    const addToCart = async () => {
        // Gọi API để thêm sản phẩm vào giỏ hàng
        try {
            const requestData = { product_id: id };
            await axios.post(`/api/cart`, requestData);
            // Sau khi thêm vào giỏ hàng thành công, gọi hàm cập nhật giỏ hàng
            updateCartData();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md relative overflow-hidden">
            <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full" style={overlayStyle}></div>
                <img src={image} alt={name} className="w-full h-48 object-cover mb-2 rounded-t-lg" />
            </div>

            <h2 className="text-xl font-bold my-5 text-gray-800">{name}</h2>

            <p className="text-gray-400 text-sm">{description}</p>
            <div className="flex items-center justify-between mt-4">
                <p className="text-xl font-bold">${price}</p>
                {isAddedToCart ? (
                    <div className='bg-[#F6C90E] rounded-full h-12 w-12 flex items-center justify-center'>
                        <Image src={CheckImage} alt="Added to Cart" className="w-6 h-6" />
                    </div>
                ) : (
                    <button
                        onClick={addToCart}
                        className="bg-[#F6C90E] text-[#303841] font-bold px-4 py-2 rounded-3xl"
                    >
                        ADD TO CART
                    </button>
                )}
            </div>
        </div>
    );
};

export default Product;
