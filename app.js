const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// ตั้งค่าให้ Express ใช้ EJS
app.set('view engine', 'ejs');

// ตั้งค่า Body-parser เพื่อดึงข้อมูลจากฟอร์ม
app.use(bodyParser.urlencoded({ extended: true }));

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_nodejs' // เปลี่ยนตามฐานข้อมูลของคุณ
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// กำหนด Port สำหรับเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

// เส้นทางหลัก (READ) เพื่อแสดงรายการทั้งหมด
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { users: results });
    });
});

// CREATE - ฟอร์มเพิ่มผู้ใช้ใหม่
app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/create', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// UPDATE - ฟอร์มแก้ไขผู้ใช้
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.render('edit', { user: result[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [name, email, id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// DELETE - ลบผู้ใช้
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});
