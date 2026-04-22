const express = require('express');
const session = require('express-session');
const fs = require('fs');
const validator = require('validator');
const app = express();

// Cấu hình View Engine và Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'phamsang-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Dữ liệu mẫu ban đầu
let students = [
    { id: 1001, name: "Nguyễn Văn A", email: "vana@gmail.com" },
    { id: 1002, name: "Trần Thị B", email: "thib@gmail.com" }
];

// --- ROUTES GIAO DIỆN & CRUD ---

// Trang chủ: Hiển thị bảng điều khiển VIP
app.get('/', (req, res) => {
    res.render('index', { 
        students: students, 
        user: req.session.user || null 
    });
});

// Thêm sinh viên (Bài 1)
app.post('/students', (req, res) => {
    const { name, email } = req.body;
    if (!name || name.length < 2 || !validator.isEmail(email)) {
        return res.status(400).send("Dữ liệu không hợp lệ (Tên >= 2 ký tự, Email đúng định dạng)");
    }
    students.push({ id: Date.now(), name, email });
    res.redirect('/');
});

// Xóa sinh viên
app.get('/delete-student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    res.redirect('/');
});

// Sửa sinh viên
app.post('/edit-student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index].name = name;
        students[index].email = email;
    }
    res.redirect('/');
});

// --- BÀI 2: BLOCKING VS NON-BLOCKING ---

app.get('/sync', (req, res) => {
    console.log("--- Bắt đầu Sync ---");
    try {
        const data = fs.readFileSync('test.txt', 'utf8');
        console.log("Nội dung file (Sync):", data);
    } catch (e) {
        console.log("Lỗi: Chưa có file test.txt");
    }
    console.log("--- Kết thúc Sync ---");
    res.redirect('/');
});

app.get('/async', (req, res) => {
    console.log("--- Bắt đầu Async ---");
    fs.readFile('test.txt', 'utf8', (err, data) => {
        if (!err) console.log("Nội dung file (Async):", data);
        console.log("--- Kết thúc việc đọc file (Async) ---");
    });
    console.log("Lệnh này chạy ngay lập tức dù chưa đọc xong file!");
    res.redirect('/');
});

// --- BÀI 3: SESSION LOGIN ---

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
        req.session.user = username;
        return res.redirect('/');
    }
    res.status(400).send("Sai tài khoản hoặc mật khẩu (admin/123456)");
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => console.log("Server VIP đang chạy tại: http://localhost:3000"));