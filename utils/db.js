import mysql from 'mysql2/promise';

const connPromise = mysql.createConnection({
    host: 'localhost', // Địa chỉ máy chủ MySQL
    user: 'root', // Tên người dùng MySQL
    password: '', // Mật khẩu MySQL
    database: 'demo_mycart' // Tên cơ sở dữ liệu
});

export default connPromise;