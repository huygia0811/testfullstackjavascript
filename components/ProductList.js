import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './product';

const ProductList = ({ updateCartData }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách sản phẩm
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                const productList = response.data;

                // Gọi API để lấy danh sách sản phẩm trong giỏ hàng
                const cartResponse = await axios.get('/api/cart');
                const cartItems = cartResponse.data.cart_items;

                // Cập nhật danh sách sản phẩm với thông tin về việc sản phẩm đã được thêm vào giỏ hàng
                const updatedProducts = productList.map((product) => ({
                    ...product,
                    isAddedToCart: cartItems.some((cartItem) => cartItem.product_id === product.id),
                }));

                setProducts(updatedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [updateCartData]); // useEffect sẽ chạy lại khi có thay đổi trong giỏ hàng

    return (
        <div>
            {products.map((product) => (
                <Product key={product.id} {...product} updateCartData={updateCartData} />
            ))}
        </div>
    );
};

export default ProductList;