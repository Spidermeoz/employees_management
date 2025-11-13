// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000; 

app.use(cors()); 
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'hr_management' 
});

db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối database:', err.stack);
        return;
    }
    console.log('✅ Đã kết nối Database thành công.');
});

app.get('/api/users', (req, res) => {
    const sql = 'SELECT id, username, password_hash FROM users LIMIT 10'; 

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: 'Lỗi server khi lấy dữ liệu.' });
        }
        res.json({
            message: 'Dữ liệu người dùng được tải thành công.',
            data: results
        });
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Backend API',
        port: PORT
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server Backend đang chạy ổn định tại: http://localhost:${PORT}`);
});