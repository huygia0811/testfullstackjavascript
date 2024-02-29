import React from 'react';
import axios from 'axios';
import decreaseIcon from '../public/asset/minus.png';
import increaseIcon from '../public/asset/plus.png';
import deleteIcon from '../public/asset/trash.png';
import Image from 'next/image';

const ShoppingCart = ({ cartData, updateCartData }) => {
    // Kiểm tra nếu cartData không tồn tại hoặc là undefined
    if (!cartData) {
        return null; // hoặc hiển thị thông báo khác tùy vào yêu cầu của bạn
    }

    const handleQuantityChange = async (productId, action) => {
        try {
            const requestData = { product_id: productId, action };
            await axios.put(`/api/cart`, requestData);
            // Sau khi cập nhật thành công, gọi lại API để lấy dữ liệu giỏ hàng mới
            updateCartData();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg h-full">
            {cartData.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartData.map((item) => (
                        <li key={item.product_id} className="flex items-center mb-10">
                            {/* Phần 1: Hình ảnh */}
                            <div
                                className="flex items-center justify-center"
                                style={{ backgroundColor: item.color, width: '60px', height: '60px', borderRadius: '100%' }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                />
                            </div>

                            {/* Phần 2: Thông tin name, price, và quantity */}
                            <div className='ml-4 flex-grow'>
                                <div>
                                    <strong>{item.name}</strong>
                                </div>

                                <div className="mr-2 my-3 font-bold text-2xl">${item.price}</div>

                                <div className="flex items-center ml-auto">
                                    <button
                                        onClick={() => handleQuantityChange(item.product_id, 'decrease')}
                                        className="bg-transparent border-none cursor-pointer"
                                    >
                                        <Image src={decreaseIcon} alt="Decrease Quantity" className="w-6 h-6" />
                                    </button>

                                    <span className="mx-5">{item.quantity}</span>

                                    <button
                                        onClick={() => handleQuantityChange(item.product_id, 'increase')}
                                        className="bg-transparent border-none cursor-pointer"
                                    >
                                        <Image src={increaseIcon} alt="Increase Quantity" className="w-6 h-6" />
                                    </button>

                                    <button
                                        onClick={() => handleQuantityChange(item.product_id, 'delete')}
                                        className="bg-transparent border-none cursor-pointer ml-20"
                                    >
                                        <Image src={deleteIcon} alt="Delete" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ShoppingCart;