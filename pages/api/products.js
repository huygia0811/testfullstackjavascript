import connPromise from '../../utils/db';

export default async function handler(req, res) {
    try {
        const connection = await connPromise;

        if (req.method === 'GET') {
            const { id } = req.query;
            if (id) {
                // Lấy sản phẩm theo id
                const [product] = await connection.execute('SELECT * FROM product WHERE id = ?', [id]);
                if (product.length === 0) {
                    res.status(404).json({ error: 'Product not found' });
                } else {
                    res.status(200).json(product[0]);
                }
            } else {
                // Lấy tất cả sản phẩm
                const [products] = await connection.execute('SELECT id, image, name, description, ROUND(price, 2) AS price, color FROM product');
                res.status(200).json(products);

            }
        } else if (req.method === 'POST') {
            // Tạo mới sản phẩm
            const { image, name, description, price, color } = req.body;
            if (!image || !name || !description || !price || !color) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            const result = await connection.execute('INSERT INTO product (image, name, description, price, color) VALUES (?, ?, ?, ?, ?)', [image, name, description, price, color]);
            res.status(201).json({ message: 'Product created successfully', productId: result[0].insertId });
        } else if (req.method === 'PUT') {
            // Cập nhật sản phẩm
            const { id } = req.query;
            const { image, name, description, price, color } = req.body;
            if (!image && !name && !description && !price && !color) {
                res.status(400).json({ error: 'No fields provided for update' });
                return;
            }
            const values = [];
            let query = 'UPDATE product SET ';
            if (image) {
                query += 'image = ?, ';
                values.push(image);
            }
            if (name) {
                query += 'name = ?, ';
                values.push(name);
            }
            if (description) {
                query += 'description = ?, ';
                values.push(description);
            }
            if (price) {
                query += 'price = ?, ';
                values.push(price);
            }
            if (color) {
                query += 'color = ?, ';
                values.push(color);
            }
            query = query.slice(0, -2); // Remove trailing comma and space
            query += ' WHERE id = ?';
            values.push(id);
            await connection.execute(query, values);
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
