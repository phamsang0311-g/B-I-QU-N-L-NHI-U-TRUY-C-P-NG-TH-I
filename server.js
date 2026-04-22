const express = require('express');
const session = require('express-session');
const fs = require('fs');
const validator = require('validator');
const app = express();

// Cấu hình EJS và Static File
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-key-123',
    resave: false,
    saveUninitialized: true
}));

let students = [
    { id: 1, name: "Nguyen Van A", email: "a@gmail.com" },
    { id: 2, name: "Tran Thi B", email: "b@gmail.com" }
];

// Trang chủ hiển thị danh sách (Sử dụng Bootstrap)
app.get('/', (req, res) => {
    res.render('index', { students, user: req.session.user || null });
});

// API Thêm sinh viên (Bài 1)
app.post('/students', (req, res) => {
    const { name, email } = req.body;
    if (!name || name.length < 2 || !validator.isEmail(email)) {
        return res.status(400).send("Dữ liệu không hợp lệ");
    }
    students.push({ id: Date.now(), name, email });
    res.redirect('/'); // Thêm xong quay về trang chủ
});

// Bài 2: Blocking vs Non-blocking
app.get('/sync', (req, res) => {
    const data = fs.readFileSync('test.txt', 'utf8');
    console.log("Đã đọc Sync");
    res.send("Sync data: " + data);
});

app.get('/async', (req, res) => {
    fs.readFile('test.txt', 'utf8', (err, data) => {
        console.log("Đã đọc Async");
    });
    res.send("Đang xử lý Async...");
});

// Bài 3: Session Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
        req.session.user = username;
        return res.redirect('/');
    }
    res.send("Sai tài khoản!");
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => console.log("Server run at http://localhost:3000"));