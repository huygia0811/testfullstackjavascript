import connPromise from '../../utils/db';

export default async function handler(req, res) {
    try {
        const connection = await connPromise;

        if (req.method === 'GET') {
            // Lấy toàn bộ sản phẩm trong giỏ hàng và tổng tiền
            const result = await connection.execute(
                "SELECT p.color, p.image, c.product_id, p.name, ROUND(p.price, 2) AS price, c.quantity, (p.price * c.quantity) as total_price FROM cart c JOIN product p ON c.product_id = p.id"
            );
            let totalPrice = 0;
            const cartItems = result[0].map(row => {
                row.total_price = row.total_price.toFixed(2); // Định dạng tổng giá tiền
                totalPrice += parseFloat(row.total_price);
                return row;
            });
            totalPrice = totalPrice.toFixed(2); // Định dạng tổng giá tiền
            res.json({ cart_items: cartItems, total_price: totalPrice });
        } else if (req.method === 'POST') {
            // Thêm sản phẩm vào giỏ hàng
            const { product_id } = req.body;
            if (!product_id) {
                return res.status(400).json({ error: 'Product ID is required' });
            }
            await connection.execute("INSERT INTO cart (product_id, quantity) VALUES (?, 1)", [product_id]);
            res.json({ message: 'Product added to cart successfully' });
        } else if (req.method === 'PUT') {
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            const { product_id, action } = req.body;
            if (!action) {
                return res.status(400).json({ error: 'Action is required' });
            }
            let query;
            if (action === 'increase') {
                query = "UPDATE cart SET quantity = quantity + 1 WHERE product_id = ?";
            } else if (action === 'decrease') {
                query = "UPDATE cart SET quantity = GREATEST(quantity - 1, 0) WHERE product_id = ?";
            } else if (action === 'delete') {
                query = "DELETE FROM cart WHERE product_id = ?";
            } else {
                return res.status(400).json({ error: 'Invalid action' });
            }
            await connection.execute(query, [product_id]);

            // Kiểm tra nếu quantity = 0, thực hiện xóa sản phẩm khỏi giỏ hàng
            if (action === 'decrease') {
                const checkQuantity = await connection.execute("SELECT quantity FROM cart WHERE product_id = ?", [product_id]);
                const quantity = checkQuantity[0][0].quantity;
                if (quantity === 0) {
                    await connection.execute("DELETE FROM cart WHERE product_id = ?", [product_id]);
                }
            }
            res.json({ message: 'Action completed successfully' });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
